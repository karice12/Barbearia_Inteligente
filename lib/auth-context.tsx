'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type UserRole = 'owner' | 'barber' | 'receptionist'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  initials: string
  barbershopName: string
  logoUrl?: string
}

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ error?: string }>
  logout: () => void
  updateRole: (role: UserRole) => void
  updateLogo: (url: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

// Usuários mock simulando banco de dados
const MOCK_USERS: (AuthUser & { password: string })[] = [
  {
    id: 'usr-1',
    name: 'João Carlos',
    email: 'dono@barberpro.com',
    password: '123456',
    role: 'owner',
    initials: 'JC',
    barbershopName: 'Barbearia do João',
  },
  {
    id: 'usr-2',
    name: 'Thiago Oliveira',
    email: 'thiago@barberpro.com',
    password: '123456',
    role: 'barber',
    initials: 'TO',
    barbershopName: 'Barbearia do João',
  },
  {
    id: 'usr-3',
    name: 'Ana Recepção',
    email: 'recepcao@barberpro.com',
    password: '123456',
    role: 'receptionist',
    initials: 'AR',
    barbershopName: 'Barbearia do João',
  },
]

const SESSION_KEY = 'barberpro_session'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600)) // simula latência
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) return { error: 'E-mail ou senha incorretos.' }
    const { password: _, ...authUser } = found
    setUser(authUser)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(authUser))
    return {}
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string, role: UserRole) => {
      await new Promise((r) => setTimeout(r, 800))
      const exists = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (exists) return { error: 'Este e-mail já está cadastrado.' }
      const newUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role,
        initials: name
          .split(' ')
          .map((p) => p[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
        barbershopName: 'Minha Barbearia',
      }
      MOCK_USERS.push({ ...newUser, password })
      setUser(newUser)
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(newUser))
      return {}
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem(SESSION_KEY)
  }, [])

  const updateRole = useCallback((role: UserRole) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, role }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const updateLogo = useCallback((url: string) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, logoUrl: url }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateRole, updateLogo }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const roleLabels: Record<UserRole, string> = {
  owner: 'Dono',
  barber: 'Barbeiro',
  receptionist: 'Recepcionista',
}

// Permissões por perfil
export const rolePermissions: Record<UserRole, {
  canSeeRevenue: boolean
  canSeeCommissions: boolean
  canSeeMarketing: boolean
  canSeeFinanceiro: boolean
  canManageTeam: boolean
  canExportData: boolean
}> = {
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
    canSeeCommissions: true, // apenas as próprias
    canSeeMarketing: false,
    canSeeFinanceiro: false,
    canManageTeam: false,
    canExportData: false,
  },
}
