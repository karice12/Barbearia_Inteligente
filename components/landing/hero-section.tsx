'use client';
import Link from'next/link';
 import Image from'next/image';
import { ArrowRight, Star, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-barbershop.jpg"
          alt="Barbearia moderna e sofisticada"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/60" />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-1/4 right-10 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-56 h-56 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          {/* Eyebrow badge */}
          <div className="animate-fade-up">
            <Badge className="mb-6 bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30 text-sm px-4 py-1.5">
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Plataforma #1 para Barbearias no Brasil
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight text-balance animate-fade-up-delay-1">
            Chega de{' '}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              cadeira vazia.
            </span>{' '}
            <br />
            Sua barbearia no{' '}
            <span className="text-white underline decoration-orange-500 decoration-4 underline-offset-4">
              próximo nível.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl animate-fade-up-delay-2">
            BarberPro é o sistema completo que cuida do agendamento, recupera clientes sumidos
            automaticamente e ainda calcula as comissões dos seus barbeiros — tudo em um só lugar.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-up-delay-3">
            <Link href="/agendar">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-lg px-8 py-6 rounded-xl shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Testar Agendamento Online
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white text-lg px-8 py-6 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Ver Dashboard Admin
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 animate-fade-up-delay-3">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-slate-900 bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-xs font-bold text-white"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-400 mt-0.5">+2.400 barbearias ativas</p>
              </div>
            </div>
            <div className="h-px sm:h-10 w-full sm:w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" />
              <p className="text-sm text-slate-300">
                <span className="font-bold text-white">R$ 12M+</span> em serviços agendados/mês
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
        <span className="text-xs tracking-widest uppercase">Role para ver</span>
        <div className="w-px h-10 bg-gradient-to-b from-slate-500 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
