'use client'

import { useState } from 'react'
import {
  DollarSign, TrendingUp, TrendingDown, Wallet,
  CreditCard, Smartphone, Banknote, Award,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Topbar } from '@/components/dashboard/topbar'
import { transactions, commissions, kpis, professionals } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const weekData = [
  { day: 'Seg', income: 920, expense: 80 },
  { day: 'Ter', income: 1100, expense: 150 },
  { day: 'Qua', income: 750, expense: 0 },
  { day: 'Qui', income: 1350, expense: 200 },
  { day: 'Sex', income: 1600, expense: 120 },
  { day: 'Sáb', income: 1980, expense: 0 },
  { day: 'Hoje', income: kpis.revenueToday, expense: 120 },
]

const methodData = [
  { name: 'PIX', value: 52, color: '#22c55e' },
  { name: 'Cartão', value: 35, color: '#3b82f6' },
  { name: 'Dinheiro', value: 13, color: '#f97316' },
]

const methodIcon: Record<string, React.ElementType> = {
  pix: Smartphone,
  card: CreditCard,
  cash: Banknote,
}

const methodLabel: Record<string, string> = {
  pix: 'PIX',
  card: 'Cartão',
  cash: 'Dinheiro',
}

export default function FinanceiroPage() {
  const [tab, setTab] = useState('geral')

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const totalNet = totalIncome - totalExpense
  const totalCommissions = commissions.reduce((sum, c) => sum + c.commission, 0)

  return (
    <div className="flex-1 overflow-y-auto">
      <Topbar title="Financeiro" />

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              label: 'Receita Hoje',
              value: `R$ ${totalIncome}`,
              icon: TrendingUp,
              gradient: 'from-emerald-500 to-teal-500',
              shadow: 'shadow-emerald-500/20',
              sub: `Meta: R$ ${kpis.revenueGoal}`,
              progress: (totalIncome / kpis.revenueGoal) * 100,
            },
            {
              label: 'Despesas',
              value: `R$ ${totalExpense}`,
              icon: TrendingDown,
              gradient: 'from-red-500 to-rose-500',
              shadow: 'shadow-red-500/20',
              sub: 'Insumos e fixos',
              progress: (totalExpense / kpis.revenueGoal) * 100,
            },
            {
              label: 'Lucro Líquido',
              value: `R$ ${totalNet}`,
              icon: DollarSign,
              gradient: 'from-orange-500 to-amber-500',
              shadow: 'shadow-orange-500/20',
              sub: `${Math.round((totalNet / totalIncome) * 100)}% de margem`,
              progress: (totalNet / kpis.revenueGoal) * 100,
            },
            {
              label: 'Comissões Devidas',
              value: `R$ ${totalCommissions.toFixed(0)}`,
              icon: Wallet,
              gradient: 'from-purple-500 to-pink-500',
              shadow: 'shadow-purple-500/20',
              sub: '50% por barbeiro',
              progress: (totalCommissions / totalIncome) * 100,
            },
          ].map((kpi) => {
            const Icon = kpi.icon
            return (
              <Card key={kpi.label} className={`border-0 shadow-lg ${kpi.shadow} bg-white`}>
                <CardContent className="p-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center mb-3 shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-display text-2xl font-black text-slate-900">{kpi.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{kpi.label}</p>
                  <Progress value={kpi.progress} className="mt-2 h-1.5 bg-slate-100" />
                  <p className="text-[10px] text-slate-400 mt-1">{kpi.sub}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="geral" className="rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="transacoes" className="rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Transações
            </TabsTrigger>
            <TabsTrigger value="comissoes" className="rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Comissões
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="geral" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Weekly bar chart */}
              <Card className="xl:col-span-2 border border-slate-100 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-display text-lg font-bold text-slate-900">
                      Faturamento da Semana
                    </CardTitle>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-orange-400" />
                        Receita
                      </span>
                      <span className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-red-300" />
                        Despesa
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={weekData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barGap={4}>
                      <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: 13 }}
                        formatter={(v, name) => [`R$ ${v}`, name === 'income' ? 'Receita' : 'Despesa']}
                      />
                      <Bar dataKey="income" fill="#f97316" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="expense" fill="#fca5a5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Payment method pie */}
              <Card className="border border-slate-100 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-lg font-bold text-slate-900">
                    Formas de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={methodData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {methodData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v}%`, 'Participação']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {methodData.map((m) => (
                      <div key={m.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                          <span className="text-slate-600">{m.name}</span>
                        </div>
                        <span className="font-bold text-slate-900">{m.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transações */}
          <TabsContent value="transacoes" className="mt-6">
            <Card className="border border-slate-100 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-lg font-bold text-slate-900">
                    Movimentações de Hoje
                  </CardTitle>
                  <Button variant="outline" size="sm" className="text-xs border-slate-200 text-slate-600">
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transactions.map((txn) => {
                    const MethodIcon = methodIcon[txn.method]
                    return (
                      <div
                        key={txn.id}
                        className={cn(
                          'flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-sm',
                          txn.type === 'income'
                            ? 'border-slate-100 bg-white hover:border-emerald-100'
                            : 'border-red-100 bg-red-50/40 hover:border-red-200'
                        )}
                      >
                        {/* Icon */}
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                          txn.type === 'income' ? 'bg-emerald-100' : 'bg-red-100'
                        )}>
                          <MethodIcon className={cn(
                            'w-5 h-5',
                            txn.type === 'income' ? 'text-emerald-600' : 'text-red-500'
                          )} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-900 truncate">{txn.description}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {txn.client !== '—' ? txn.client : 'Despesa operacional'} &middot; {methodLabel[txn.method]} &middot; {txn.time}
                          </p>
                        </div>

                        {/* Commission */}
                        {txn.type === 'income' && txn.commission > 0 && (
                          <div className="text-right flex-shrink-0 hidden sm:block">
                            <p className="text-[10px] text-slate-400">Comissão</p>
                            <p className="text-xs font-semibold text-purple-600">R$ {txn.commission}</p>
                          </div>
                        )}

                        {/* Amount */}
                        <p className={cn(
                          'font-black text-sm flex-shrink-0',
                          txn.type === 'income' ? 'text-emerald-600' : 'text-red-500'
                        )}>
                          {txn.type === 'income' ? '+' : '-'} R$ {txn.amount}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-500">Total de Receitas</span>
                    <span className="font-bold text-emerald-600">+ R$ {totalIncome}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-500">Total de Despesas</span>
                    <span className="font-bold text-red-500">- R$ {totalExpense}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">Saldo do Dia</span>
                    <span className="font-black text-lg text-slate-900">R$ {totalNet}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comissões */}
          <TabsContent value="comissoes" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-slate-900">Comissões por Barbeiro</h2>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                  Total: R$ {totalCommissions.toFixed(0)}
                </Badge>
              </div>
              {commissions.map((c) => {
                const pro = professionals.find((p) => p.id === c.professionalId)
                return (
                  <Card key={c.professionalId} className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-md shadow-orange-500/30">
                          {c.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between flex-wrap gap-2">
                            <div>
                              <h3 className="font-display font-bold text-slate-900">{c.name}</h3>
                              <p className="text-xs text-slate-400 mt-0.5">{pro?.role}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-xl text-slate-900">R$ {c.commission.toFixed(0)}</p>
                              <p className="text-xs text-purple-600 font-medium">a receber hoje</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="text-center p-3 bg-slate-50 rounded-xl">
                              <p className="font-bold text-slate-900">{c.services}</p>
                              <p className="text-xs text-slate-400">serviços</p>
                            </div>
                            <div className="text-center p-3 bg-emerald-50 rounded-xl">
                              <p className="font-bold text-emerald-700">R$ {c.revenue}</p>
                              <p className="text-xs text-slate-400">faturado</p>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-xl">
                              <p className="font-bold text-purple-700">{c.percentage}%</p>
                              <p className="text-xs text-slate-400">comissão</p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                              <span>Participação no faturamento</span>
                              <span className="font-medium text-slate-600">{Math.round((c.revenue / totalIncome) * 100)}%</span>
                            </div>
                            <Progress value={(c.revenue / totalIncome) * 100} className="h-2 bg-slate-100" />
                          </div>

                          <div className="mt-4 flex gap-2">
                            <Button
                              size="sm"
                              className="gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 rounded-lg"
                              onClick={() => {}}
                            >
                              <Award className="w-3.5 h-3.5" />
                              Pagar R$ {c.commission.toFixed(0)}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8 rounded-lg border-slate-200 text-slate-600"
                            >
                              Ver histórico
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
