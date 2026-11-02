import { useState, useMemo } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { tripApi } from '@/services/tripService'
import { bookingService } from '@/services/bookingService'
import { authService } from '@/services/authService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  CalendarDays, 
  Users, 
  Tag, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  MapPin, 
  Clock, 
  AlertCircle,
  QrCode,
  Building,
  Smartphone,
  ChevronRight,
  Info
} from 'lucide-react'

export const Route = createFileRoute('/booking/$tripId')({
  component: BookingPage,
})

const PAYMENT_METHODS = [
  { id: 'bca_va', name: 'BCA Virtual Account', category: 'Virtual Account', icon: Building },
  { id: 'mandiri_va', name: 'Mandiri Virtual Account', category: 'Virtual Account', icon: Building },
  { id: 'qris', name: 'QRIS Instant Payment', category: 'Instant Pay', icon: QrCode },
  { id: 'gopay', name: 'GoPay / ShopeePay', category: 'E-Wallet', icon: Smartphone },
  { id: 'credit_card', name: 'Kartu Kredit / Debit', category: 'Card', icon: CreditCard },
]

function BookingPage() {
  const { tripId } = Route.useParams()
  const router = useRouter()
  const currentUser = authService.getUser()

  // Trip details query
  const { data: trip, isLoading, isError } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripApi.getTripById(tripId),
  })

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [paxCount, setPaxCount] = useState<number>(2)
  const [customerName, setCustomerName] = useState(currentUser.name || '')
  const [customerEmail, setCustomerEmail] = useState(currentUser.email || '')
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '')
  const [specialRequests, setSpecialRequests] = useState('')
  
  // Passenger names
  const [passengerNames, setPassengerNames] = useState<string[]>(['Budi Pratama', 'Siti Rahma'])

  // Promo code
  const [promoCodeInput, setPromoCodeInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number; maxDiscount: number } | null>(null)

  // Payment method
  const [selectedPayment, setSelectedPayment] = useState('bca_va')

  // Set initial date when trip is loaded
  if (trip && !selectedDate && trip.departureDates?.length > 0) {
    setSelectedDate(trip.departureDates[0])
  }

  // Adjust passenger names length when paxCount changes
  const handlePaxChange = (newCount: number) => {
    if (!trip) return
    const clamped = Math.max(trip.minParticipants || 1, Math.min(trip.maxParticipants || 10, newCount))
    setPaxCount(clamped)
    setPassengerNames((prev) => {
      const next = [...prev]
      while (next.length < clamped) {
        next.push(`Peserta ${next.length + 1}`)
      }
      return next.slice(0, clamped)
    })
  }

  // Apply promo code logic
  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase()
    if (!code) return

    if (code === 'AYOBAHARI35') {
      setAppliedPromo({ code: 'AYOBAHARI35', discountPercent: 35, maxDiscount: 1500000 })
      toast.success('Kupon AYOBAHARI35 berhasil digunakan! Diskon 35%')
    } else if (code === 'BROMOSERU') {
      setAppliedPromo({ code: 'BROMOSERU', discountPercent: 20, maxDiscount: 500000 })
      toast.success('Kupon BROMOSERU berhasil digunakan! Diskon 20%')
    } else if (code === 'JOGJAHEMAT') {
      setAppliedPromo({ code: 'JOGJAHEMAT', discountPercent: 20, maxDiscount: 350000 })
      toast.success('Kupon JOGJAHEMAT berhasil digunakan! Diskon 20%')
    } else {
      toast.error('Kode promo tidak valid atau telah kedaluwarsa')
    }
  }

  // Cost calculations
  const pricePerPax = trip?.price || 0
  const subtotal = pricePerPax * paxCount
  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0
    const rawDiscount = (subtotal * appliedPromo.discountPercent) / 100
    return Math.min(rawDiscount, appliedPromo.maxDiscount)
  }, [subtotal, appliedPromo])
  
  const serviceFee = 15000
  const totalAmount = subtotal - discountAmount + serviceFee

  // Handle final submission
  const handleSubmitBooking = () => {
    if (!trip) return
    if (!selectedDate) {
      toast.error('Pilih tanggal keberangkatan terlebih dahulu')
      return
    }
    if (!customerName || !customerEmail || !customerPhone) {
      toast.error('Harap lengkapi nama, email, dan nomor telepon pemesan')
      return
    }

    const participantsData = passengerNames.map((name) => ({ name: name.trim() || 'Peserta' }))

    const newBooking = bookingService.create({
      tripId: trip.id,
      tripTitle: trip.title,
      tripDestination: `${trip.destination}, ${trip.province}`,
      tripImageUrl: trip.imageUrl,
      duration: trip.duration,
      departureDate: selectedDate,
      departureCity: trip.departureCity,
      meetingPoint: trip.departureLocation.title,
      participantsCount: paxCount,
      participants: participantsData,
      customerName,
      customerEmail,
      customerPhone,
      specialRequests: specialRequests || undefined,
      pricePerPax,
      subtotal,
      discountAmount,
      promoCodeUsed: appliedPromo?.code,
      serviceFee,
      totalAmount,
      paymentMethod: PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.name || 'Virtual Account',
      paymentStatus: 'Lunas',
      bookingStatus: 'Dikonfirmasi',
    })

    toast.success('Pemesanan Berhasil Dikonfirmasi!', {
      description: `Kode Booking: ${newBooking.bookingCode}. E-Ticket siap diakses.`,
    })

    // Navigate to bookings page to see the newly generated ticket!
    router.navigate({ to: '/bookings' })
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-40 w-full rounded-2xl bg-slate-800" />
        <Skeleton className="h-60 w-full rounded-2xl bg-slate-800" />
      </div>
    )
  }

  if (isError || !trip) {
    return (
      <div className="p-6 text-center space-y-3">
        <p className="text-red-400 font-semibold text-xs">Paket wisata tidak ditemukan</p>
        <Button onClick={() => router.navigate({ to: '/' })}>Kembali</Button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 pb-28">
      {/* Header Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:text-white border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-white">Formulir Pemesanan</h1>
          <p className="text-[11px] text-slate-400">Langkah konfirmasi tiket liburan Anda</p>
        </div>
      </div>

      {/* Package Summary Card */}
      <Card className="bg-slate-800/60 border-slate-700/80 text-white overflow-hidden">
        <div className="flex gap-3 p-3">
          <img
            src={trip.imageUrl}
            alt={trip.title}
            className="w-20 h-20 rounded-xl object-cover shrink-0"
          />
          <div className="space-y-1 flex-1">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[9px]">
              {trip.category}
            </Badge>
            <h3 className="font-bold text-xs line-clamp-1">{trip.title}</h3>
            <p className="text-[10px] text-slate-300 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {trip.destination}
            </p>
            <p className="text-xs font-black text-emerald-400">
              Rp {trip.price.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400 font-normal">/pax</span>
            </p>
          </div>
        </div>
      </Card>

      {/* STEP 1: JADWAL KEBERANGKATAN */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-emerald-400" /> 1. Pilih Tanggal Keberangkatan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            {trip.departureDates.map((dateStr) => {
              const isSelected = selectedDate === dateStr
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 block">Jadwal Trip</span>
                  <span className="font-semibold text-xs">{dateStr}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* STEP 2: JUMLAH PESERTA */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-400" /> 2. Jumlah Peserta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/70">
            <div>
              <p className="font-bold text-white">Peserta Dewasa</p>
              <p className="text-[10px] text-slate-400">Usia 10 tahun ke atas</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePaxChange(paxCount - 1)}
                className="w-8 h-8 rounded-lg bg-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-600 disabled:opacity-40"
                disabled={paxCount <= (trip.minParticipants || 1)}
              >
                -
              </button>
              <span className="font-bold text-sm w-4 text-center">{paxCount}</span>
              <button
                onClick={() => handlePaxChange(paxCount + 1)}
                className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center justify-center hover:bg-emerald-400 disabled:opacity-40"
                disabled={paxCount >= (trip.maxParticipants || 15)}
              >
                +
              </button>
            </div>
          </div>

          {/* Passenger Names Fields */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-300 block">Nama Peserta Perjalanan:</label>
            {passengerNames.map((name, idx) => (
              <Input
                key={idx}
                placeholder={`Nama Peserta ${idx + 1}`}
                value={name}
                onChange={(e) => {
                  const updated = [...passengerNames]
                  updated[idx] = e.target.value
                  setPassengerNames(updated)
                }}
                className="bg-slate-800 border-slate-700 text-xs h-9 rounded-xl"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* STEP 3: DATA KONTAK PEMESAN */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 3. Data Pemesan (E-Ticket Dikirim ke Sini)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">Nama Lengkap</label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="bg-slate-800 border-slate-700 text-xs h-9 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">Email</label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-xs h-9 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">Nomor WhatsApp / HP</label>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="bg-slate-800 border-slate-700 text-xs h-9 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">Permintaan Khusus (Opsional)</label>
            <Input
              placeholder="Contoh: Menu makanan halal, alergi makanan laut, jemput bandara"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="bg-slate-800 border-slate-700 text-xs h-9 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* STEP 4: KODE PROMO & VOUCHER */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-emerald-400" /> 4. Kode Promo / Diskon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Masukkan kode promo (misal: AYOBAHARI35)"
              value={promoCodeInput}
              onChange={(e) => setPromoCodeInput(e.target.value)}
              className="bg-slate-800 border-slate-700 text-xs h-9 rounded-xl uppercase font-mono tracking-wider"
            />
            <Button
              size="sm"
              onClick={handleApplyPromo}
              className="h-9 px-3 text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl"
            >
              Gunakan
            </Button>
          </div>

          {appliedPromo && (
            <div className="p-2 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-center justify-between text-emerald-300 text-[11px]">
              <span className="font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Kupon {appliedPromo.code} Aktif (-{appliedPromo.discountPercent}%)
              </span>
              <button
                onClick={() => setAppliedPromo(null)}
                className="text-rose-400 hover:underline"
              >
                Hapus
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* STEP 5: METODE PEMBAYARAN */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-400" /> 5. Metode Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          {PAYMENT_METHODS.map((method) => {
            const isSelected = selectedPayment === method.id
            const Icon = method.icon
            return (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-emerald-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold leading-tight">{method.name}</p>
                    <span className="text-[10px] text-slate-400">{method.category}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            )
          })}
        </CardContent>
      </Card>

      {/* STEP 6: RINCIAN HARGA TRANSPARAN */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold text-white uppercase tracking-wider">
            Rincian Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Harga Paket ({paxCount}x Pax)</span>
            <span>Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span>Potongan Promo Voucher</span>
              <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-300">
            <span>Asuransi Jiwa & Perlindungan</span>
            <span className="text-emerald-400 font-semibold">Gratis</span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span>Biaya Layanan & Pajak</span>
            <span>Rp {serviceFee.toLocaleString('id-ID')}</span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline font-bold text-sm">
            <span className="text-white">Total Pembayaran</span>
            <span className="text-emerald-400 text-base">
              Rp {totalAmount.toLocaleString('id-ID')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* STICKY BOTTOM CONFIRMATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-4 py-3 flex items-center justify-between shadow-2xl safe-area-bottom">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">Total Bayar</span>
          <span className="text-base font-black text-emerald-400">
            Rp {totalAmount.toLocaleString('id-ID')}
          </span>
        </div>

        <Button
          onClick={handleSubmitBooking}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs h-11 px-6 rounded-xl shadow-lg shadow-emerald-500/25"
        >
          Konfirmasi Pemesanan
        </Button>
      </div>
    </div>
  )
}

