import { createRootRouteWithContext, Outlet, Link, useRouterState } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { Compass, PlusCircle, Info, Sparkles } from 'lucide-react'
import { Toaster } from '@/components/ui/sonner'

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center selection:bg-emerald-500 selection:text-white">
      {/* Mobile Shell Frame */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-slate-900 border-x border-slate-800 shadow-2xl relative">
        
        {/* Mobile Header / Status bar safe area */}
        <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 pt-3 pb-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">AyoTrip</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Mobile
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Jelajahi Pesona Nusantara</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Capacitor
            </span>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 pb-24 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-4 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg transition-all ${
              currentPath === '/' ? 'text-emerald-400 font-semibold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[11px]">Eksplor</span>
          </Link>

          <Link
            to="/create"
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg transition-all ${
              currentPath === '/create' ? 'text-emerald-400 font-semibold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Rencana</span>
          </Link>

          <Link
            to="/about"
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg transition-all ${
              currentPath === '/about' ? 'text-emerald-400 font-semibold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="text-[11px]">Tentang</span>
          </Link>
        </nav>

        {/* Sonner Toasts */}
        <Toaster richColors position="top-center" />
      </div>
    </div>
  )
}

