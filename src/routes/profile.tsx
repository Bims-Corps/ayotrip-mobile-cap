import { useState, useEffect } from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { authService, type UserProfile, type LoginUserData } from '@/services/authService'
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
  ShieldCheck, 
  LogOut, 
  Edit3, 
  Sparkles, 
  ChevronRight, 
  LogIn, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle,
  KeyRound
} from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile>(authService.getUser())
  const [authUser, setAuthUser] = useState<LoginUserData | null>(authService.getAuthUser())
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
  const [authPassword, setAuthPassword] = useState('')
  const [authPhone, setAuthPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false)
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null)

  // Counts
  const [bookingsCount, setBookingsCount] = useState(0)
  const [favoritesCount, setFavoritesCount] = useState(0)

  const syncData = () => {
    const current = authService.getUser()
    setUser(current)
    setAuthUser(authService.getAuthUser())
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

  // Handle Login / Register with real API hit to /auth/login
  const handleAuthSubmit = async () => {
    setAuthErrorMessage(null)

    if (!authEmail.trim()) {
      toast.error('Harap masukkan alamat email')
      return
    }

    if (loginMode === 'login') {
      if (!authPassword) {
        toast.error('Harap masukkan kata sandi')
        return
      }

      setIsSubmittingAuth(true)
      try {
        const loginData = await authService.login({
          email: authEmail.trim(),
          password: authPassword,
        })

        syncData()
        setIsLoginModalOpen(false)
        setAuthPassword('')
        setAuthErrorMessage(null)

        const displayName = loginData.profile?.displayName || loginData.username || loginData.email
        toast.success(`Login berhasil! Selamat datang, ${displayName}.`)
      } catch (err: any) {
        const errorMsg = err?.message || 'Login gagal, periksa email dan kata sandi Anda.'
        setAuthErrorMessage(errorMsg)
        toast.error(errorMsg)
      } finally {
        setIsSubmittingAuth(false)
      }
    } else {
      // Register demo fallback
      if (!authName.trim() || !authPhone.trim()) {
        toast.error('Harap lengkapi semua kolom pendaftaran')
        return
      }
      const u = authService.registerDemo(authName, authEmail, authPhone)
      setUser(u)
      setIsLoggedIn(true)
      setIsLoginModalOpen(false)
      toast.success(`Pendaftaran berhasil! Selamat datang di AyoTrip, ${u.name}!`)
    }
  }

  const handleQuickFillDemo = () => {
    setAuthEmail('userprovown1@gmail.com')
    setAuthPassword('mysecretepass_123')
    setAuthErrorMessage(null)
  }

  const handleDirectDemoLogin = () => {
    authService.loginDemo(authEmail || 'userprovown1@gmail.com', 'Provider Owner 1')
    syncData()
    setIsLoginModalOpen(false)
    toast.success('Berhasil login via Demo Mode (Provider Owner 1)')
  }

  const handleLogout = () => {
    authService.logout()
    setIsLoggedIn(false)
    toast.info('Anda telah keluar dari akun')
  }

  return (
    <div className="p-4 space-y-4 pb-20 bg-[#F7F9FC]">
      {/* 1. Profile Header Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#123B5D] to-[#2878A5] text-white space-y-3.5 shadow-md relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
          />
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-white leading-tight">{user.name}</h2>
                {authUser?.role?.name && (
                  <span className="inline-block mt-0.5 text-[9px] uppercase tracking-wider font-extrabold bg-[#F4A340] text-slate-950 px-2 py-0.2 rounded">
                    {authUser.role.name.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setEditName(user.name)
                    setEditPhone(user.phone)
                    setEditEmail(user.email)
                    setIsEditProfileOpen(true)
                  }}
                  className="p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                  title="Edit Profil"
                  aria-label="Edit Profil"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link to="/login">
                    <Button
                      size="sm"
                      className="h-7 text-[10px] bg-[#F4A340] hover:bg-[#e09335] text-slate-950 font-bold rounded-lg"
                    >
                      Masuk
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <p className="text-xs text-white/85 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-white/70" /> {user.email}
            </p>
            <p className="text-xs text-white/85 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-white/70" /> {user.phone}
            </p>
          </div>
        </div>

        {/* Membership Tier & Points */}
        <div className="pt-2.5 border-t border-white/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#F4A340]" />
            <span className="font-bold text-white">{user.membershipTier}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#123B5D] bg-white px-2.5 py-0.5 rounded-full shadow-xs">
            <Sparkles className="w-3 h-3 text-[#F4A340]" />
            <span>{user.points} Poin Reward</span>
          </div>
        </div>
      </div>

      {/* 2. Quick Activity Stats */}
      <div className="grid grid-cols-2 gap-2.5">
        <Link to="/bookings" className="block">
          <Card className="bg-white border-[#E7ECF0] hover:border-[#2878A5]/40 transition-all p-3.5 text-center space-y-1 rounded-2xl shadow-sm">
            <TicketCheck className="w-5 h-5 text-[#2878A5] mx-auto" />
            <span className="text-[10px] text-[#7B8794] block">Riwayat Pesanan</span>
            <span className="text-base font-bold text-[#172B3A]">{bookingsCount} Pesanan</span>
          </Card>
        </Link>

        <Link to="/wishlist" className="block">
          <Card className="bg-white border-[#E7ECF0] hover:border-[#2878A5]/40 transition-all p-3.5 text-center space-y-1 rounded-2xl shadow-sm">
            <Heart className="w-5 h-5 text-[#D9534F] mx-auto" />
            <span className="text-[10px] text-[#7B8794] block">Paket Favorit</span>
            <span className="text-base font-bold text-[#172B3A]">{favoritesCount} Disimpan</span>
          </Card>
        </Link>
      </div>

      {/* 3. Account Settings Menu */}
      <Card className="bg-white border-[#E7ECF0] text-[#172B3A] divide-y divide-[#E7ECF0] rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="py-2.5 px-4 bg-[#F7F9FC]/70">
          <CardTitle className="text-xs font-bold text-[#7B8794] uppercase tracking-wider">
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
            className="w-full flex items-center justify-between p-3.5 hover:bg-[#F7F9FC] transition-colors"
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-[#123B5D]" />
              <span className="font-medium">Edit Data Profil</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#7B8794]" />
          </button>

          <Link
            to="/bookings"
            className="w-full flex items-center justify-between p-3.5 hover:bg-[#F7F9FC] transition-colors"
          >
            <div className="flex items-center gap-3">
              <TicketCheck className="w-4 h-4 text-[#2878A5]" />
              <span className="font-medium">Tiket & Bukti Booking Aktif</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#7B8794]" />
          </Link>

          <Link
            to="/wishlist"
            className="w-full flex items-center justify-between p-3.5 hover:bg-[#F7F9FC] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-[#D9534F]" />
              <span className="font-medium">Daftar Paket Wisata Favorit</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#7B8794]" />
          </Link>

          <Link
            to="/about"
            className="w-full flex items-center justify-between p-3.5 hover:bg-[#F7F9FC] transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#2E9D70]" />
              <span className="font-medium">Tentang Aplikasi & Spesifikasi Native</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#7B8794]" />
          </Link>
        </CardContent>
      </Card>

      {/* 4. Login / Logout Action */}
      {isLoggedIn ? (
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full h-11 border-rose-200 text-[#D9534F] hover:bg-rose-50 text-xs font-bold gap-2 rounded-xl"
        >
          <LogOut className="w-4 h-4" />
          Keluar dari Akun
        </Button>
      ) : (
        <div className="flex gap-2">
          <Link to="/login" className="flex-1">
            <Button
              className="w-full h-11 bg-[#123B5D] hover:bg-[#0e2f4a] text-white text-xs font-bold gap-2 rounded-xl shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              Halaman Login
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => {
              setLoginMode('login')
              setIsLoginModalOpen(true)
            }}
            className="h-11 px-4 border-[#E7ECF0] text-[#123B5D] text-xs font-bold rounded-xl"
          >
            Modal Cepat
          </Button>
        </div>
      )}

      {/* EDIT PROFILE DIALOG */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="bg-white border-[#E7ECF0] text-[#172B3A] max-w-sm mx-auto rounded-3xl p-5 shadow-2xl">
          <DialogHeader className="pb-2 border-b border-[#E7ECF0]">
            <DialogTitle className="text-base font-bold text-[#172B3A]">Edit Profil Pengguna</DialogTitle>
            <DialogDescription className="text-xs text-[#7B8794]">
              Perbarui identitas kontak Anda untuk keperluan tiket perjalanan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#172B3A]">Nama Lengkap</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-10 rounded-xl text-[#172B3A]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#172B3A]">Alamat Email</label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-10 rounded-xl text-[#172B3A]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#172B3A]">Nomor WhatsApp / HP</label>
              <Input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-10 rounded-xl text-[#172B3A]"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsEditProfileOpen(false)}
              className="flex-1 text-xs border-[#E7ECF0] text-[#7B8794] rounded-xl hover:bg-[#F7F9FC]"
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveProfile}
              className="flex-1 text-xs bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold rounded-xl"
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* LOGIN / REGISTER DIALOG WITH REAL /auth/login HIT */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="bg-white border-[#E7ECF0] text-[#172B3A] max-w-sm mx-auto rounded-3xl p-5 shadow-2xl">
          <DialogHeader className="pb-2 border-b border-[#E7ECF0]">
            <DialogTitle className="text-base font-bold text-[#172B3A] flex items-center gap-2">
              <LogIn className="w-5 h-5 text-[#123B5D]" />
              {loginMode === 'login' ? 'Masuk ke AyoTrip' : 'Daftar Akun Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#7B8794]">
              {loginMode === 'login'
                ? 'Autentikasi dengan endpoint resmi /auth/login'
                : 'Nikmati kemudahan pesan paket wisata nusantara dan kumpulkan poin reward.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            {/* Inline Error Alert if any */}
            {authErrorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-[#D9534F] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-[11px] font-medium leading-snug">{authErrorMessage}</span>
              </div>
            )}

            {loginMode === 'register' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#172B3A]">Nama Lengkap</label>
                <Input
                  placeholder="Contoh: Rian Anggara"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-10 rounded-xl text-[#172B3A]"
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#172B3A] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#2878A5]" />
                Alamat Email
              </label>
              <Input
                type="email"
                placeholder="nama@email.com"
                value={authEmail}
                onChange={(e) => {
                  setAuthEmail(e.target.value)
                  setAuthErrorMessage(null)
                }}
                className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-10 rounded-xl text-[#172B3A]"
              />
            </div>

            {/* Password Field (only for login) */}
            {loginMode === 'login' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#172B3A] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#2878A5]" />
                    Kata Sandi
                  </label>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan kata sandi..."
                    value={authPassword}
                    onChange={(e) => {
                      setAuthPassword(e.target.value)
                      setAuthErrorMessage(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAuthSubmit()
                    }}
                    className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-10 rounded-xl text-[#172B3A] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B8794] hover:text-[#172B3A]"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {loginMode === 'register' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#172B3A]">Nomor WhatsApp / HP</label>
                <Input
                  placeholder="+62 8..."
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-10 rounded-xl text-[#172B3A]"
                />
              </div>
            )}

            {/* Quick Demo Helper */}
            {loginMode === 'login' && (
              <div className="pt-1 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={handleQuickFillDemo}
                  className="text-[#2878A5] font-semibold hover:underline flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  Isi Contoh Akun
                </button>
                <button
                  type="button"
                  onClick={handleDirectDemoLogin}
                  className="text-[#7B8794] hover:text-[#172B3A]"
                >
                  Masuk Mode Demo
                </button>
              </div>
            )}

            <div className="text-center pt-2">
              {loginMode === 'login' ? (
                <p className="text-[11px] text-[#7B8794]">
                  Belum punya akun?{' '}
                  <Link
                    to="/register"
                    onClick={() => setIsLoginModalOpen(false)}
                    className="text-[#123B5D] font-bold hover:underline"
                  >
                    Daftar di sini
                  </Link>
                </p>
              ) : (
                <p className="text-[11px] text-[#7B8794]">
                  Sudah punya akun?{' '}
                  <button
                    onClick={() => {
                      setLoginMode('login')
                      setAuthErrorMessage(null)
                    }}
                    className="text-[#123B5D] font-bold hover:underline"
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
              disabled={isSubmittingAuth}
              className="w-full text-xs bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold h-11 rounded-xl shadow-md gap-2"
            >
              {isSubmittingAuth ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses Login...
                </>
              ) : loginMode === 'login' ? (
                'Masuk Sekarang'
              ) : (
                'Daftar Sekarang'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
