'use client'

import { useState } from 'react'
import {
  DollarSign, CalendarCheck, TrendingUp, Users,
  Clock, Check, AlertCircle, Timer, ChevronRight,
  Flame,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Topbar } from '@/components/dashboard/topbar'
import { cn } from '@/lib/utils'
import { kpis, todayAppointments, waitingList, type AppointmentStatus } from '@/lib/mock-data'
import { toast } from 'sonner'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const revenueData = [
  { hour: '9h', value: 125 },
  { hour: '10h', value: 200 },
  { hour: '11h', value: 175 },
  { hour: '12h', value: 80 },
  { hour: '13h', value: 220 },
  { hour: '14h', value: 50 },
  { hour: '15h', value: 0 },
]

const statusConfig: Record<AppointmentStatus, { label: string; color: string; icon: React.ElementType; pulse?: boolean }> = {
  confirmed: { label: 'Confirmado', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Check },
  late: { label: 'Atrasado 10m', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle, pulse: true },
  waiting: { label: 'Aguardando', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Timer },
  done: { label: 'Concluído', color: 'bg-slate-100 text-slate-500 border-slate-200', icon: Check },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-500 border-red-200', icon: AlertCircle },
}

const kpiCards = [
  {
    label: 'Faturamento Hoje',
    value: `R$ ${kpis.revenueToday.toLocaleString('pt-BR')}`,
    subValue: `Meta: R$ ${kpis.revenueGoal.toLocaleString('pt-BR')}`,
    progress: (kpis.revenueToday / kpis.revenueGoal) * 100,
    icon: DollarSign,
    gradient: 'from-orange-500 to-amber-500',
    shadowColor: 'shadow-orange-500/20',
    trend: '+12% vs ontem',
    trendUp: true,
  },
  {
    label: 'Agendamentos',
    value: kpis.appointments.toString(),
    subValue: '4 concluídos até agora',
    progress: (4 / kpis.appointments) * 100,
    icon: CalendarCheck,
    gradient: 'from-blue-500 to-indigo-500',
    shadowColor: 'shadow-blue-500/20',
    trend: '+3 vs ontem',
    trendUp: true,
  },
  {
    label: 'Taxa de Ocupação',
    value: `${kpis.occupancy}%`,
    subValue: 'Capacidade máx: 100%',
    progress: kpis.occupancy,
    icon: TrendingUp,
    gradient: 'from-emerald-500 to-teal-500',
    shadowColor: 'shadow-emerald-500/20',
    trend: 'Excelente',
    trendUp: true,
  },
  {
    label: 'Novos Clientes',
    value: kpis.newClients.toString(),
    subValue: `Ticket médio: R$ ${kpis.avgTicket}`,
    progress: 60,
    icon: Users,
    gradient: 'from-purple-500 to-pink-500',
    shadowColor: 'shadow-purple-500/20',
    trend: '+2 vs ontem',
    trendUp: true,
  },
]

