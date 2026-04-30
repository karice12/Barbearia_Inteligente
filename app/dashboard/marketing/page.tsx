'use client'

import { useState } from 'react'
import {
  MessageSquare, Clock, TrendingUp, Gift, Send, Users,
  Flame, Star, ChevronRight, Check,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Topbar } from '@/components/dashboard/topbar'
import { inactiveClients, allClients } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const campaigns = [
  {
    id: 'camp-1',
    name: 'Resgate 30 dias',
    description: 'Cupom de 20% OFF para clientes inativos há 30+ dias',
    sent: 24,
    opened: 18,
    converted: 7,
    discount: '20% OFF',
    trigger: 'Automático ao atingir 30 dias',
    active: true,
    color: 'orange',
  },
  {
    id: 'camp-2',
    name: 'Aniversariantes do Mês',
    description: 'Brinde especial para quem faz aniversário este mês',
    sent: 8,
    opened: 8,
    converted: 6,
    discount: 'Brinde grátis',
    trigger: 'Automático todo aniversário',
    active: true,
    color: 'purple',
  },
  {
    id: 'camp-3',
    name: 'Fidelidade — 10 visitas',
    description: 'Serviço grátis ao completar o cartão fidelidade',
    sent: 12,
    opened: 10,
    converted: 10,
    discount: '1 serviço grátis',
    trigger: 'Ao completar 10 carimbos',
    active: true,
    color: 'emerald',
  },
]

