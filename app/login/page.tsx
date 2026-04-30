'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Scissors, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Card */}
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
            <h1 className="font-display font-black text-white text-2xl">Bem-vindo de volta</h1>
            <p className="text-slate-400 text-sm mt-1">Entre na sua conta para acessar o painel</p>
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
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-700">Senha</Label>
                <button type="button" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <p className="text-center text-sm text-slate-500">
              Ainda não tem conta?{' '}
              <Link href="/register" className="text-orange-500 hover:text-orange-600 font-semibold">
                Criar conta grátis
              </Link>
            </p>

            {/* Demo credentials */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center mb-3 font-medium">Credenciais de demonstração</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Dono', email: 'dono@barberpro.com' },
                  { label: 'Barbeiro', email: 'thiago@barberpro.com' },
                  { label: 'Recepção', email: 'recepcao@barberpro.com' },
                ].map((demo) => (
                  <button
                    key={demo.email}
                    type="button"
                    onClick={() => { setEmail(demo.email); setPassword('123456') }}
                    className="text-xs p-2 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-lg text-slate-600 hover:text-orange-600 transition-all duration-150 font-medium"
                  >
                    {demo.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">Senha: 123456 para todos</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
