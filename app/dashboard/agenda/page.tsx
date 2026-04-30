'use client';
import { useState } from 'react';
import { CalendarDays, Clock, User, ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Topbar } from '@/components/dashboard/topbar';

import { todayAppointments, professionals, type AppointmentStatus, type Appointment } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusConfig: Record<AppointmentStatus, { label: string; color: string }> = {
  confirmed: { label: 'Confirmado', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  late: { label: 'Atrasado', color: 'bg-red-100 text-red-700 border-red-200' },
  waiting: { label: 'Aguardando', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  done: { label: 'Concluído', color: 'bg-slate-100 text-slate-500 border-slate-200' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-400 border-red-200' },
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const HOURS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00']

function getWeekDays(offset = 0) {
  const today = new Date()
  const monday = new Date(today)
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1) + offset * 7
  monday.setDate(diff)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export default function AgendaPage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedPro, setSelectedPro] = useState<string | null>(null)
  const [statuses, setStatuses] = useState<Record<string, AppointmentStatus>>(() =>
    Object.fromEntries(todayAppointments.map((a) => [a.id, a.status]))
  )

  const weekDays = getWeekDays(weekOffset)
  const today = new Date(2026, 3, 23)

  const filtered = todayAppointments.filter(
    (a) => !selectedPro || a.professionalId === selectedPro
  )

  function handleStatusChange(id: string, status: AppointmentStatus) {
    setStatuses((prev) => ({ ...prev, [id]: status }))
    toast.success('Status atualizado com sucesso!')
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <Topbar title="Agenda" />

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Week nav */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekOffset((o) => o - 1)}
              className="h-9 w-9 border-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-1">
              {weekDays.map((d, i) => {
                const isToday = d.toDateString() === today.toDateString()
                const isWeekend = i === 0 || i === 6
                return (
                  <div
                    key={i}
                    className={cn(
                      'flex flex-col items-center px-2.5 py-2 rounded-xl cursor-pointer transition-all duration-200 min-w-[44px]',
                      isToday
                        ? 'bg-gradient-to-b from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30'
                        : isWeekend
                        ? 'opacity-40 hover:opacity-60' :'hover:bg-slate-100'
                    )}
                  >
                    <span className={cn('text-[10px] font-medium', isToday ? 'text-white/80' : 'text-slate-400')}>
                      {DAYS[i]}
                    </span>
                    <span className={cn('text-sm font-bold', isToday ? 'text-white' : 'text-slate-700')}>
                      {d.getDate()}
                    </span>
                  </div>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekOffset((o) => o + 1)}
              className="h-9 w-9 border-slate-200"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 border-slate-200 text-slate-600">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/30"
              onClick={() => toast.success('Modal de novo agendamento aberto!')}
            >
              <Plus className="w-4 h-4" />
              Novo Agendamento
            </Button>
          </div>
        </div>

        {/* Professional filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedPro(null)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0',
              !selectedPro
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600'
            )}
          >
            Todos
            <Badge className="bg-orange-500 text-white text-xs px-1.5 min-w-[20px] h-5 flex items-center justify-center border-0">
              {todayAppointments.length}
            </Badge>
          </button>
          {professionals.map((pro) => {
            const count = todayAppointments.filter((a) => a.professionalId === pro.id).length
            return (
              <button
                key={pro.id}
                onClick={() => setSelectedPro(pro.id === selectedPro ? null : pro.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0',
                  selectedPro === pro.id
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600'
                )}
              >
                <div className="w-5 h-5 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 text-xs font-bold flex-shrink-0">
                  {pro.name.charAt(0)}
                </div>
                {pro.name.split(' ')[0]}
                <span className="text-xs opacity-70">({count})</span>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Kanban-style columns by status */}
          {(['confirmed', 'waiting', 'done'] as AppointmentStatus[]).map((col) => {
            const colItems = filtered.filter((a) => {
              const s = statuses[a.id] || a.status
              if (col === 'confirmed') return s === 'confirmed' || s === 'late'
              if (col === 'waiting') return s === 'waiting'
              return s === 'done' || s === 'cancelled'
            })
            const colLabel = col === 'confirmed' ? 'Em Atendimento' : col === 'waiting' ? 'Aguardando' : 'Concluídos'
            const colColor = col === 'confirmed' ? 'border-emerald-300 bg-emerald-50' : col === 'waiting' ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-slate-50'
            const headerColor = col === 'confirmed' ? 'text-emerald-700' : col === 'waiting' ? 'text-amber-700' : 'text-slate-500'

            return (
              <div key={col} className="space-y-3">
                <div className={cn('flex items-center justify-between px-4 py-2.5 rounded-xl border', colColor)}>
                  <span className={cn('font-semibold text-sm', headerColor)}>{colLabel}</span>
                  <Badge variant="outline" className={cn('text-xs font-bold', headerColor)}>
                    {colItems.length}
                  </Badge>
                </div>
                <div className="space-y-3 min-h-[200px]">
                  {colItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                      <CalendarDays className="w-8 h-8 mb-2 opacity-30" />
                      Nenhum agendamento
                    </div>
                  )}
                  {colItems.map((apt) => {
                    const currentStatus = (statuses[apt.id] as AppointmentStatus) || apt.status
                    const config = statusConfig[currentStatus]
                    const isLate = currentStatus === 'late'

                    return (
                      <Card
                        key={apt.id}
                        className={cn(
                          'border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer',
                          isLate && 'border-red-200 bg-red-50/50'
                        )}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-slate-900 truncate">{apt.clientName}</p>
                              <p className="text-xs text-slate-500 truncate mt-0.5">{apt.service}</p>
                            </div>
                            <Badge variant="outline" className={cn('text-xs flex-shrink-0', config.color)}>
                              {config.label}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {apt.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {apt.professionalName}
                            </span>
                            <span className="ml-auto font-bold text-slate-700">R$ {apt.price}</span>
                          </div>

                          {(currentStatus === 'confirmed' || currentStatus === 'late' || currentStatus === 'waiting') && (
                            <div className="flex gap-2">
                              {currentStatus === 'waiting' && (
                                <Button
                                  size="sm"
                                  className="flex-1 h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-white"
                                  onClick={() => handleStatusChange(apt.id, 'confirmed')}
                                >
                                  Chamar
                                </Button>
                              )}
                              {(currentStatus === 'confirmed' || currentStatus === 'late') && (
                                <Button
                                  size="sm"
                                  className="flex-1 h-7 text-xs bg-orange-500 hover:bg-orange-600 text-white"
                                  onClick={() => handleStatusChange(apt.id, 'done')}
                                >
                                  Concluir
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200"
                                onClick={() => handleStatusChange(apt.id, 'cancelled')}
                              >
                                Cancelar
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Hours timeline card */}
        <Card className="border border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-lg font-bold text-slate-900">
              Linha do Tempo — Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Professional headers */}
                <div className="grid gap-px mb-2" style={{ gridTemplateColumns: '70px repeat(3, 1fr)' }}>
                  <div />
                  {professionals.map((pro) => (
                    <div key={pro.id} className="text-center text-xs font-semibold text-slate-600 pb-2 border-b border-slate-200">
                      {pro.name.split(' ')[0]}
                    </div>
                  ))}
                </div>
                {/* Time slots */}
                {HOURS.map((hour) => {
                  const aptsAtHour = todayAppointments.filter((a) => a.time === hour)
                  return (
                    <div key={hour} className="grid gap-1 mb-1" style={{ gridTemplateColumns: '70px repeat(3, 1fr)' }}>
                      <span className="text-xs text-slate-400 self-center pr-2 text-right">{hour}</span>
                      {professionals.map((pro) => {
                        const apt = aptsAtHour.find((a) => a.professionalId === pro.id)
                        const currentStatus = apt ? (statuses[apt.id] as AppointmentStatus) || apt.status : null
                        return (
                          <div
                            key={pro.id}
                            className={cn(
                              'h-9 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200',
                              apt
                                ? currentStatus === 'done'
                                  ? 'bg-slate-100 text-slate-400'
                                  : currentStatus === 'late' ?'bg-red-100 text-red-700 border border-red-200'
                                  : currentStatus === 'confirmed' ?'bg-emerald-100 text-emerald-700 border border-emerald-200' :'bg-amber-100 text-amber-700 border border-amber-200' :'bg-slate-50 border border-dashed border-slate-200 text-slate-300'
                            )}
                          >
                            {apt ? apt.clientName.split(' ')[0] : ''}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