export default function MarketingPage() {
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [selectedAll, setSelectedAll] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  function handleSend(clientId: string, clientName: string) {
    setSentIds((prev) => new Set([...prev, clientId]))
    toast.success(`Cupom enviado para ${clientName}!`, {
      description: 'Mensagem WhatsApp disparada com 20% OFF.',
    })
  }

  function handleSendAll() {
    const ids = new Set(inactiveClients.map((c) => c.id))
    setSentIds(ids)
    toast.success(`${inactiveClients.length} cupons enviados!`, {
      description: 'Campanha de resgate disparada com sucesso.',
    })
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const urgentClients = inactiveClients.filter((c) => c.daysInactive >= 45)
  const moderateClients = inactiveClients.filter((c) => c.daysInactive < 45)

  return (
    <div className="flex-1 overflow-y-auto">
      <Topbar title="Marketing & CRM" />

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Clientes inativos', value: inactiveClients.length, icon: Users, color: 'from-red-500 to-rose-500', shadow: 'shadow-red-500/20', sub: '30+ dias sem visitar' },
            { label: 'Campanhas ativas', value: campaigns.filter((c) => c.active).length, icon: MessageSquare, color: 'from-orange-500 to-amber-500', shadow: 'shadow-orange-500/20', sub: 'em execução' },
            { label: 'Cupons enviados (mês)', value: 44, icon: Send, color: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-500/20', sub: 'este mês' },
            { label: 'Taxa de conversão', value: '58%', icon: TrendingUp, color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20', sub: 'média das campanhas' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.label} className={`border-0 shadow-lg ${item.shadow} bg-white`}>
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-display text-2xl font-black text-slate-900">{item.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Inactive clients — resgate */}
          <Card className="border border-slate-100 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="font-display text-lg font-bold text-slate-900">
                    Clientes para Resgatar
                  </CardTitle>
                  <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                    {inactiveClients.length} inativos
                  </Badge>
                </div>
                <Button
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/30 text-xs"
                  onClick={handleSendAll}
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar a Todos
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {urgentClients.length > 0 && (
                <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  Urgente — 45+ dias inativos
                </p>
              )}
              {[...urgentClients, ...moderateClients].map((client) => {
                const isSent = sentIds.has(client.id)
                const isUrgent = client.daysInactive >= 45
                return (
                  <div
                    key={client.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border transition-all duration-200',
                      isUrgent
                        ? 'border-red-100 bg-red-50/60 hover:border-red-200'
                        : 'border-slate-100 bg-white hover:border-orange-100',
                      isSent && 'opacity-60'
                    )}
                  >
                    {/* Avatar */}
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0',
                      isUrgent ? 'bg-red-200 text-red-700' : 'bg-orange-100 text-orange-700'
                    )}>
                      {client.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-slate-900 truncate">{client.name}</p>
                        {isUrgent && <Flame className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn(
                          'text-xs font-medium px-1.5 py-0.5 rounded-full',
                          isUrgent ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                        )}>
                          {client.daysInactive} dias
                        </span>
                        <span className="text-xs text-slate-400">últ. visita: {client.lastVisit}</span>
                      </div>
                    </div>

                    {/* Loyalty stamps */}
                    <div className="flex-shrink-0 text-center hidden sm:block">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 10 }, (_, i) => (
                          <div
                            key={i}
                            className={cn(
                              'w-2 h-2 rounded-full',
                              i < client.loyaltyStamps ? 'bg-orange-400' : 'bg-slate-200'
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{client.loyaltyStamps}/10</p>
                    </div>

                    {/* Action */}
                    <Button
                      size="sm"
                      className={cn(
                        'flex-shrink-0 h-8 text-xs px-3 gap-1.5 rounded-lg transition-all duration-200',
                        isSent
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 cursor-default'
                          : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:scale-105 active:scale-95'
                      )}
                      onClick={() => !isSent && handleSend(client.id, client.name)}
                      disabled={isSent}
                    >
                      {isSent ? (
                        <>
                          <Check className="w-3 h-3" />
                          Enviado
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          Cupom
                        </>
                      )}
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Campaigns */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">Campanhas Automáticas</h2>
            {campaigns.map((campaign) => {
              const openRate = Math.round((campaign.opened / campaign.sent) * 100)
              const convRate = Math.round((campaign.converted / campaign.sent) * 100)
              const colorMap: Record<string, string> = {
                orange: 'from-orange-500 to-amber-500',
                purple: 'from-purple-500 to-pink-500',
                emerald: 'from-emerald-500 to-teal-500',
              }
              return (
                <Card key={campaign.id} className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorMap[campaign.color]} flex items-center justify-center flex-shrink-0 shadow-md`}>
                        {campaign.color === 'orange' ? (
                          <Gift className="w-6 h-6 text-white" />
                        ) : campaign.color === 'purple' ? (
                          <Star className="w-6 h-6 text-white" />
                        ) : (
                          <Check className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-display font-bold text-slate-900 text-sm">{campaign.name}</h3>
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs flex-shrink-0">
                            Ativa
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{campaign.description}</p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div>
                            <p className="text-xs text-slate-400">Enviados</p>
                            <p className="text-sm font-bold text-slate-900">{campaign.sent}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Abertos</p>
                            <p className="text-sm font-bold text-slate-900">{openRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Convertidos</p>
                            <p className="text-sm font-bold text-emerald-600">{convRate}%</p>
                          </div>
                        </div>

                        <Progress value={convRate} className="h-1.5 bg-slate-100" />

                        <div className="flex items-center justify-between mt-3">
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {campaign.trigger}
                          </p>
                          <button className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-0.5">
                            Editar <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Add campaign CTA */}
            <button
              className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-orange-300 hover:text-orange-500 transition-all duration-200 group"
              onClick={() => toast.success('Modal de nova campanha aberto!')}
            >
              <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Nova Campanha</span>
            </button>
          </div>
        </div>

        {/* All clients table */}
        <Card className="border border-slate-100 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-lg font-bold text-slate-900">
                Todos os Clientes
              </CardTitle>
              <Badge variant="outline" className="text-xs text-slate-500">
                {allClients.length} cadastrados
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4">Cliente</th>
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4 hidden sm:table-cell">Última Visita</th>
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4 hidden md:table-cell">Visitas</th>
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4 hidden md:table-cell">Gasto Total</th>
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3">Fidelidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allClients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{client.name}</p>
                            <p className="text-xs text-slate-400">{client.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 hidden sm:table-cell">
                        <span className={cn(
                          'text-xs font-medium',
                          client.daysInactive >= 30 ? 'text-red-600' : client.daysInactive === 0 ? 'text-emerald-600' : 'text-slate-600'
                        )}>
                          {client.lastVisit}
                          {client.daysInactive >= 30 && ` (${client.daysInactive}d)`}
                        </span>
                      </td>
                      <td className="py-3 pr-4 hidden md:table-cell text-slate-600 font-medium text-xs">{client.visits}</td>
                      <td className="py-3 pr-4 hidden md:table-cell text-slate-700 font-bold text-sm">R$ {client.totalSpent}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 10 }, (_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  'w-2 h-2 rounded-full',
                                  i < client.loyaltyStamps ? 'bg-orange-400' : 'bg-slate-200'
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-slate-400">{client.loyaltyStamps}/10</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
