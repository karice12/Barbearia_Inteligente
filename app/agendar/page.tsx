'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Scissors, Clock, Star, Phone, User, CalendarDays, CheckCircle2, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { services, professionals, availableSlots, type Service, type Professional } from '@/lib/mock-data'
import { toast } from 'sonner'

type Step = 1 | 2 | 3 | 4

const DAYS = [
  { label: 'Seg', date: 21, available: true },
  { label: 'Ter', date: 22, available: true },
  { label: 'Qua', date: 23, available: true },
  { label: 'Qui', date: 24, available: true },
  { label: 'Sex', date: 25, available: true },
  { label: 'Sáb', date: 26, available: true },
  { label: 'Dom', date: 27, available: false },
]

const UNAVAILABLE_SLOTS = ['10:00', '14:00', '15:30']

const steps = [
  { number: 1, label: 'Serviço' },
  { number: 2, label: 'Profissional' },
  { number: 3, label: 'Data & Hora' },
  { number: 4, label: 'Confirmação' },
]

export default function AgendarPage() {
  const [step, setStep] = useState<Step>(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [booked, setBooked] = useState(false)

  function goNext() {
    if (step < 4) setStep((prev) => (prev + 1) as Step)
  }
  function goBack() {
    if (step > 1) setStep((prev) => (prev - 1) as Step)
  }

  function handleConfirm() {
    if (!clientName || !clientPhone) {
      toast.error('Preencha seu nome e telefone para confirmar.')
      return
    }
    setBooked(true)
    toast.success('Agendamento confirmado! Você receberá uma mensagem no WhatsApp.')
  }

  if (booked) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h1 className="font-display text-3xl font-black text-slate-900 mb-2">
          Agendamento confirmado!
        </h1>
        <p className="text-slate-500 mb-2 leading-relaxed max-w-sm">
          <strong>{clientName}</strong>, seu horário para{' '}
          <strong>{selectedService?.name}</strong> com{' '}
          <strong>{selectedPro?.name}</strong> está marcado para sábado, {selectedDay}/04 às{' '}
          <strong>{selectedSlot}</strong>.
        </p>
        <p className="text-sm text-slate-400 mb-8">
          Um lembrete será enviado via WhatsApp para <strong>{clientPhone}</strong>.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setBooked(false)
              setStep(1)
              setSelectedService(null)
              setSelectedPro(null)
              setSelectedDay(null)
              setSelectedSlot(null)
              setClientName('')
              setClientPhone('')
            }}
            variant="outline"
            className="hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Fazer outro agendamento
          </Button>
          <Link href="/">
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-orange-500/30">
              Voltar ao início
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-white rotate-45" />
            </div>
            <span className="font-display font-black text-slate-900">
              Barber<span className="text-orange-500">Pro</span>
            </span>
          </div>
          <div className="w-6" />
        </div>
      </header>

      {/* Progress steps */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                      step > s.number
                        ? 'bg-emerald-500 text-white'
                        : step === s.number
                        ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30'
                        : 'bg-slate-100 text-slate-400'
                    )}
                  >
                    {step > s.number ? <Check className="w-4 h-4" /> : s.number}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium hidden sm:block',
                      step === s.number ? 'text-orange-500' : 'text-slate-400'
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-0.5 flex-1 mx-2 transition-all duration-500',
                      step > s.number ? 'bg-emerald-400' : 'bg-slate-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">

        {/* STEP 1: Serviço */}
        {step === 1 && (
          <div className="animate-fade-up">
            <h2 className="font-display text-2xl font-black text-slate-900 mb-1">
              Qual serviço deseja?
            </h2>
            <p className="text-slate-500 text-sm mb-6">Selecione um dos serviços abaixo</p>

            <div className="grid grid-cols-1 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]',
                    selectedService?.id === service.id
                      ? 'border-orange-500 bg-orange-50 shadow-md shadow-orange-500/10'
                      : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/30'
                  )}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-slate-900">{service.name}</p>
                    <p className="text-slate-500 text-sm mt-0.5 truncate">{service.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {service.duration} min
                      </span>
                      <span className="font-bold text-orange-500 text-sm">
                        R$ {service.price}
                      </span>
                    </div>
                  </div>
                  {selectedService?.id === service.id && (
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Profissional */}
        {step === 2 && (
          <div className="animate-fade-up">
            <h2 className="font-display text-2xl font-black text-slate-900 mb-1">
              Escolha o profissional
            </h2>
            <p className="text-slate-500 text-sm mb-6">Ou deixamos escolher o disponível para você</p>

            <div className="space-y-4">
              {professionals.map((pro) => (
                <button
                  key={pro.id}
                  onClick={() => setSelectedPro(pro)}
                  className={cn(
                    'w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]',
                    selectedPro?.id === pro.id
                      ? 'border-orange-500 bg-orange-50 shadow-md shadow-orange-500/10'
                      : 'border-slate-200 bg-white hover:border-orange-200'
                  )}
                >
                  <div className="w-14 h-14 rounded-2xl overflow-hidden relative flex-shrink-0">
                    <Image src={pro.avatar} alt={pro.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-bold text-slate-900">{pro.name}</p>
                    <p className="text-slate-500 text-sm">{pro.role}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-slate-700">{pro.rating}</span>
                      </div>
                      <div className="flex gap-1">
                        {pro.specialties.map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="text-xs px-1.5 py-0 bg-slate-100 text-slate-600"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  {selectedPro?.id === pro.id && (
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Data e Hora */}
        {step === 3 && (
          <div className="animate-fade-up">
            <h2 className="font-display text-2xl font-black text-slate-900 mb-1">
              Quando você quer vir?
            </h2>
            <p className="text-slate-500 text-sm mb-6">Escolha o dia e horário de preferência</p>

            {/* Day selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Abril 2025
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {DAYS.map((day) => (
                  <button
                    key={day.date}
                    disabled={!day.available}
                    onClick={() => setSelectedDay(day.date)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl min-w-[52px] transition-all duration-200',
                      !day.available
                        ? 'opacity-40 cursor-not-allowed bg-slate-50'
                        : selectedDay === day.date
                        ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 scale-105'
                        : 'bg-slate-50 hover:bg-orange-50 hover:text-orange-600'
                    )}
                  >
                    <span className={cn('text-xs font-medium', selectedDay === day.date ? 'text-white/80' : 'text-slate-400')}>
                      {day.label}
                    </span>
                    <span className={cn('text-lg font-black', selectedDay === day.date ? 'text-white' : 'text-slate-900')}>
                      {day.date}
                    </span>
                    {day.available && (
                      <div className={cn('w-1.5 h-1.5 rounded-full', selectedDay === day.date ? 'bg-white/60' : 'bg-emerald-400')} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Time slots */}
            {selectedDay && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Horários disponíveis
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => {
                    const unavailable = UNAVAILABLE_SLOTS.includes(slot)
                    return (
                      <button
                        key={slot}
                        disabled={unavailable}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          'py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                          unavailable
                            ? 'bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                            : selectedSlot === slot
                            ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 scale-105'
                            : 'bg-slate-50 text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                        )}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Confirmação */}
        {step === 4 && (
          <div className="animate-fade-up">
            <h2 className="font-display text-2xl font-black text-slate-900 mb-1">
              Confirme seus dados
            </h2>
            <p className="text-slate-500 text-sm mb-6">Quase lá! Informe seu contato para finalizar.</p>

            {/* Summary card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Resumo do agendamento
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Serviço</span>
                  <span className="font-semibold text-slate-900 text-sm">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Profissional</span>
                  <span className="font-semibold text-slate-900 text-sm">{selectedPro?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Data</span>
                  <span className="font-semibold text-slate-900 text-sm">Sáb, {selectedDay}/04 às {selectedSlot}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Duração</span>
                  <span className="font-semibold text-slate-900 text-sm">{selectedService?.duration} minutos</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-black text-orange-500 text-lg">R$ {selectedService?.price}</span>
                </div>
              </div>
            </div>

            {/* Client form */}
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Seu nome completo"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-slate-200 focus:border-orange-400 focus:ring-orange-400/20"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="WhatsApp (com DDD)"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-slate-200 focus:border-orange-400 focus:ring-orange-400/20"
                  type="tel"
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Ao confirmar, você receberá um lembrete via WhatsApp 24h antes do seu horário.
            </p>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="sticky bottom-0 bg-white border-t border-slate-100 shadow-xl">
        <div className="max-w-lg mx-auto px-4 py-4 flex gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={goBack}
              className="flex-shrink-0 h-14 px-5 rounded-xl border-slate-200 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}

          {step < 4 ? (
            <Button
              className="flex-1 h-14 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-base shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
              onClick={goNext}
              disabled={
                (step === 1 && !selectedService) ||
                (step === 2 && !selectedPro) ||
                (step === 3 && (!selectedDay || !selectedSlot))
              }
            >
              {step === 3 ? 'Confirmar dados' : 'Continuar'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          ) : (
            <Button
              className="flex-1 h-14 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              onClick={handleConfirm}
            >
              <CalendarDays className="mr-2 w-5 h-5" />
              Confirmar Agendamento
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
