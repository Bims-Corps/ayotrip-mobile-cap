import { useState, useEffect } from 'react'
import { createRootRouteWithContext, Outlet, Link, useRouterState } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { Home, TicketCheck, Heart, User, Sparkles, LogIn } from 'lucide-react'
import { Toaster } from '@/components/ui/sonner'
import { bookingService } from '@/services/bookingService'
import { authService } from '@/services/authService'

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
  const [isLoggedIn, setIsLoggedIn] = useState(() => authService.isLoggedIn())

  // Middleware effect: Listen to bookings & authentication status in real-time
  useEffect(() => {
    const updateCount = () => {
      const all = bookingService.getAll()
      const active = all.filter((b) => b.bookingStatus === 'Dikonfirmasi' || b.bookingStatus === 'Menunggu Pembayaran')
      setActiveBookingsCount(active.length)
    }

    const updateAuth = () => {
      setIsLoggedIn(authService.isLoggedIn())
    }

    updateCount()
    updateAuth()

    window.addEventListener('ayotrip_bookings_updated', updateCount)
    window.addEventListener('ayotrip_user_updated', updateAuth)
    return () => {
      window.removeEventListener('ayotrip_bookings_updated', updateCount)
      window.removeEventListener('ayotrip_user_updated', updateAuth)
    }
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
              </div>
              <p className="text-[11px] text-[#7B8794]">Jelajahi Pesona Nusantara</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {/* Quick Login Button in Header if not logged in */}
            {!isLoggedIn ? (
              <Link
                to="/login"
                className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold rounded-full bg-[#123B5D] text-white hover:bg-[#0e2f4a] shadow-xs transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                Masuk
              </Link>
            ) : ""}
          </div>
        </header>

        {/* Page Content Outlet (Dynamic bottom padding based on login status) */}
        <main className={`flex-1 overflow-y-auto ${isLoggedIn ? 'pb-24' : 'pb-6'}`}>
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar:
            Middleware condition: Rendered ONLY when the user is logged in (isLoggedIn === true) */}
        {isLoggedIn && (
          <nav className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto bg-white/95 backdrop-blur-lg border-t border-[#E7ECF0] px-4 py-2 flex items-center justify-around travel-nav-shadow safe-area-bottom animate-in fade-in duration-200">
            <Link
              to="/"
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
                currentPath === '/' ? 'text-[#123B5D] font-bold' : 'text-[#7B8794] hover:text-[#172B3A]'
              }`}
            >
              <Home className={`w-5 h-5 ${currentPath === '/' ? 'text-[#123B5D]' : 'text-[#7B8794]'}`} />
              <span className="text-[10px] tracking-tight">Beranda</span>
              {currentPath === '/' && <span className="w-1 h-1 rounded-full bg-[#123B5D] mt-0.5"></span>}
            </Link>

            <Link
              to="/bookings"
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
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
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
                currentPath === '/wishlist' ? 'text-[#123B5D] font-bold' : 'text-[#7B8794] hover:text-[#172B3A]'
              }`}
            >
              <Heart className={`w-5 h-5 ${currentPath === '/wishlist' ? 'text-[#123B5D]' : 'text-[#7B8794]'}`} />
              <span className="text-[10px] tracking-tight">Favorit</span>
              {currentPath === '/wishlist' && <span className="w-1 h-1 rounded-full bg-[#123B5D] mt-0.5"></span>}
            </Link>

            <Link
              to="/profile"
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
                currentPath === '/profile' ? 'text-[#123B5D] font-bold' : 'text-[#7B8794] hover:text-[#172B3A]'
              }`}
            >
              <User className={`w-5 h-5 ${currentPath === '/profile' ? 'text-[#123B5D]' : 'text-[#7B8794]'}`} />
              <span className="text-[10px] tracking-tight">Akun</span>
              {currentPath === '/profile' && <span className="w-1 h-1 rounded-full bg-[#123B5D] mt-0.5"></span>}
            </Link>
          </nav>
        )}

        {/* Sonner Toasts */}
        <Toaster richColors position="top-center" />
      </div>
    </div>
  )
}
