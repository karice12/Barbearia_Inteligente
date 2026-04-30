import { Sidebar } from '@/components/dashboard/sidebar'
import { AuthGuard } from '@/components/dashboard/auth-guard'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col border-r border-sidebar-border">
          <Sidebar />
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </div>
      </div>
    </AuthGuard>
  )
}
