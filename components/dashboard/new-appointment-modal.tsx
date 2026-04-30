'use client';
import { useState, FormEvent } from 'react';
import { CalendarDays, Clock, User, Scissors, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { services, professionals, availableSlots, type Appointment } from '@/lib/mock-data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface NewAppointmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (appointment: Appointment) => void
}

function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

export function NewAppointmentModal({ open, onOpenChange, onSave }: NewAppointmentModalProps) {
  const [clientName, setClientName] = useState('')
  const [phone, setPhone] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [professionalId, setProfessionalId] = useState('')
  const [date, setDate] = useState(getTodayString())
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedService = services.find((s) => s.id === serviceId)
  const selectedPro = professionals.find((p) => p.id === professionalId)

  function reset() {
    setClientName('')
    setPhone('')
    setServiceId('')
    setProfessionalId('')
    setDate(getTodayString())
    setTime('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!serviceId || !professionalId || !time) {
      toast.error('Preencha todos os campos obrigatórios.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      time,
      clientName,
      service: selectedService?.name ?? '',
      professionalId,
      professionalName: selectedPro?.name.split(' ')[0] ?? '',
      status: 'confirmed',
      price: selectedService?.price ?? 0,
      phone,
    }

    onSave(newAppointment)
    toast.success(`Agendamento de ${clientName} criado!`, {
      description: `${selectedService?.name} com ${selectedPro?.name} às ${time}`,
    })
    reset()
    onOpenChange(false)
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-white" />
            </div>
            Novo Agendamento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Cliente */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Nome do Cliente
              </Label>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Carlos Silva"
                required
                className="border-slate-200 focus-visible:ring-orange-400 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Telefone
              </Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                className="border-slate-200 focus-visible:ring-orange-400 rounded-xl"
              />
            </div>
          </div>

          {/* Serviço */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5" /> Serviço
            </Label>
            <Select value={serviceId} onValueChange={setServiceId} required>
              <SelectTrigger className="border-slate-200 focus:ring-orange-400 rounded-xl h-10">
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.map((svc) => (
                  <SelectItem key={svc.id} value={svc.id}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{svc.name}</span>
                      <span className="text-slate-400 text-xs">{svc.duration}min · R${svc.price}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Profissional */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Profissional
            </Label>
            <Select value={professionalId} onValueChange={setProfessionalId} required>
              <SelectTrigger className="border-slate-200 focus:ring-orange-400 rounded-xl h-10">
                <SelectValue placeholder="Selecione o barbeiro" />
              </SelectTrigger>
              <SelectContent>
                {professionals.map((pro) => (
                  <SelectItem key={pro.id} value={pro.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-[10px] flex-shrink-0">
                        {pro.name.charAt(0)}
                      </div>
                      <span>{pro.name}</span>
                      <span className="text-slate-400 text-xs">★ {pro.rating}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data e hora */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" /> Data
              </Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getTodayString()}
                required
                className="border-slate-200 focus-visible:ring-orange-400 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Horário
              </Label>
              <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto pr-1">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={cn(
                      'py-1.5 rounded-lg text-xs font-medium border transition-all duration-150',
                      time === slot
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600'
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resumo */}
          {selectedService && selectedPro && time && (
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
              <p className="text-xs font-semibold text-orange-700 mb-1">Resumo do Agendamento</p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">{selectedService.name}</span> com{' '}
                <span className="font-semibold">{selectedPro.name.split(' ')[0]}</span> às{' '}
                <span className="font-semibold">{time}</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedService.duration} min · R$ {selectedService.price}
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => { reset(); onOpenChange(false) }}
              className="rounded-xl border-slate-200"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/30 gap-2"
            >
              {loading ? 'Salvando...' : 'Confirmar Agendamento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
