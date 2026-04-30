'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';


export type UserRole = 'owner' | 'barber' | 'receptionist';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
  barbershopName: string;
  logoUrl?: string;
  subscriptionStatus?: string;
  ownerId?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    businessName?: string
  ) => Promise<{ error?: string }>;
  logout: () => void;
  updateRole: (role: UserRole) => void;
  updateLogo: (url: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function buildInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const loadProfile = useCallback(
    async (userId: string, email: string) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, business_name, avatar_url, role, subscription_status, owner_id')
        .eq('id', userId)
        .single();

      if (profile) {
        const authUser: AuthUser = {
          id: userId,
          name: profile.full_name || email.split('@')[0],
          email,
          role: (profile.role as UserRole) || 'owner',
          initials: buildInitials(profile.full_name || email.split('@')[0]),
          barbershopName: profile.business_name || 'Minha Barbearia',
          logoUrl: profile.avatar_url || undefined,
          subscriptionStatus: profile.subscription_status || 'trialing',
          ownerId: profile.owner_id || undefined,
        };
        setUser(authUser);
      }
    },
    [supabase]
  );

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await loadProfile(session.user.id, session.user.email || '');
      }
      setIsLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [loadProfile, supabase.auth]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { error: 'E-mail ou senha incorretos.' };
      }
      return {};
    },
    [supabase]
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: UserRole,
      businessName = 'Minha Barbearia'
    ) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role,
            business_name: businessName,
          },
        },
      });
      if (error) {
        if (error.message.includes('already registered')) {
          return { error: 'Este e-mail já está cadastrado.' };
        }
        return { error: error.message };
      }
      return {};
    },
    [supabase]
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  const updateRole = useCallback((role: UserRole) => {
    setUser((prev) => (prev ? { ...prev, role } : prev));
  }, []);

  const updateLogo = useCallback((url: string) => {
    setUser((prev) => (prev ? { ...prev, logoUrl: url } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, updateRole, updateLogo }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export const roleLabels: Record<UserRole, string> = {
  owner: 'Dono',
  barber: 'Barbeiro',
  receptionist: 'Recepcionista',
};

// Permissions per role
export const rolePermissions: Record<
  UserRole,
  {
    canSeeRevenue: boolean;
    canSeeCommissions: boolean;
    canSeeMarketing: boolean;
    canSeeFinanceiro: boolean;
    canManageTeam: boolean;
    canExportData: boolean;
  }
> = {
  owner: {
    canSeeRevenue: true,
    canSeeCommissions: true,
    canSeeMarketing: true,
    canSeeFinanceiro: true,
    canManageTeam: true,
    canExportData: true,
  },
  receptionist: {
    canSeeRevenue: false,
    canSeeCommissions: false,
    canSeeMarketing: true,
    canSeeFinanceiro: false,
    canManageTeam: false,
    canExportData: false,
  },
  barber: {
    canSeeRevenue: false,
    canSeeCommissions: true,
    canSeeMarketing: false,
    canSeeFinanceiro: false,
    canManageTeam: false,
    canExportData: false,
  },
};
