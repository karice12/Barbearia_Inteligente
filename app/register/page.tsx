'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
 import Link from'next/link';
import { Eye, EyeOff, Scissors, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, type UserRole } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<UserRole>('owner')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setLoading(true)
    const result = await register(name, email, password, role)
    setLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    router.push('/dashboard')
  }

  const roles: { value: UserRole; label: string; description: string }[] = [
    { value: 'owner', label: 'Dono', description: 'Acesso total ao sistema' },
    { value: 'barber', label: 'Barbeiro', description: 'Agenda e comissões próprias' },
    { value: 'receptionist', label: 'Recepcionista', description: 'Agenda e CRM de clientes' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 pb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/40">
                <Scissors className="w-5 h-5 text-white rotate-45" />
              </div>
              <span className="font-display font-black text-white text-xl">
                Barber<span className="text-orange-400">Pro</span>
              </span>
            </div>
            <h1 className="font-display font-black text-white text-2xl">Criar conta grátis</h1>
            <p className="text-slate-400 text-sm mt-1">14 dias de teste grátis, sem cartão de crédito</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Nome completo</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
                className="border-slate-200 focus-visible:ring-orange-400 h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">E-mail</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="border-slate-200 focus-visible:ring-orange-400 h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Senha</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="border-slate-200 focus-visible:ring-orange-400 h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Perfil de acesso</Label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={cn(
                      'relative p-3 rounded-xl border-2 text-left transition-all duration-200',
                      role === r.value
                        ? 'border-orange-400 bg-orange-50' :'border-slate-200 hover:border-slate-300 bg-white'
                    )}
                  >
                    {role === r.value && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                    <p className={cn('font-semibold text-xs', role === r.value ? 'text-orange-700' : 'text-slate-700')}>
                      {r.label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{r.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full h-11 rounded-xl font-semibold text-white shadow-md shadow-orange-500/30 transition-all duration-200',
                'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600',
                'hover:scale-[1.01] active:scale-[0.99]',
                loading && 'opacity-70 cursor-not-allowed'
              )}
            >
              {loading ? 'Criando conta...' : 'Criar conta grátis'}
            </Button>

            <p className="text-center text-sm text-slate-500">
              Já tem conta?{' '}
              <Link href="/login" className="text-orange-500 hover:text-orange-600 font-semibold">
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
