'use client';
import Link from'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  DollarSign,
  Settings,
  Scissors,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAuth, rolePermissions } from '@/lib/auth-context';

const allNavItems = [
  { href: '/dashboard', label: 'Visão Geral', icon: LayoutDashboard, badge: null, permission: null },
  { href: '/dashboard/agenda', label: 'Agenda', icon: CalendarDays, badge: '3', permission: null },
  { href: '/dashboard/marketing', label: 'Marketing & CRM', icon: MessageSquare, badge: '8', permission: 'canSeeMarketing' as const },
  { href: '/dashboard/financeiro', label: 'Financeiro', icon: DollarSign, badge: null, permission: 'canSeeFinanceiro' as const },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings, badge: null, permission: 'canManageTeam' as const },
]

interface SidebarProps {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const role = user?.role ?? 'owner'
  const perms = rolePermissions[role]

  const navItems = allNavItems.filter((item) => {
    if (!item.permission) return true
    return perms[item.permission]
  })

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <div className="h-full flex flex-col bg-sidebar">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 flex-shrink-0">
            <Scissors className="w-5 h-5 text-white rotate-45" />
          </div>
          <div>
            <p className="font-display font-black text-sidebar-foreground text-lg leading-none">
              Barber<span className="text-orange-400">Pro</span>
            </p>
            <p className="text-xs text-sidebar-foreground/40 mt-0.5">Painel Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-foreground shadow-sm'
                  : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-md shadow-orange-500/30'
                    : 'bg-sidebar-foreground/10 group-hover:bg-sidebar-foreground/20'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-sidebar-foreground/60')} />
              </div>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0 min-w-[20px] h-5 flex items-center justify-center border-0">
                  {item.badge}
                </Badge>
              )}
              {isActive && <ChevronRight className="w-4 h-4 text-sidebar-foreground/40" />}
            </Link>
          )
        })}
      </nav>

      {/* User info + logout */}
      <div className="px-3 pb-5 pt-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
            {user?.initials ?? 'BP'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sidebar-foreground text-sm font-semibold truncate">{user?.name ?? 'Usuário'}</p>
            <p className="text-sidebar-foreground/40 text-xs truncate">{user?.barbershopName ?? ''}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sair"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sidebar-foreground/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
