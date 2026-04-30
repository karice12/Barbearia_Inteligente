'use client';
import { useState } from 'react';
import { Menu, Bell, ChevronDown, Scissors, ExternalLink } from 'lucide-react';
 import Link from'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './sidebar';
import { useAuth, roleLabels, type UserRole } from '@/lib/auth-context';

interface TopbarProps {
  title: string
}

export function Topbar({ title }: TopbarProps) {
  const { user, updateRole } = useAuth()
  const [sheetOpen, setSheetOpen] = useState(false)

  const currentRole = user?.role ?? 'owner'

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-30">
      {/* Mobile menu */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden text-slate-500">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
          <Sidebar onNavigate={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Title */}
      <h1 className="font-display font-black text-slate-900 text-xl flex-1 hidden sm:block">
        {title}
      </h1>
      <div className="flex items-center gap-2 sm:hidden">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
          <Scissors className="w-4 h-4 text-white rotate-45" />
        </div>
        <span className="font-display font-black text-slate-900">
          Barber<span className="text-orange-500">Pro</span>
        </span>
      </div>
      <div className="flex-1 sm:flex-none" />

      {/* Booking link */}
      <Link href="/agendar" target="_blank">
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex gap-2 border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Página de Agendamento
        </Button>
      </Link>

      {/* Role selector — apenas o dono pode trocar perfil */}
      {user?.role === 'owner' ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 border-slate-200 text-slate-700">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.initials.charAt(0)}
              </div>
              <span className="hidden sm:inline">{roleLabels[currentRole]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-xs text-slate-400">Simular perfil de acesso</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(roleLabels) as UserRole[]).map((r) => (
              <DropdownMenuItem key={r} onClick={() => updateRole(r)} className="cursor-pointer">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="font-medium text-sm">{roleLabels[r]}</p>
                    <p className="text-xs text-slate-400">
                      {r === 'owner' ? 'Acesso total' : r === 'barber' ? 'Agenda e comissões' : 'Agenda e CRM'}
                    </p>
                  </div>
                  {currentRole === r && <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.initials?.charAt(0) ?? '?'}
          </div>
          <span className="hidden sm:inline text-sm text-slate-700 font-medium">
            {roleLabels[currentRole]}
          </span>
        </div>
      )}

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900">
        <Bell className="w-5 h-5" />
        <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px] border-2 border-white border-0 min-w-0">
          3
        </Badge>
      </Button>
    </header>
  )
}
