'use client'

import { useState } from 'react'
import { Check, X, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { pricingPlans } from '@/lib/mock-data'
import { toast } from 'sonner'

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  function handleSubscribe(planName: string) {
    toast.success(`Redirecionando para o checkout do plano ${planName}...`, {
      description: 'Integração com Stripe em produção.',
    })
  }

  return (
    <section className="py-24 bg-slate-50" id="planos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-orange-500 font-semibold text-sm tracking-widest uppercase mb-3">
            Planos e Preços
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900 text-balance">
            Invista no crescimento da sua barbearia
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Sem taxa de setup. Cancele quando quiser. Suporte incluído.
          </p>

          {/* Toggle mensal/anual */}
          <div className="mt-8 inline-flex items-center gap-4 bg-white border border-slate-200 rounded-full px-6 py-3 shadow-sm">
            <span className={cn('text-sm font-medium', !isAnnual ? 'text-slate-900' : 'text-slate-400')}>
              Mensal
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-orange-500"
            />
            <span className={cn('text-sm font-medium', isAnnual ? 'text-slate-900' : 'text-slate-400')}>
              Anual
            </span>
            {isAnnual && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-semibold">
                -20% OFF
              </Badge>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
            const isPro = plan.id === 'pro'

            return (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1',
                  isPro
                    ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl shadow-slate-900/40'
                    : 'bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:border-orange-200'
                )}
              >
                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 px-4 py-1.5 text-sm font-semibold shadow-lg shadow-orange-500/40">
                      <Crown className="w-3.5 h-3.5 mr-1.5" />
                      Mais Popular
                    </Badge>
                  </div>
                )}

                {/* Plan name */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      isPro
                        ? 'bg-gradient-to-br from-orange-500 to-amber-500'
                        : 'bg-blue-50'
                    )}
                  >
                    {isPro ? (
                      <Crown className="w-5 h-5 text-white" />
                    ) : (
                      <Zap className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3
                      className={cn(
                        'font-display text-xl font-bold',
                        isPro ? 'text-white' : 'text-slate-900'
                      )}
                    >
                      {plan.name}
                    </h3>
                    <p className={cn('text-sm', isPro ? 'text-slate-400' : 'text-slate-500')}>
                      {plan.description}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-end gap-2">
                    <span
                      className={cn(
                        'font-display text-5xl font-black',
                        isPro ? 'text-white' : 'text-slate-900'
                      )}
                    >
                      R$ {price}
                    </span>
                    <span className={cn('text-sm mb-2', isPro ? 'text-slate-400' : 'text-slate-500')}>
                      /mês
                    </span>
                  </div>
                  {isAnnual && (
                    <p className={cn('text-sm mt-1', isPro ? 'text-orange-400' : 'text-emerald-600')}>
                      Cobrado anualmente — economia de{' '}
                      <strong>
                        R$ {((plan.monthlyPrice - plan.annualPrice) * 12).toFixed(0)}
                      </strong>
                      /ano
                    </p>
                  )}
                </div>

                {/* CTA */}
                <Button
                  size="lg"
                  onClick={() => handleSubscribe(plan.name)}
                  className={cn(
                    'w-full font-semibold text-base py-6 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200',
                    isPro
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  )}
                >
                  Assinar Plano {plan.name}
                </Button>

                <div className={cn('my-7 border-t', isPro ? 'border-slate-700' : 'border-slate-100')} />

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                          isPro ? 'bg-orange-500/20' : 'bg-emerald-100'
                        )}
                      >
                        <Check
                          className={cn('w-3 h-3', isPro ? 'text-orange-400' : 'text-emerald-600')}
                        />
                      </div>
                      <span className={cn('text-sm', isPro ? 'text-slate-300' : 'text-slate-600')}>
                        {feature}
                      </span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 opacity-50">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X className="w-3 h-3 text-slate-400" />
                      </div>
                      <span className="text-sm text-slate-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Guarantee */}
        <p className="text-center text-slate-500 text-sm mt-10">
          Garantia de 14 dias. Sem contrato, cancele quando quiser. Dados seguros com criptografia.
        </p>
      </div>
    </section>
  )
}
