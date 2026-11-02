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
  QrCode,
  Building,
  Smartphone
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
      <div className="p-4 space-y-4 bg-[#F7F9FC]">
        <Skeleton className="h-40 w-full rounded-2xl bg-[#E7ECF0]" />
        <Skeleton className="h-60 w-full rounded-2xl bg-[#E7ECF0]" />
      </div>
    )
  }

  if (isError || !trip) {
    return (
      <div className="p-6 text-center space-y-3 bg-[#F7F9FC]">
        <p className="text-[#D9534F] font-semibold text-xs">Paket wisata tidak ditemukan</p>
        <Button onClick={() => router.navigate({ to: '/' })} className="bg-[#123B5D] text-white">Kembali</Button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 pb-28 bg-[#F7F9FC]">
      {/* Header Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-[#172B3A] hover:bg-[#F7F9FC] border border-[#E7ECF0] shadow-sm"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#172B3A]">Formulir Pemesanan</h1>
          <p className="text-[11px] text-[#7B8794]">Langkah konfirmasi tiket liburan Anda</p>
        </div>
      </div>

      {/* Package Summary Card */}
      <Card className="bg-white border-[#E7ECF0] text-[#172B3A] shadow-sm rounded-2xl overflow-hidden">
        <div className="flex gap-3 p-3.5">
          <img
            src={trip.imageUrl}
            alt={trip.title}
            className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#E7ECF0]"
          />
          <div className="space-y-1 flex-1">
            <Badge className="bg-[#EBF3F8] text-[#123B5D] border-none text-[9px] font-bold">
              {trip.category}
            </Badge>
            <h3 className="font-bold text-xs line-clamp-1 text-[#172B3A]">{trip.title}</h3>
            <p className="text-[10px] text-[#7B8794] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#F4A340]" />
              {trip.destination}
            </p>
            <p className="text-xs font-black text-[#123B5D]">
              Rp {trip.price.toLocaleString('id-ID')} <span className="text-[10px] text-[#7B8794] font-normal">/pax</span>
            </p>
          </div>
        </div>
      </Card>

      {/* STEP 1: JADWAL KEBERANGKATAN */}
      <Card className="bg-white border-[#E7ECF0] text-[#172B3A] shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-[#2878A5]" /> 1. Pilih Tanggal Keberangkatan
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
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#EBF3F8] border-2 border-[#123B5D] text-[#123B5D] font-bold shadow-xs'
                      : 'bg-[#F7F9FC] border-[#E7ECF0] text-[#172B3A] hover:bg-white'
                  }`}
                >
                  <span className="text-[10px] text-[#7B8794] block">Jadwal Trip</span>
                  <span className="font-semibold text-xs">{dateStr}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* STEP 2: JUMLAH PESERTA */}
      <Card className="bg-white border-[#E7ECF0] text-[#172B3A] shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#2878A5]" /> 2. Jumlah Peserta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E7ECF0]">
            <div>
              <p className="font-bold text-[#172B3A]">Peserta Dewasa</p>
              <p className="text-[10px] text-[#7B8794]">Usia 10 tahun ke atas</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePaxChange(paxCount - 1)}
                className="w-8 h-8 rounded-lg bg-white border border-[#E7ECF0] text-[#172B3A] font-bold flex items-center justify-center hover:bg-[#EBF3F8] shadow-xs disabled:opacity-40"
                disabled={paxCount <= (trip.minParticipants || 1)}
                aria-label="Kurang peserta"
              >
                -
              </button>
              <span className="font-bold text-sm w-4 text-center text-[#172B3A]">{paxCount}</span>
              <button
                onClick={() => handlePaxChange(paxCount + 1)}
                className="w-8 h-8 rounded-lg bg-[#123B5D] text-white font-bold flex items-center justify-center hover:bg-[#0e2f4a] shadow-xs disabled:opacity-40"
                disabled={paxCount >= (trip.maxParticipants || 15)}
                aria-label="Tambah peserta"
              >
                +
              </button>
            </div>
          </div>

          {/* Passenger Names Fields */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#172B3A] block">Nama Peserta Perjalanan:</label>
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
                className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-10 rounded-xl text-[#172B3A]"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* STEP 3: DATA KONTAK PEMESAN */}
      <Card className="bg-white border-[#E7ECF0] text-[#172B3A] shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2E9D70]" /> 3. Data Pemesan (E-Ticket Dikirim ke Sini)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] text-[#7B8794]">Nama Lengkap</label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-10 rounded-xl text-[#172B3A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-[#7B8794]">Email</label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-10 rounded-xl text-[#172B3A]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#7B8794]">Nomor WhatsApp / HP</label>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-10 rounded-xl text-[#172B3A]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#7B8794]">Permintaan Khusus (Opsional)</label>
            <Input
              placeholder="Contoh: Menu makanan halal, alergi makanan laut, jemput bandara"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-10 rounded-xl text-[#172B3A]"
            />
          </div>
        </CardContent>
      </Card>

      {/* STEP 4: KODE PROMO & VOUCHER */}
      <Card className="bg-white border-[#E7ECF0] text-[#172B3A] shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-[#F4A340]" /> 4. Kode Promo / Diskon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Masukkan kode promo (misal: AYOBAHARI35)"
              value={promoCodeInput}
              onChange={(e) => setPromoCodeInput(e.target.value)}
              className="bg-[#F7F9FC] border-[#E7ECF0] text-[#172B3A] text-xs h-10 rounded-xl uppercase font-mono tracking-wider"
            />
            <Button
              size="sm"
              onClick={handleApplyPromo}
              className="h-10 px-4 text-xs bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold rounded-xl shadow-xs"
            >
              Gunakan
            </Button>
          </div>

          {appliedPromo && (
            <div className="p-3 bg-emerald-50 border border-[#2E9D70]/30 rounded-xl flex items-center justify-between text-[#2E9D70] text-[11px]">
              <span className="font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Kupon {appliedPromo.code} Aktif (-{appliedPromo.discountPercent}%)
              </span>
              <button
                onClick={() => setAppliedPromo(null)}
                className="text-[#D9534F] font-bold hover:underline"
              >
                Hapus
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* STEP 5: METODE PEMBAYARAN */}
      <Card className="bg-white border-[#E7ECF0] text-[#172B3A] shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-[#2878A5]" /> 5. Metode Pembayaran
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
                    ? 'bg-[#EBF3F8] border-2 border-[#123B5D] text-[#123B5D] font-bold shadow-xs'
                    : 'bg-[#F7F9FC] border-[#E7ECF0] text-[#172B3A] hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-white text-[#123B5D]' : 'bg-[#EBF3F8] text-[#123B5D]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold leading-tight">{method.name}</p>
                    <span className="text-[10px] text-[#7B8794]">{method.category}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#123B5D]" />}
              </button>
            )
          })}
        </CardContent>
      </Card>

      {/* STEP 6: RINCIAN HARGA TRANSPARAN */}
      <Card className="bg-white border-[#E7ECF0] text-[#172B3A] shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold text-[#172B3A] uppercase tracking-wider">
            Rincian Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex justify-between text-[#7B8794]">
            <span>Harga Paket ({paxCount}x Pax)</span>
            <span className="text-[#172B3A] font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-[#2E9D70] font-bold">
              <span>Potongan Promo Voucher</span>
              <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
            </div>
          )}

          <div className="flex justify-between text-[#7B8794]">
            <span>Asuransi Jiwa & Perlindungan</span>
            <span className="text-[#2E9D70] font-bold">Gratis</span>
          </div>

          <div className="flex justify-between text-[#7B8794]">
            <span>Biaya Layanan & Pajak</span>
            <span className="text-[#172B3A]">Rp {serviceFee.toLocaleString('id-ID')}</span>
          </div>

          <div className="pt-2 border-t border-[#E7ECF0] flex justify-between items-baseline font-bold text-sm">
            <span className="text-[#172B3A]">Total Pembayaran</span>
            <span className="text-[#123B5D] text-base font-black">
              Rp {totalAmount.toLocaleString('id-ID')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* STICKY BOTTOM CONFIRMATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-[#E7ECF0] px-4 py-3 flex items-center justify-between travel-floating-shadow safe-area-bottom">
        <div>
          <span className="text-[10px] text-[#7B8794] block uppercase">Total Bayar</span>
          <span className="text-base font-black text-[#123B5D]">
            Rp {totalAmount.toLocaleString('id-ID')}
          </span>
        </div>

        <Button
          onClick={handleSubmitBooking}
          className="bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-black text-xs h-11 px-6 rounded-xl shadow-md transition-all"
        >
          Konfirmasi Pemesanan
        </Button>
      </div>
    </div>
  )
}
