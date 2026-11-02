import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { bookingService, type Booking } from '@/services/bookingService'
import { tripApi } from '@/services/tripService'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { 
  TicketCheck, 
  MapPin, 
  CalendarDays, 
  Clock, 
  QrCode, 
  AlertCircle, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Users, 
  Compass,
  ArrowRight,
  ShieldCheck,
  Building,
  RotateCcw
} from 'lucide-react'

export const Route = createFileRoute('/bookings')({
  component: BookingsPage,
})

type FilterTab = 'Semua' | 'Dikonfirmasi' | 'Menunggu' | 'Selesai' | 'Dibatalkan'

function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<FilterTab>('Semua')

  // Selected booking for viewing E-Ticket
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null)

  // Selected booking for Cancellation
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  // Selected booking for Reviewing
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  // Load and subscribe to bookings updates
  const loadBookings = () => {
    setBookings(bookingService.getAll())
  }

  useEffect(() => {
    loadBookings()
    window.addEventListener('ayotrip_bookings_updated', loadBookings)
    return () => window.removeEventListener('ayotrip_bookings_updated', loadBookings)
  }, [])

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'Semua') return true
    if (activeTab === 'Dikonfirmasi') return b.bookingStatus === 'Dikonfirmasi'
    if (activeTab === 'Menunggu') return b.bookingStatus === 'Menunggu Pembayaran'
    if (activeTab === 'Selesai') return b.bookingStatus === 'Selesai'
    if (activeTab === 'Dibatalkan') return b.bookingStatus === 'Dibatalkan'
    return true
  })

  // Cancel booking handler
  const handleConfirmCancel = () => {
    if (!cancellingBooking) return
    if (!cancelReason.trim()) {
      toast.error('Harap isi alasan pembatalan')
      return
    }

    const ok = bookingService.cancel(cancellingBooking.id, cancelReason)
    if (ok) {
      toast.success('Pemesanan berhasil dibatalkan sesuai kebijakan refund.')
      setCancellingBooking(null)
      setCancelReason('')
      loadBookings()
    }
  }

  // Submit review handler
  const handleSubmitReview = () => {
    if (!reviewingBooking) return
    if (!reviewComment.trim()) {
      toast.error('Harap tuliskan ulasan pengalaman Anda')
      return
    }

    bookingService.addReview(reviewingBooking.id, reviewRating, reviewComment)
    tripApi.addReviewToTrip(reviewingBooking.tripId, {
      userName: reviewingBooking.customerName,
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      rating: reviewRating,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      comment: reviewComment,
      helpfulCount: 1
    })

    toast.success('Terima kasih! Ulasan Anda berhasil diterbitkan.')
    setReviewingBooking(null)
    setReviewComment('')
    loadBookings()
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <TicketCheck className="w-5 h-5 text-emerald-400" />
          Riwayat & Pesanan Wisata
        </h1>
        <p className="text-xs text-slate-400">
          Kelola tiket elektronik, status pembayaran, dan riwayat perjalanan Anda.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {(['Semua', 'Dikonfirmasi', 'Menunggu', 'Selesai', 'Dibatalkan'] as FilterTab[]).map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              {tab === 'Menunggu' ? 'Menunggu Bayar' : tab}
            </button>
          )
        })}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-3">
          {filteredBookings.map((b) => (
            <Card key={b.id} className="bg-slate-800/50 border-slate-700/80 text-white overflow-hidden shadow-md">
              <CardContent className="p-3.5 space-y-3">
                {/* Header row: Booking Code & Status Badge */}
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-700/60">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Kode Booking</span>
                    <span className="font-mono font-bold text-emerald-400">{b.bookingCode}</span>
                  </div>

                  <div>
                    {b.bookingStatus === 'Dikonfirmasi' && (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                        ✓ Dikonfirmasi (Lunas)
                      </Badge>
                    )}
                    {b.bookingStatus === 'Menunggu Pembayaran' && (
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px]">
                        ⏳ Menunggu Pembayaran
                      </Badge>
                    )}
                    {b.bookingStatus === 'Selesai' && (
                      <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/40 text-[10px]">
                        ★ Perjalanan Selesai
                      </Badge>
                    )}
                    {b.bookingStatus === 'Dibatalkan' && (
                      <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-[10px]">
                        ✕ Dibatalkan
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Trip Info Preview */}
                <div className="flex gap-3">
                  <img
                    src={b.tripImageUrl}
                    alt={b.tripTitle}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="space-y-1 flex-1 text-xs">
                    <h4 className="font-bold text-white line-clamp-1">{b.tripTitle}</h4>
                    <p className="text-[11px] text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {b.tripDestination}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <CalendarDays className="w-3 h-3 text-teal-400" />
                      {b.departureDate} ({b.duration})
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3 text-cyan-400" />
                      {b.participantsCount} Peserta ({b.customerName})
                    </p>
                  </div>
                </div>

                {/* Payment info */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-700/60 bg-slate-900/40 -mx-3.5 -mb-3.5 p-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Biaya ({b.paymentMethod})</span>
                    <span className="font-extrabold text-sm text-emerald-400">
                      Rp {b.totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Action buttons based on status */}
                    {b.bookingStatus === 'Dikonfirmasi' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setCancellingBooking(b)}
                          className="h-8 text-[11px] text-rose-400 border-rose-800/60 hover:bg-rose-950/40"
                        >
                          Batalkan
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setSelectedTicket(b)}
                          className="h-8 text-[11px] bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold gap-1 rounded-lg"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          Lihat E-Ticket
                        </Button>
                      </>
                    )}

                    {b.bookingStatus === 'Selesai' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => setSelectedTicket(b)}
                          variant="outline"
                          className="h-8 text-[11px] border-slate-700 text-slate-200"
                        >
                          Bukti Booking
                        </Button>
                        {!b.reviewed ? (
                          <Button
                            size="sm"
                            onClick={() => setReviewingBooking(b)}
                            className="h-8 text-[11px] bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-1 rounded-lg"
                          >
                            <Star className="w-3.5 h-3.5 fill-slate-950" />
                            Beri Ulasan
                          </Button>
                        ) : (
                          <Badge className="bg-amber-500/20 text-amber-300 text-[10px]">
                            ✓ Diulas
                          </Badge>
                        )}
                      </>
                    )}

                    {b.bookingStatus === 'Dibatalkan' && (
                      <span className="text-[11px] text-rose-400 font-medium">
                        Alasan: {b.cancellationReason || 'Permintaan pengguna'}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-800 space-y-3">
          <TicketCheck className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-sm font-bold text-slate-200">Tidak Ada Pesanan</h4>
          <p className="text-xs text-slate-400">
            Anda belum memiliki pesanan dengan status "{activeTab}". Jelajahi paket liburan seru sekarang!
          </p>
          <Link to="/search">
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs mt-2">
              Eksplorasi Wisata
            </Button>
          </Link>
        </div>
      )}

      {/* MODAL 1: DETAIL E-TICKET ELEKTRONIK */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-sm mx-auto rounded-3xl p-5">
          <DialogHeader className="text-center pb-2 border-b border-slate-800">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
              <TicketCheck className="w-6 h-6" />
            </div>
            <DialogTitle className="text-base font-bold text-white">E-Ticket AyoTrip Resmi</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Tunjukkan bukti booking ini saat registrasi di titik kumpul.
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4 py-2 text-xs">
              {/* QR Code Simulation */}
              <div className="p-4 bg-white rounded-2xl text-slate-950 text-center space-y-2 shadow-inner">
                <div className="w-36 h-36 mx-auto bg-slate-950 p-2 rounded-xl flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-white" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Kode Tiket</span>
                  <span className="font-mono text-base font-extrabold tracking-wider">{selectedTicket.bookingCode}</span>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="space-y-2 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <div className="flex justify-between border-b border-slate-700/50 pb-1.5">
                  <span className="text-slate-400">Paket Wisata</span>
                  <span className="font-bold text-right truncate max-w-[180px]">{selectedTicket.tripTitle}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700/50 pb-1.5">
                  <span className="text-slate-400">Jadwal Keberangkatan</span>
                  <span className="font-bold text-emerald-400">{selectedTicket.departureDate}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700/50 pb-1.5">
                  <span className="text-slate-400">Titik Kumpul</span>
                  <span className="font-bold text-right truncate max-w-[170px]">{selectedTicket.meetingPoint}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700/50 pb-1.5">
                  <span className="text-slate-400">Pemesan & Kontak</span>
                  <span className="font-bold">{selectedTicket.customerName} ({selectedTicket.customerPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status Pembayaran</span>
                  <span className="font-bold text-emerald-400">LUNAS ({selectedTicket.paymentMethod})</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs h-10 rounded-xl"
              onClick={() => setSelectedTicket(null)}
            >
              Tutup E-Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: KONFIRMASI PEMBATALAN PESANAN */}
      <Dialog open={!!cancellingBooking} onOpenChange={(open) => !open && setCancellingBooking(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-sm mx-auto rounded-3xl p-5">
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-base font-bold text-white">Batalkan Pemesanan?</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Sesuai kebijakan paket ini, pengembalian dana akan diproses dalam 1-3 hari kerja ke rekening asal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 text-slate-300">
              <p className="font-bold text-white">{cancellingBooking?.tripTitle}</p>
              <p className="text-[11px] text-slate-400">Kode: {cancellingBooking?.bookingCode}</p>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Alasan Pembatalan:</label>
              <Textarea
                rows={3}
                placeholder="Misal: Perubahan jadwal dinas kantor, kendala kesehatan..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="bg-slate-800 border-slate-700 text-xs rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setCancellingBooking(null)}
              className="flex-1 text-xs border-slate-700 text-slate-300"
            >
              Kembali
            </Button>
            <Button
              onClick={handleConfirmCancel}
              className="flex-1 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              Konfirmasi Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: BERI ULASAN WISATA (REVIEW MODAL) */}
      <Dialog open={!!reviewingBooking} onOpenChange={(open) => !open && setReviewingBooking(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-sm mx-auto rounded-3xl p-5">
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <DialogTitle className="text-base font-bold text-white">Beri Ulasan Perjalanan</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Bagikan pengalaman liburan Anda untuk membantu wisatawan lainnya.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Star Rating Selector */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 transition-transform active:scale-125"
                >
                  <Star className={`w-8 h-8 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Ceritakan Pengalaman Anda:</label>
              <Textarea
                rows={3}
                placeholder="Bagaimana pelayanan guide, armada transportasi, penginapan, dan keseruan aktivitas trip?"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="bg-slate-800 border-slate-700 text-xs rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setReviewingBooking(null)}
              className="flex-1 text-xs border-slate-700 text-slate-300"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmitReview}
              className="flex-1 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
            >
              Kirim Ulasan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

