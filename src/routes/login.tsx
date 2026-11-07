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
  Sparkles, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Building2,
  Smartphone
} from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [lastSuccessData, setLastSuccessData] = useState<any | null>(null)

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setErrorMessage(null)

    if (!email.trim()) {
      setErrorMessage('Alamat email wajib diisi.')
      toast.error('Alamat email wajib diisi')
      return
    }

    if (!password) {
      setErrorMessage('Kata sandi wajib diisi.')
      toast.error('Kata sandi wajib diisi')
      return
    }

    setIsLoading(true)

    try {
      const data = await authService.login({
        email: email.trim(),
        password: password,
      })

      setLastSuccessData(data)
      const displayName = data.profile?.displayName || data.username || data.email
      toast.success('Login Berhasil!', {
        description: `Selamat datang kembali, ${displayName}. Sesi autentikasi telah aktif.`,
      })

      setTimeout(() => {
        router.navigate({ to: '/profile' })
      }, 1000)
    } catch (err: any) {
      const msg = err?.message || 'Login gagal, periksa email dan kata sandi Anda.'
      setErrorMessage(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFillSampleCredentials = () => {
    setEmail('userprovown1@gmail.com')
    setPassword('mysecretepass_123')
    setErrorMessage(null)
    toast.info('Contoh kredensial telah dimasukkan!')
  }

  const handleDemoLogin = () => {
    const demoUser = authService.loginDemo(
      email || 'userprovown1@gmail.com',
      'Provider Owner 1'
    )
    toast.success('Berhasil login dalam Mode Demo!', {
      description: `Selamat datang, ${demoUser.name}.`,
    })
    setTimeout(() => {
      router.navigate({ to: '/profile' })
    }, 800)
  }

  return (
    <div className="p-4 space-y-5 pb-24 bg-[#F7F9FC] min-h-[90vh] flex flex-col justify-between">
      <div className="space-y-5">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-[#172B3A] hover:bg-[#F7F9FC] border border-[#E7ECF0] shadow-sm transition-colors"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-[#123B5D] to-[#2878A5] text-white shadow-md shadow-[#123B5D]/20 mb-1">
            <Sparkles className="w-7 h-7 text-[#F4A340]" />
          </div>
          <h1 className="text-2xl font-black text-[#172B3A] tracking-tight">
            Selamat Datang Kembali
          </h1>
          <p className="text-xs text-[#7B8794] max-w-xs mx-auto">
            Masuk ke akun AyoTrip Anda untuk mengelola paket wisata, booking, dan e-ticket.
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="bg-white border-[#E7ECF0] text-[#172B3A] rounded-3xl shadow-sm overflow-hidden">
          <CardContent className="p-5 space-y-4">
            {/* Inline Error Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-[#D9534F] text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Gagal Masuk</p>
                  <p className="text-[11px] leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Success Preview if logged in */}
            {lastSuccessData && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-[#2E9D70]/40 text-[#2E9D70] text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Autentikasi Berhasil!</p>
                  <p className="text-[11px]">Token disimpan di localStorage. Mengalihkan ke profil...</p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#172B3A] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#2878A5]" />
                  Alamat Email <span className="text-[#D9534F]">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="yourmail@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrorMessage(null)
                  }}
                  autoComplete="email"
                  className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-11 rounded-xl text-[#172B3A] placeholder:text-[#7B8794] focus-visible:ring-[#123B5D]"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#172B3A] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#2878A5]" />
                    Kata Sandi <span className="text-[#D9534F]">*</span>
                  </label>
                  <span className="text-[10px] text-[#2878A5] font-semibold hover:underline cursor-pointer">
                    Lupa Sandi?
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="mysecretepass_123"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setErrorMessage(null)
                    }}
                    autoComplete="current-password"
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

              {/* Submit CTA */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold text-xs h-12 rounded-xl shadow-md transition-all gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menghubungi Server Autentikasi...
                  </>
                ) : (
                  'Masuk ke Akun'
                )}
              </Button>
            </form>

            
          </CardContent>
        </Card>
      </div>

      {/* Footer Info */}
      <div className="text-center space-y-2 pt-4">
        <p className="text-xs text-[#7B8794]">
          Belum memiliki akun AyoTrip?{' '}
          <Link to="/register" className="text-[#123B5D] font-bold hover:underline">
            Daftar di sini
          </Link>
        </p>
        <div className="flex items-center justify-center gap-2 text-[10px] text-[#7B8794]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2E9D70]" />
          <span>Koneksi aman terenkripsi SSL 256-bit</span>
        </div>
      </div>
    </div>
  )
}
