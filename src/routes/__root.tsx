import { useState, useEffect } from 'react'
import { createRootRouteWithContext, Outlet, Link, useRouterState } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { Compass, Search, TicketCheck, Heart, User, Sparkles } from 'lucide-react'
import { Toaster } from '@/components/ui/sonner'
import { bookingService } from '@/services/bookingService'

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const [activeBookingsCount, setActiveBookingsCount] = useState(0)

  // Listen to bookings update
  useEffect(() => {
    const updateCount = () => {
      const all = bookingService.getAll()
      const active = all.filter((b) => b.bookingStatus === 'Dikonfirmasi' || b.bookingStatus === 'Menunggu Pembayaran')
      setActiveBookingsCount(active.length)
    }
    updateCount()
    window.addEventListener('ayotrip_bookings_updated', updateCount)
    return () => window.removeEventListener('ayotrip_bookings_updated', updateCount)
  }, [])

  return (
    <div className="min-h-screen bg-[#EEF2F6] text-[#172B3A] flex flex-col justify-between items-center selection:bg-[#123B5D] selection:text-white font-sans">
      {/* Mobile Shell Frame */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#F7F9FC] border-x border-[#E7ECF0] shadow-xl relative">
        
        {/* Mobile Header / Status bar safe area */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E7ECF0] px-4 pt-3 pb-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#123B5D] to-[#2878A5] flex items-center justify-center text-white font-bold shadow-sm shadow-[#123B5D]/25">
              <Sparkles className="w-5 h-5 text-[#F4A340]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-[#172B3A]">AyoTrip</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFF7ED] text-[#F4A340] px-1.5 py-0.5 rounded-md border border-[#F4A340]/30">
                  Mobile
                </span>
              </div>
              <p className="text-[11px] text-[#7B8794]">Jelajahi Pesona Nusantara</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/events"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full transition-all ${
                currentPath === '/events'
                  ? 'bg-[#123B5D] text-white shadow-sm'
                  : 'bg-[#EBF3F8] text-[#123B5D] border border-[#2878A5]/20 hover:bg-[#E0EDF5]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#F4A340] animate-pulse"></span>
              Events
            </Link>
            <Link
              to="/search"
              className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-[#7B8794] hover:text-[#123B5D] border border-[#E7ECF0] shadow-sm transition-colors"
              aria-label="Cari Destinasi"
            >
              <Search className="w-4 h-4" />
            </Link>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full bg-white text-[#7B8794] border border-[#E7ECF0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E9D70] animate-pulse"></span>
              Capacitor
            </span>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 pb-24 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar (5 Main Navigation Tabs) */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto bg-white/95 backdrop-blur-lg border-t border-[#E7ECF0] px-2 py-2 flex items-center justify-around travel-nav-shadow safe-area-bottom">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              currentPath === '/' ? 'text-[#123B5D] font-bold' : 'text-[#7B8794] hover:text-[#172B3A]'
            }`}
          >
            <Compass className={`w-5 h-5 ${currentPath === '/' ? 'text-[#123B5D]' : 'text-[#7B8794]'}`} />
            <span className="text-[10px] tracking-tight">Eksplor</span>
            {currentPath === '/' && <span className="w-1 h-1 rounded-full bg-[#123B5D] mt-0.5"></span>}
          </Link>

          <Link
            to="/search"
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              currentPath === '/search' ? 'text-[#123B5D] font-bold' : 'text-[#7B8794] hover:text-[#172B3A]'
            }`}
          >
            <Search className={`w-5 h-5 ${currentPath === '/search' ? 'text-[#123B5D]' : 'text-[#7B8794]'}`} />
            <span className="text-[10px] tracking-tight">Cari</span>
            {currentPath === '/search' && <span className="w-1 h-1 rounded-full bg-[#123B5D] mt-0.5"></span>}
          </Link>

          <Link
            to="/bookings"
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all relative ${
              currentPath === '/bookings' ? 'text-[#123B5D] font-bold' : 'text-[#7B8794] hover:text-[#172B3A]'
            }`}
          >
            <div className="relative">
              <TicketCheck className={`w-5 h-5 ${currentPath === '/bookings' ? 'text-[#123B5D]' : 'text-[#7B8794]'}`} />
              {activeBookingsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F4A340] rounded-full border-2 border-white animate-pulse" />
              )}
            </div>
            <span className="text-[10px] tracking-tight">Pesanan</span>
            {currentPath === '/bookings' && <span className="w-1 h-1 rounded-full bg-[#123B5D] mt-0.5"></span>}
          </Link>

          <Link
            to="/wishlist"
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              currentPath === '/wishlist' ? 'text-[#123B5D] font-bold' : 'text-[#7B8794] hover:text-[#172B3A]'
            }`}
          >
            <Heart className={`w-5 h-5 ${currentPath === '/wishlist' ? 'text-[#123B5D]' : 'text-[#7B8794]'}`} />
            <span className="text-[10px] tracking-tight">Favorit</span>
            {currentPath === '/wishlist' && <span className="w-1 h-1 rounded-full bg-[#123B5D] mt-0.5"></span>}
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              currentPath === '/profile' ? 'text-[#123B5D] font-bold' : 'text-[#7B8794] hover:text-[#172B3A]'
            }`}
          >
            <User className={`w-5 h-5 ${currentPath === '/profile' ? 'text-[#123B5D]' : 'text-[#7B8794]'}`} />
            <span className="text-[10px] tracking-tight">Akun</span>
            {currentPath === '/profile' && <span className="w-1 h-1 rounded-full bg-[#123B5D] mt-0.5"></span>}
          </Link>
        </nav>

        {/* Sonner Toasts */}
        <Toaster richColors position="top-center" />
      </div>
    </div>
  )
}
