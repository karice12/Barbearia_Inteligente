import { Calendar, MessageSquare, DollarSign, Clock, TrendingUp, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Calendar,
    title: 'Agenda Inteligente',
    description:
      'Calendário em tempo real com gestão de lista de espera, alertas de overbooking e confirmação automática para seus clientes.',
    color: 'orange',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: MessageSquare,
    title: 'Automação de Retenção',
    description:
      'Identifique clientes inativos há mais de 30 dias e dispare cupons de resgate personalizados via WhatsApp com 1 clique.',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    icon: DollarSign,
    title: 'Split de Comissões',
    description:
      'Cálculo automático de comissões por barbeiro ao finalizar cada serviço. Transparência total na gestão financeira.',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Clock,
    title: 'Agendamento 24/7',
    description:
      'Seu cliente agenda pelo celular a qualquer hora, sem precisar ligar. Interface pensada para o polegar, 100% mobile.',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: TrendingUp,
    title: 'Relatórios em Tempo Real',
    description:
      'KPIs de faturamento, taxa de ocupação e ticket médio atualizados ao vivo. Tome decisões com dados, não com achismos.',
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Shield,
    title: 'Multi-perfil de Acesso',
    description:
      'Defina permissões por perfil: Dono vê tudo, Barbeiro vê apenas sua agenda, Recepcionista gerencia agendamentos.',
    color: 'slate',
    gradient: 'from-slate-600 to-slate-800',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white" id="funcionalidades">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-orange-500 font-semibold text-sm tracking-widest uppercase mb-3">
            Funcionalidades
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900 text-balance">
            Tudo que sua barbearia precisa,{' '}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              em um só sistema.
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            Do agendamento ao financeiro, BarberPro cobre todos os pontos críticos do seu negócio.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className={`group border border-slate-100 bg-white hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 animate-fade-up`}
                style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
              >
                <CardContent className="p-8">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Stats bar */}
        <div className="mt-20 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Barbearias ativas', value: '2.400+' },
              { label: 'Agendamentos/mês', value: '190K+' },
              { label: 'Receita gerada', value: 'R$ 12M+' },
              { label: 'Satisfação', value: '4.9/5' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl sm:text-4xl font-black bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
