'use client'

import { useState } from 'react'
import {
  Store, User, Clock, Bell, Shield, Palette,
  Plus, Trash2, Save, ChevronRight, Scissors,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Topbar } from '@/components/dashboard/topbar'
import { professionals, services } from '@/lib/mock-data'
import { toast } from 'sonner'

const workingHours = [
  { day: 'Segunda', open: '09:00', close: '18:00', active: true },
  { day: 'Terça', open: '09:00', close: '18:00', active: true },
  { day: 'Quarta', open: '09:00', close: '18:00', active: true },
  { day: 'Quinta', open: '09:00', close: '19:00', active: true },
  { day: 'Sexta', open: '09:00', close: '19:00', active: true },
  { day: 'Sábado', open: '09:00', close: '17:00', active: true },
  { day: 'Domingo', open: '', close: '', active: false },
]

export default function ConfiguracoesPage() {
  const [barbershopName, setBarbershopName] = useState('Barbearia do João')
  const [phone, setPhone] = useState('(11) 99999-9999')
  const [address, setAddress] = useState('Rua das Palmeiras, 123 — São Paulo, SP')
  const [hours, setHours] = useState(workingHours)
  const [notifications, setNotifications] = useState({
    newBooking: true,
    cancellation: true,
    dailySummary: true,
    inactiveClients: true,
    commissions: false,
  })

  function handleSave() {
    toast.success('Configurações salvas com sucesso!')
  }

  function toggleDay(index: number) {
    setHours((prev) => prev.map((h, i) => (i === index ? { ...h, active: !h.active } : h)))
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <Topbar title="Configurações" />

      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <Tabs defaultValue="barbearia">
          <TabsList className="bg-slate-100 p-1 rounded-xl mb-6 flex-wrap h-auto gap-1">
            {[
              { value: 'barbearia', icon: Store, label: 'Barbearia' },
              { value: 'equipe', icon: User, label: 'Equipe' },
              { value: 'horarios', icon: Clock, label: 'Horários' },
              { value: 'notificacoes', icon: Bell, label: 'Notificações' },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-lg text-sm gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Barbearia */}
          <TabsContent value="barbearia" className="space-y-6">
            <Card className="border border-slate-100 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-lg font-bold text-slate-900">
                      Dados da Barbearia
                    </CardTitle>
                    <p className="text-xs text-slate-400 mt-0.5">Informações exibidas na página de agendamento</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Logo preview */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg flex-shrink-0">
                    <div className="text-center">
                      <Scissors className="w-8 h-8 text-orange-400 rotate-45 mx-auto" />
                      <p className="text-white text-[8px] font-bold mt-0.5">BP</p>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-200 text-slate-600 text-xs"
                      onClick={() => toast.success('Upload de logo disponível em produção!')}
                    >
                      Alterar Logo
                    </Button>
                    <p className="text-xs text-slate-400 mt-1.5">PNG, JPG ou SVG — max. 2MB</p>
                  </div>
                </div>

                <Separator className="bg-slate-100" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-700">Nome da Barbearia</Label>
                    <Input
                      value={barbershopName}
                      onChange={(e) => setBarbershopName(e.target.value)}
                      className="border-slate-200 focus-visible:ring-orange-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-700">Telefone / WhatsApp</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-slate-200 focus-visible:ring-orange-400"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-sm font-medium text-slate-700">Endereço</Label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="border-slate-200 focus-visible:ring-orange-400"
                    />
                  </div>
                </div>

                <Separator className="bg-slate-100" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Lista de Espera</p>
                      <p className="text-xs text-slate-400">Permitir que clientes entrem na fila de espera</p>
                    </div>
                    <Switch defaultChecked className="data-[state=checked]:bg-orange-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Agendamento Online Público</p>
                      <p className="text-xs text-slate-400">Qualquer pessoa pode agendar pela URL pública</p>
                    </div>
                    <Switch defaultChecked className="data-[state=checked]:bg-orange-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Confirmação Automática</p>
                      <p className="text-xs text-slate-400">Confirmar agendamentos automaticamente</p>
                    </div>
                    <Switch className="data-[state=checked]:bg-orange-500" />
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  className="w-full sm:w-auto gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipe */}
          <TabsContent value="equipe" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-900">Profissionais</h2>
              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/30"
                onClick={() => toast.success('Modal de novo profissional aberto!')}
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>

            {professionals.map((pro) => (
              <Card key={pro.id} className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-md">
                      {pro.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-display font-bold text-slate-900">{pro.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{pro.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                            ★ {pro.rating}
                          </Badge>
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                            50% comissão
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {pro.specialties.map((s) => (
                          <span
                            key={s}
                            className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs border-slate-200 gap-1"
                        onClick={() => toast.success(`Editando ${pro.name}...`)}
                      >
                        Editar
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-red-100 text-red-400 hover:bg-red-50 hover:border-red-200"
                        onClick={() => toast.error('Função disponível em produção.')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Separator className="bg-slate-100 my-6" />

            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-900">Catálogo de Serviços</h2>
              <Button
                size="sm"
                variant="outline"
                className="gap-2 border-slate-200 text-slate-600 text-xs"
                onClick={() => toast.success('Modal de novo serviço aberto!')}
              >
                <Plus className="w-4 h-4" />
                Adicionar Serviço
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-orange-200 hover:shadow-sm transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <Scissors className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">{svc.name}</p>
                    <p className="text-xs text-slate-400">{svc.duration} min &middot; R$ {svc.price}</p>
                  </div>
                  <button className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Horários */}
          <TabsContent value="horarios" className="space-y-4">
            <Card className="border border-slate-100 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-lg font-bold text-slate-900">
                      Horário de Funcionamento
                    </CardTitle>
                    <p className="text-xs text-slate-400 mt-0.5">Define os horários disponíveis para agendamento</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {hours.map((h, i) => (
                  <div
                    key={h.day}
                    className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 ${
                      h.active ? 'border-slate-100 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'
                    }`}
                  >
                    <Switch
                      checked={h.active}
                      onCheckedChange={() => toggleDay(i)}
                      className="data-[state=checked]:bg-orange-500 flex-shrink-0"
                    />
                    <span className="w-20 text-sm font-semibold text-slate-700 flex-shrink-0">{h.day}</span>
                    {h.active ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="time"
                          defaultValue={h.open}
                          className="border-slate-200 text-sm h-8 w-28 focus-visible:ring-orange-400"
                        />
                        <span className="text-slate-400 text-sm">até</span>
                        <Input
                          type="time"
                          defaultValue={h.close}
                          className="border-slate-200 text-sm h-8 w-28 focus-visible:ring-orange-400"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400 flex-1">Fechado</span>
                    )}
                  </div>
                ))}

                <Button
                  onClick={handleSave}
                  className="w-full sm:w-auto gap-2 mt-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <Save className="w-4 h-4" />
                  Salvar Horários
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notificacoes" className="space-y-4">
            <Card className="border border-slate-100 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-lg font-bold text-slate-900">
                      Notificações
                    </CardTitle>
                    <p className="text-xs text-slate-400 mt-0.5">Gerencie quando e como você é notificado</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'newBooking', label: 'Novo Agendamento', description: 'Receber aviso quando um cliente agendar' },
                  { key: 'cancellation', label: 'Cancelamentos', description: 'Receber aviso quando um agendamento for cancelado' },
                  { key: 'dailySummary', label: 'Resumo Diário', description: 'Resumo das atividades do dia às 20h' },
                  { key: 'inactiveClients', label: 'Alerta de Clientes Inativos', description: 'Alertar quando clientes atingirem 30 dias de inatividade' },
                  { key: 'commissions', label: 'Relatório de Comissões', description: 'Resumo semanal de comissões por barbeiro' },
                ].map((notif, index) => (
                  <div key={notif.key}>
                    {index > 0 && <Separator className="bg-slate-50" />}
                    <div className="flex items-center justify-between gap-4 py-1">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{notif.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{notif.description}</p>
                      </div>
                      <Switch
                        checked={notifications[notif.key as keyof typeof notifications]}
                        onCheckedChange={(val) =>
                          setNotifications((prev) => ({ ...prev, [notif.key]: val }))
                        }
                        className="data-[state=checked]:bg-orange-500 flex-shrink-0"
                      />
                    </div>
                  </div>
                ))}

                <Separator className="bg-slate-100" />

                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">WhatsApp conectado</p>
                      <p className="text-xs text-emerald-600 mt-0.5">
                        Notificações via WhatsApp Business API ativas &mdash; (11) 99999-9999
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  className="w-full sm:w-auto gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <Save className="w-4 h-4" />
                  Salvar Preferências
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
