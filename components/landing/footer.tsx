import Link from 'next/link'
import { Scissors } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <Scissors className="w-4 h-4 text-white rotate-45" />
              </div>
              <span className="font-display text-lg font-black text-white">
                Barber<span className="text-orange-400">Pro</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              Plataforma SaaS all-in-one para barbearias que querem crescer de verdade.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <div className="space-y-2">
              <p className="text-slate-300 font-semibold text-sm">Produto</p>
              {['Funcionalidades', 'Planos', 'Atualizações'].map((item) => (
                <p key={item}>
                  <Link href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                    {item}
                  </Link>
                </p>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-slate-300 font-semibold text-sm">Empresa</p>
              {['Sobre', 'Blog', 'Contato'].map((item) => (
                <p key={item}>
                  <Link href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                    {item}
                  </Link>
                </p>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-slate-300 font-semibold text-sm">Legal</p>
              {['Privacidade', 'Termos', 'LGPD'].map((item) => (
                <p key={item}>
                  <Link href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                    {item}
                  </Link>
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            &copy; {new Date().getFullYear()} BarberPro. Todos os direitos reservados.
          </p>
          <p className="text-slate-600 text-sm">
            Feito com dedicação para barbeeiros brasileiros
          </p>
        </div>
      </div>
    </footer>
  )
}
