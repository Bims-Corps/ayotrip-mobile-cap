import { useState } from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { authService } from '@/services/authService'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  AtSign, 
  Phone, 
  Calendar, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  ShieldCheck,
  Check
} from 'lucide-react'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const router = useRouter()
  
  // Form states
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<any | null>(null)

  // Password confirmation check
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setErrorMessage(null)

    // 1. Validation checks on frontend
    if (!displayName.trim()) {
      setErrorMessage('Nama lengkap wajib diisi.')
      toast.error('Nama lengkap wajib diisi')
      return
    }

    if (!username.trim()) {
      setErrorMessage('Username wajib diisi.')
      toast.error('Username wajib diisi')
      return
    }

    if (username.trim().length < 3) {
      setErrorMessage('Username minimal terdiri dari 3 karakter.')
      toast.error('Username minimal 3 karakter')
      return
    }

    if (!email.trim()) {
      setErrorMessage('Alamat email wajib diisi.')
      toast.error('Alamat email wajib diisi')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Format alamat email tidak valid.')
      toast.error('Format email tidak valid')
      return
    }

    if (!phoneNumber.trim()) {
      setErrorMessage('Nomor telepon wajib diisi.')
      toast.error('Nomor telepon wajib diisi')
      return
    }

    if (!dateOfBirth) {
      setErrorMessage('Tanggal lahir wajib dipilih.')
      toast.error('Tanggal lahir wajib dipilih')
      return
    }

    if (!password) {
      setErrorMessage('Kata sandi wajib diisi.')
      toast.error('Kata sandi wajib diisi')
      return
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.')
      toast.error('Kata sandi minimal 6 karakter')
      return
    }

    // Retype password check handled on frontend
    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok. Harap periksa kembali.')
      toast.error('Kata sandi tidak cocok!')
      return
    }

    setIsLoading(true)

    try {
      const data = await authService.register({
        displayName: displayName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        dateOfBirth: dateOfBirth, // converted to ISO in authService
        password: password,
      })

      setSuccessData(data)
      toast.success('Pendaftaran Berhasil!', {
        description: `Akun atas nama ${data.username || displayName} berhasil dibuat. Silakan login.`,
      })

      setTimeout(() => {
        router.navigate({ 
          to: '/login', 
          search: { registeredEmail: email.trim() } as any 
        })
      }, 1500)
    } catch (err: any) {
      const msg = err?.message || 'Pendaftaran gagal. Silakan periksa kembali data Anda.'
      setErrorMessage(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFillSample = () => {
    setDisplayName('Iki warsudi')
    setUsername('ikiganteng123')
    setEmail('ikiwarsudi@gmail.com')
    setPhoneNumber('0878787878454512')
    setDateOfBirth('2001-01-01')
    setPassword('123123123123')
    setConfirmPassword('123123123123')
    setErrorMessage(null)
    toast.info('Data formulir contoh telah diisi!')
  }

  return (
    <div className="p-4 space-y-4 bg-[#F7F9FC] min-h-[calc(100vh-64px)] flex flex-col justify-between">
      <div className="space-y-4">
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#123B5D] hover:text-[#2878A5] transition-colors bg-white px-3 py-1.5 rounded-full border border-[#E7ECF0] shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Login
          </Link>
          <Badge className="bg-[#EBF3F8] text-[#123B5D] border border-[#2878A5]/20 text-[10px] font-bold">
            Pendaftaran Pengguna
          </Badge>
        </div>

        {/* Hero Header Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#123B5D] via-[#1a4a73] to-[#2878A5] text-white p-5 shadow-md relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F4A340] bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              <Sparkles className="w-3 h-3" />
              Bergabung Bersama AyoTrip
            </span>
            <h1 className="text-xl font-black tracking-tight text-white">
              Buat Akun Baru
            </h1>
            <p className="text-xs text-white/80 leading-relaxed max-w-xs">
              Daftar sekarang untuk memesan paket wisata nusantara, simpan destinasi favorit, dan nikmati promo eksklusif.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-[#E7ECF0] bg-white rounded-3xl shadow-sm overflow-hidden">
          <CardContent className="p-5 space-y-4">
            {/* Quick Demo Pre-fill helper */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E7ECF0]">
              <span className="text-[11px] font-bold text-[#172B3A]">
                Formulir Pendaftaran Akun
              </span>
              <button
                type="button"
                onClick={handleFillSample}
                className="text-[10px] font-bold text-[#2878A5] bg-[#EBF3F8] hover:bg-[#dbebf5] px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#F4A340]" />
                Isi Contoh Data
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-[#FFF5F5] border border-[#D9534F]/30 text-[#D9534F] text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-[11px]">Pendaftaran Belum Berhasil</p>
                  <p className="text-[11px] opacity-90 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Success Banner */}
            {successData && (
              <div className="p-3.5 rounded-2xl bg-[#E8F8F1] border border-[#2E9D70]/40 text-[#2E9D70] text-xs space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-xs text-[#2E9D70]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Akun Berhasil Terdaftar!</span>
                </div>
                <p className="text-[11px] text-[#172B3A] opacity-80">
                  Mengalihkan Anda ke halaman login...
                </p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#172B3A] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#2878A5]" />
                  Nama Lengkap
                </label>
                <Input
                  type="text"
                  placeholder="contoh: Iki warsudi"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value)
                    setErrorMessage(null)
                  }}
                  className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-11 rounded-xl text-[#172B3A] placeholder:text-[#7B8794] focus-visible:ring-[#123B5D]"
                />
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#172B3A] flex items-center gap-1.5">
                  <AtSign className="w-3.5 h-3.5 text-[#2878A5]" />
                  Username
                </label>
                <Input
                  type="text"
                  placeholder="contoh: ikiganteng123"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))
                    setErrorMessage(null)
                  }}
                  className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-11 rounded-xl text-[#172B3A] placeholder:text-[#7B8794] focus-visible:ring-[#123B5D]"
                />
                <span className="text-[10px] text-[#7B8794] block">
                  Hanya huruf kecil, angka, tanpa spasi
                </span>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#172B3A] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#2878A5]" />
                  Alamat Email
                </label>
                <Input
                  type="email"
                  placeholder="contoh: ikiwarsudi@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrorMessage(null)
                  }}
                  className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-11 rounded-xl text-[#172B3A] placeholder:text-[#7B8794] focus-visible:ring-[#123B5D]"
                />
              </div>

              {/* Nomor Telepon */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#172B3A] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#2878A5]" />
                  Nomor Telepon / WhatsApp
                </label>
                <Input
                  type="tel"
                  placeholder="contoh: 087878787845"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value)
                    setErrorMessage(null)
                  }}
                  className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-11 rounded-xl text-[#172B3A] placeholder:text-[#7B8794] focus-visible:ring-[#123B5D]"
                />
              </div>

              {/* Tanggal Lahir */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#172B3A] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2878A5]" />
                  Tanggal Lahir
                </label>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value)
                    setErrorMessage(null)
                  }}
                  className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-11 rounded-xl text-[#172B3A] focus-visible:ring-[#123B5D]"
                />
              </div>

              {/* Kata Sandi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#172B3A] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#2878A5]" />
                  Kata Sandi
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter..."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setErrorMessage(null)
                    }}
                    autoComplete="new-password"
                    className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-11 rounded-xl text-[#172B3A] placeholder:text-[#7B8794] focus-visible:ring-[#123B5D] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7B8794] hover:text-[#172B3A] transition-colors"
                    aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Ulangi Kata Sandi (Retype Check) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#172B3A] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#2878A5]" />
                    Ulangi Kata Sandi
                  </label>
                  {/* Live match indicator */}
                  {passwordsMatch && (
                    <span className="text-[10px] font-bold text-[#2E9D70] flex items-center gap-1 animate-in fade-in">
                      <Check className="w-3 h-3 stroke-[3]" /> Sandi Cocok
                    </span>
                  )}
                  {passwordsMismatch && (
                    <span className="text-[10px] font-bold text-[#D9534F] flex items-center gap-1 animate-in fade-in">
                      <AlertCircle className="w-3 h-3" /> Sandi Tidak Cocok
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Ketik ulang kata sandi Anda..."
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setErrorMessage(null)
                    }}
                    autoComplete="new-password"
                    className={`bg-[#F7F9FC] text-xs h-11 rounded-xl text-[#172B3A] placeholder:text-[#7B8794] focus-visible:ring-[#123B5D] pr-10 transition-all ${
                      passwordsMatch 
                        ? 'border-[#2E9D70] ring-1 ring-[#2E9D70]/40' 
                        : passwordsMismatch 
                        ? 'border-[#D9534F] ring-1 ring-[#D9534F]/30' 
                        : 'border-[#E7ECF0]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7B8794] hover:text-[#172B3A] transition-colors"
                    aria-label={showConfirmPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold text-xs h-12 rounded-xl shadow-md transition-all gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mendaftarkan Akun Anda...
                  </>
                ) : (
                  'Daftar Sekarang'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Footer Info */}
      <div className="text-center space-y-2 py-4">
        <p className="text-xs text-[#7B8794]">
          Sudah memiliki akun AyoTrip?{' '}
          <Link to="/login" className="text-[#123B5D] font-bold hover:underline">
            Masuk di sini
          </Link>
        </p>
        <div className="flex items-center justify-center gap-2 text-[10px] text-[#7B8794]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2E9D70]" />
          <span>Keamanan data terlindungi dengan enkripsi standar industri</span>
        </div>
      </div>
    </div>
  )
}