export default function DashboardPage() {
  const [appointmentStatuses, setAppointmentStatuses] = useState(() =>
    Object.fromEntries(todayAppointments.map((a) => [a.id, a.status]))
  )

  function handleMarkDone(id: string, clientName: string) {
    setAppointmentStatuses((prev) => ({ ...prev, [id]: 'done' }))
    toast.success(`${clientName} marcado como concluído!`, {
      description: 'Comissão calculada automaticamente.',
    })
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <Topbar title="Visão Geral" />

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Card key={kpi.label} className={`border-0 shadow-lg ${kpi.shadowColor} bg-white`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span
                      className={cn(
                        'text-xs font-semibold px-2 py-1 rounded-full',
                        kpi.trendUp
                          ? 'text-emerald-700 bg-emerald-100'
                          : 'text-red-700 bg-red-100'
                      )}
                    >
                      {kpi.trend}
                    </span>
                  </div>
                  <p className="font-display text-3xl font-black text-slate-900">{kpi.value}</p>
                  <p className="text-slate-500 text-xs mt-1">{kpi.label}</p>
                  <Progress
                    value={kpi.progress}
                    className="mt-3 h-1.5 bg-slate-100"
                  />
                  <p className="text-slate-400 text-xs mt-1.5">{kpi.subValue}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Revenue chart */}
          <Card className="xl:col-span-2 border border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg font-bold text-slate-900">
                  Faturamento por hora
                </CardTitle>
                <Badge variant="outline" className="text-xs text-orange-500 border-orange-200 bg-orange-50">
                  Hoje, 23/04
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: 13 }}
                    formatter={(v) => [`R$ ${v}`, 'Faturamento']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#f97316"
                    strokeWidth={2.5}
                    fill="url(#revenueGradient)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#f97316' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Waiting list */}
          <Card className="border border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg font-bold text-slate-900">
                  Lista de Espera
                </CardTitle>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                  {waitingList.length} aguardando
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {waitingList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs flex-shrink-0">
                    {item.clientName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{item.clientName}</p>
                    <p className="text-xs text-slate-500 truncate">{item.service}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-amber-600">{item.requestedTime}</p>
                    <button className="text-xs text-orange-500 hover:underline mt-0.5">Chamar</button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full border-dashed border-slate-200 text-slate-500 hover:text-orange-500 hover:border-orange-300 transition-colors mt-1">
                Ver fila completa
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Today's appointments */}
        <Card className="border border-slate-100 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="font-display text-lg font-bold text-slate-900">
                  Agenda do Dia
                </CardTitle>
                <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                  {todayAppointments.length} agendamentos
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-orange-500 gap-1 text-xs">
                Ver agenda completa <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todayAppointments.map((apt) => {
                const currentStatus = (appointmentStatuses[apt.id] as AppointmentStatus) || apt.status
                const config = statusConfig[currentStatus]
                const StatusIcon = config.icon
                const isLate = currentStatus === 'late'
                const isDone = currentStatus === 'done'
                const canMarkDone = currentStatus === 'confirmed' || currentStatus === 'late'

                return (
                  <div
                    key={apt.id}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border transition-all duration-200',
                      isLate
                        ? 'border-red-200 bg-red-50 animate-pulse-red'
                        : isDone
                        ? 'border-slate-100 bg-slate-50 opacity-60'
                        : 'border-slate-100 bg-white hover:border-orange-200 hover:bg-orange-50/30'
                    )}
                  >
                    {/* Time */}
                    <div className="text-center flex-shrink-0 w-12">
                      <p className={cn('font-bold text-sm', isLate ? 'text-red-600' : 'text-slate-900')}>
                        {apt.time}
                      </p>
                    </div>

                    {/* Divider */}
                    <div
                      className={cn(
                        'w-0.5 h-10 rounded-full flex-shrink-0',
                        isLate ? 'bg-red-300' : isDone ? 'bg-slate-200' : 'bg-orange-200'
                      )}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={cn('font-semibold text-sm truncate', isDone ? 'line-through text-slate-400' : 'text-slate-900')}>
                          {apt.clientName}
                        </p>
                        {isLate && (
                          <Flame className="w-4 h-4 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-slate-500 text-xs truncate">
                        {apt.service} &middot; {apt.professionalName}
                      </p>
                    </div>

                    {/* Price */}
                    <p className="text-slate-700 font-bold text-sm flex-shrink-0 hidden sm:block">
                      R$ {apt.price}
                    </p>

                    {/* Status badge */}
                    <Badge
                      className={cn('flex-shrink-0 text-xs font-semibold hidden md:flex items-center gap-1', config.color)}
                      variant="outline"
                    >
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </Badge>

                    {/* Action */}
                    {canMarkDone && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkDone(apt.id, apt.clientName)}
                        className="flex-shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-1.5 h-auto rounded-lg hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
                      >
                        Concluir
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
