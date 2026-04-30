-- ============================================================
-- BarberPro — Full Backend Migration
-- Adds: role column, RLS policies, barber_id FK, trigger
-- ============================================================

-- 1. Add role column to profiles (if not exists)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'owner',
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- 2. Ensure services has duration_minutes and price (already exist per schema, but ensure active flag)
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 3. Add barber_id FK to appointments (links appointment to the barber/professional)
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS barber_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS price NUMERIC(10,2);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_owner_id ON public.profiles(owner_id);
CREATE INDEX IF NOT EXISTS idx_appointments_barber_id ON public.appointments(barber_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_services_user_id ON public.services(user_id);

-- ============================================================
-- 5. Helper functions (MUST be before RLS policies)
-- ============================================================

-- Returns the role of the current authenticated user
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Returns the owner_id of the current authenticated user
CREATE OR REPLACE FUNCTION public.get_my_owner_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(owner_id, id) FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Returns true if current user is owner of the barbershop
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'owner'
  );
$$;

-- Returns true if current user is a barber
CREATE OR REPLACE FUNCTION public.is_barber()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'barber'
  );
$$;

-- Trigger function: auto-create profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    business_name,
    avatar_url,
    role,
    subscription_status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'business_name', 'Minha Barbearia'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'owner'),
    'trialing',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    role = COALESCE(EXCLUDED.role, public.profiles.role),
    updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- 6. Enable RLS on all tables
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 7. RLS Policies — profiles
-- ============================================================

-- Users can read/update their own profile
DROP POLICY IF EXISTS "profiles_own_access" ON public.profiles;
CREATE POLICY "profiles_own_access"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Owners can read profiles of their team members (barbers/receptionists)
DROP POLICY IF EXISTS "owner_read_team_profiles" ON public.profiles;
CREATE POLICY "owner_read_team_profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR id = auth.uid()
  );

-- ============================================================
-- 8. RLS Policies — services
-- ============================================================

-- Users can manage their own services
DROP POLICY IF EXISTS "services_owner_access" ON public.services;
CREATE POLICY "services_owner_access"
  ON public.services
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() OR user_id = public.get_my_owner_id())
  WITH CHECK (user_id = auth.uid() OR user_id = public.get_my_owner_id());

-- ============================================================
-- 9. RLS Policies — appointments (multi-tenancy)
-- ============================================================

-- Owners see ALL appointments for their barbershop (where user_id = owner's id)
DROP POLICY IF EXISTS "appointments_owner_full_access" ON public.appointments;
CREATE POLICY "appointments_owner_full_access"
  ON public.appointments
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid()
    OR user_id = public.get_my_owner_id()
  )
  WITH CHECK (
    user_id = auth.uid()
    OR user_id = public.get_my_owner_id()
  );

-- Barbers can only see appointments assigned to them
DROP POLICY IF EXISTS "appointments_barber_own_only" ON public.appointments;
CREATE POLICY "appointments_barber_own_only"
  ON public.appointments
  FOR SELECT
  TO authenticated
  USING (
    barber_id = auth.uid()
    OR user_id = auth.uid()
    OR user_id = public.get_my_owner_id()
  );

-- ============================================================
-- 10. Trigger: auto-create profile on signup
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 11. Mock demo users for testing
-- ============================================================
DO $$
DECLARE
  owner_uuid UUID := gen_random_uuid();
  barber_uuid UUID := gen_random_uuid();
  receptionist_uuid UUID := gen_random_uuid();
BEGIN
  -- Owner
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES (
    owner_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'dono@barberpro.com', crypt('123456', gen_salt('bf', 10)), now(), now(), now(),
    jsonb_build_object('full_name', 'João Carlos', 'role', 'owner', 'business_name', 'Barbearia do João'),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
    false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
  ) ON CONFLICT (id) DO NOTHING;

  -- Barber (linked to owner)
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES (
    barber_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'thiago@barberpro.com', crypt('123456', gen_salt('bf', 10)), now(), now(), now(),
    jsonb_build_object('full_name', 'Thiago Oliveira', 'role', 'barber', 'business_name', 'Barbearia do João'),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
    false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
  ) ON CONFLICT (id) DO NOTHING;

  -- Receptionist (linked to owner)
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES (
    receptionist_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'recepcao@barberpro.com', crypt('123456', gen_salt('bf', 10)), now(), now(), now(),
    jsonb_build_object('full_name', 'Ana Recepção', 'role', 'receptionist', 'business_name', 'Barbearia do João'),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
    false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
  ) ON CONFLICT (id) DO NOTHING;

  -- Link barber and receptionist to owner
  UPDATE public.profiles SET owner_id = owner_uuid WHERE id = barber_uuid;
  UPDATE public.profiles SET owner_id = owner_uuid WHERE id = receptionist_uuid;

  -- Demo services for owner
  INSERT INTO public.services (id, user_id, name, description, price, duration_minutes)
  VALUES
    (gen_random_uuid(), owner_uuid, 'Corte Degradê', 'Degradê moderno com acabamento perfeito', 50.00, 30),
    (gen_random_uuid(), owner_uuid, 'Barba na Toalha Quente', 'Relaxamento e acabamento profissional', 35.00, 20),
    (gen_random_uuid(), owner_uuid, 'Combo Corte + Barba', 'Pacote completo com desconto especial', 75.00, 50),
    (gen_random_uuid(), owner_uuid, 'Barboterapia', 'Tratamento premium com óleos essenciais', 60.00, 40),
    (gen_random_uuid(), owner_uuid, 'Hidratação Capilar', 'Nutrição profunda para cabelos ressecados', 45.00, 35),
    (gen_random_uuid(), owner_uuid, 'Pigmentação', 'Cobertura de fios brancos e coloração natural', 90.00, 60)
  ON CONFLICT (id) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Mock data error: %', SQLERRM;
END $$;
