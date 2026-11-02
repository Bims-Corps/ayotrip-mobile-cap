import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { authService, type UserProfile } from '@/services/authService'
import { bookingService } from '@/services/bookingService'
import { wishlistService } from '@/services/wishlistService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { 
  User, 
  Mail, 
  Phone, 
  Award, 
  TicketCheck, 
  Heart, 
  Settings, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  Edit3, 
  Sparkles,
  ChevronRight,
  LogIn,
  UserPlus
} from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const [user, setUser] = useState<UserProfile>(authService.getUser())
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isLoggedIn())

  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [editName, setEditName] = useState(user.name)
  const [editPhone, setEditPhone] = useState(user.phone)
  const [editEmail, setEditEmail] = useState(user.email)

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login')
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPhone, setAuthPhone] = useState('')

  // Counts
  const [bookingsCount, setBookingsCount] = useState(0)
  const [favoritesCount, setFavoritesCount] = useState(0)

  const syncData = () => {
    const current = authService.getUser()
    setUser(current)
    setIsLoggedIn(authService.isLoggedIn())
    setBookingsCount(bookingService.getAll().length)
    setFavoritesCount(wishlistService.getWishlist().length)
  }

  useEffect(() => {
    syncData()
    window.addEventListener('ayotrip_user_updated', syncData)
    window.addEventListener('ayotrip_bookings_updated', syncData)
    window.addEventListener('ayotrip_wishlist_updated', syncData)
    return () => {
      window.removeEventListener('ayotrip_user_updated', syncData)
      window.removeEventListener('ayotrip_bookings_updated', syncData)
      window.removeEventListener('ayotrip_wishlist_updated', syncData)
    }
  }, [])

  // Save profile edits
  const handleSaveProfile = () => {
    if (!editName.trim() || !editEmail.trim()) {
      toast.error('Nama dan email tidak boleh kosong')
      return
    }

    const updated = authService.updateProfile({
      name: editName,
      phone: editPhone,
      email: editEmail,
    })
    setUser(updated)
    setIsEditProfileOpen(false)
    toast.success('Profil berhasil diperbarui!')
  }

  // Handle Login / Register
  const handleAuthSubmit = () => {
    if (!authEmail.trim()) {
      toast.error('Harap masukkan alamat email')
      return
    }

    if (loginMode === 'login') {
      const u = authService.login(authEmail)
      setUser(u)
      setIsLoggedIn(true)
      setIsLoginModalOpen(false)
      toast.success(`Selamat datang kembali, ${u.name}!`)
    } else {
      if (!authName.trim() || !authPhone.trim()) {
        toast.error('Harap lengkapi semua kolom pendaftaran')
        return
      }
      const u = authService.register(authName, authEmail, authPhone)
      setUser(u)
      setIsLoggedIn(true)
      setIsLoginModalOpen(false)
      toast.success(`Pendaftaran berhasil! Selamat datang di AyoTrip, ${u.name}!`)
    }
  }

  const handleLogout = () => {
    authService.logout()
    setIsLoggedIn(false)
    toast.info('Anda telah keluar dari akun')
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* 1. Profile Header Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 space-y-3.5 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/60 shadow-lg"
          />
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-white">{user.name}</h2>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setEditName(user.name)
                    setEditPhone(user.phone)
                    setEditEmail(user.email)
                    setIsEditProfileOpen(true)
                  }}
                  className="p-1 text-slate-400 hover:text-emerald-400"
                  title="Edit Profil"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="h-7 text-[10px] bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
                >
                  Masuk / Daftar
                </Button>
              )}
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-slate-500" /> {user.email}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-slate-500" /> {user.phone}
            </p>
          </div>
        </div>

        {/* Membership Tier & Points */}
        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-amber-300">{user.membershipTier}</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40">
            <Sparkles className="w-3 h-3" />
            <span>{user.points} Poin Reward</span>
          </div>
        </div>
      </div>

      {/* 2. Quick Activity Stats */}
      <div className="grid grid-cols-2 gap-2.5">
        <Link to="/bookings" className="block">
          <Card className="bg-slate-800/50 border-slate-800 hover:border-slate-700 transition-all p-3 text-center space-y-1">
            <TicketCheck className="w-5 h-5 text-emerald-400 mx-auto" />
            <span className="text-[10px] text-slate-400 block">Riwayat Pesanan</span>
            <span className="text-base font-bold text-white">{bookingsCount} Pesanan</span>
          </Card>
        </Link>

        <Link to="/wishlist" className="block">
          <Card className="bg-slate-800/50 border-slate-800 hover:border-slate-700 transition-all p-3 text-center space-y-1">
            <Heart className="w-5 h-5 text-rose-400 mx-auto" />
            <span className="text-[10px] text-slate-400 block">Paket Favorit</span>
            <span className="text-base font-bold text-white">{favoritesCount} Disimpan</span>
          </Card>
        </Link>
      </div>

      {/* 3. Account Settings Menu */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100 divide-y divide-slate-800/80">
        <CardHeader className="py-2.5 px-4">
          <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Akun & Keamanan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 text-xs">
          <button
            onClick={() => {
              setEditName(user.name)
              setEditPhone(user.phone)
              setEditEmail(user.email)
              setIsEditProfileOpen(true)
            }}
            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Edit Data Profil</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <Link
            to="/bookings"
            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <TicketCheck className="w-4 h-4 text-teal-400" />
              <span>Tiket & Bukti Booking Aktif</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </Link>

          <Link
            to="/wishlist"
            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Daftar Paket Wisata Favorit</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </Link>

          <Link
            to="/about"
            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Tentang Aplikasi & Spesifikasi Native</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </Link>
        </CardContent>
      </Card>

      {/* 4. Login / Logout Action */}
      {isLoggedIn ? (
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full h-11 border-rose-900/40 text-rose-400 hover:bg-rose-950/30 text-xs font-bold gap-2 rounded-xl"
        >
          <LogOut className="w-4 h-4" />
          Keluar dari Akun
        </Button>
      ) : (
        <Button
          onClick={() => setIsLoginModalOpen(true)}
          className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold gap-2 rounded-xl"
        >
          <LogIn className="w-4 h-4" />
          Masuk ke Akun AyoTrip
        </Button>
      )}

      {/* EDIT PROFILE DIALOG */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-sm mx-auto rounded-3xl p-5">
          <DialogHeader className="pb-2 border-b border-slate-800">
            <DialogTitle className="text-base font-bold text-white">Edit Profil Pengguna</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Perbarui identitas kontak Anda untuk keperluan tiket perjalanan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Nama Lengkap</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-slate-800 border-slate-700 text-xs h-9 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Alamat Email</label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-xs h-9 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Nomor WhatsApp / HP</label>
              <Input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="bg-slate-800 border-slate-700 text-xs h-9 rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsEditProfileOpen(false)}
              className="flex-1 text-xs border-slate-700 text-slate-300"
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveProfile}
              className="flex-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* LOGIN / REGISTER DIALOG */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-sm mx-auto rounded-3xl p-5">
          <DialogHeader className="pb-2 border-b border-slate-800">
            <DialogTitle className="text-base font-bold text-white">
              {loginMode === 'login' ? 'Masuk ke AyoTrip' : 'Daftar Akun Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Nikmati kemudahan pesan paket wisata nusantara dan kumpulkan poin reward.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            {loginMode === 'register' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Nama Lengkap</label>
                <Input
                  placeholder="Contoh: Rian Anggara"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-xs h-9 rounded-xl"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Alamat Email</label>
              <Input
                type="email"
                placeholder="nama@email.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-xs h-9 rounded-xl"
              />
            </div>

            {loginMode === 'register' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Nomor WhatsApp / HP</label>
                <Input
                  placeholder="+62 8..."
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-xs h-9 rounded-xl"
                />
              </div>
            )}

            <div className="text-center pt-2">
              {loginMode === 'login' ? (
                <p className="text-[11px] text-slate-400">
                  Belum punya akun?{' '}
                  <button
                    onClick={() => setLoginMode('register')}
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    Daftar di sini
                  </button>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Sudah punya akun?{' '}
                  <button
                    onClick={() => setLoginMode('login')}
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    Masuk di sini
                  </button>
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              onClick={handleAuthSubmit}
              className="w-full text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold h-10 rounded-xl"
            >
              {loginMode === 'login' ? 'Masuk Sekarang' : 'Daftar Sekarang'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

