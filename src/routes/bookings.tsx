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
  QrCode, 
  AlertCircle, 
  Star, 
  Users
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
    <div className="p-4 space-y-4 pb-20 bg-[#F7F9FC]">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-lg font-bold text-[#172B3A] flex items-center gap-2">
          <TicketCheck className="w-5 h-5 text-[#123B5D]" />
          Riwayat & Pesanan Wisata
        </h1>
        <p className="text-xs text-[#7B8794]">
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
              className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#123B5D] text-white shadow-sm'
                  : 'bg-white text-[#7B8794] hover:text-[#172B3A] border border-[#E7ECF0]'
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
            <Card key={b.id} className="bg-white border-[#E7ECF0] text-[#172B3A] overflow-hidden shadow-sm hover:shadow-md rounded-2xl">
              <CardContent className="p-3.5 space-y-3">
                {/* Header row: Booking Code & Status Badge */}
                <div className="flex items-center justify-between text-xs pb-2.5 border-b border-[#E7ECF0]">
                  <div>
                    <span className="text-[10px] text-[#7B8794] block">Kode Booking</span>
                    <span className="font-mono font-bold text-[#123B5D]">{b.bookingCode}</span>
                  </div>

                  <div>
                    {b.bookingStatus === 'Dikonfirmasi' && (
                      <Badge className="bg-emerald-50 text-[#2E9D70] border border-[#2E9D70]/40 text-[10px] font-bold">
                        ✓ Dikonfirmasi (Lunas)
                      </Badge>
                    )}
                    {b.bookingStatus === 'Menunggu Pembayaran' && (
                      <Badge className="bg-[#FFF7ED] text-[#F4A340] border border-[#F4A340]/40 text-[10px] font-bold">
                        ⏳ Menunggu Pembayaran
                      </Badge>
                    )}
                    {b.bookingStatus === 'Selesai' && (
                      <Badge className="bg-[#EBF3F8] text-[#123B5D] border border-[#2878A5]/30 text-[10px] font-bold">
                        ★ Perjalanan Selesai
                      </Badge>
                    )}
                    {b.bookingStatus === 'Dibatalkan' && (
                      <Badge className="bg-rose-50 text-[#D9534F] border border-[#D9534F]/30 text-[10px] font-bold">
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
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#E7ECF0]"
                  />
                  <div className="space-y-1 flex-1 text-xs">
                    <h4 className="font-bold text-[#172B3A] line-clamp-1">{b.tripTitle}</h4>
                    <p className="text-[11px] text-[#7B8794] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F4A340]" />
                      {b.tripDestination}
                    </p>
                    <p className="text-[11px] text-[#7B8794] flex items-center gap-1">
                      <CalendarDays className="w-3 h-3 text-[#2878A5]" />
                      {b.departureDate} ({b.duration})
                    </p>
                    <p className="text-[11px] text-[#7B8794] flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#123B5D]" />
                      {b.participantsCount} Peserta ({b.customerName})
                    </p>
                  </div>
                </div>

                {/* Payment info */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E7ECF0] bg-[#F7F9FC]/70 -mx-3.5 -mb-3.5 p-3">
                  <div>
                    <span className="text-[10px] text-[#7B8794] block">Total Biaya ({b.paymentMethod})</span>
                    <span className="font-extrabold text-sm text-[#123B5D]">
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
                          className="h-8 text-[11px] text-[#D9534F] border-[#D9534F]/40 hover:bg-rose-50 rounded-xl font-bold"
                        >
                          Batalkan
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setSelectedTicket(b)}
                          className="h-8 text-[11px] bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold gap-1 rounded-xl shadow-xs"
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
                          className="h-8 text-[11px] border-[#E7ECF0] text-[#172B3A] rounded-xl hover:bg-[#F7F9FC]"
                        >
                          Bukti Booking
                        </Button>
                        {!b.reviewed ? (
                          <Button
                            size="sm"
                            onClick={() => setReviewingBooking(b)}
                            className="h-8 text-[11px] bg-[#F4A340] hover:bg-[#e09335] text-slate-950 font-bold gap-1 rounded-xl shadow-xs"
                          >
                            <Star className="w-3.5 h-3.5 fill-slate-950" />
                            Beri Ulasan
                          </Button>
                        ) : (
                          <Badge className="bg-[#FFF7ED] text-[#F4A340] border border-[#F4A340]/30 text-[10px] font-bold">
                            ✓ Diulas
                          </Badge>
                        )}
                      </>
                    )}

                    {b.bookingStatus === 'Dibatalkan' && (
                      <span className="text-[11px] text-[#D9534F] font-medium">
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
        <div className="p-8 text-center bg-white rounded-2xl border border-[#E7ECF0] space-y-3 shadow-sm">
          <TicketCheck className="w-10 h-10 text-[#7B8794] mx-auto" />
          <h4 className="text-sm font-bold text-[#172B3A]">Tidak Ada Pesanan</h4>
          <p className="text-xs text-[#7B8794]">
            Anda belum memiliki pesanan dengan status "{activeTab}". Jelajahi paket liburan seru sekarang!
          </p>
          <Link to="/">
            <Button size="sm" className="bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold text-xs mt-2 rounded-xl">
              Eksplorasi Wisata
            </Button>
          </Link>
        </div>
      )}

      {/* MODAL 1: DETAIL E-TICKET ELEKTRONIK */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="bg-white border-[#E7ECF0] text-[#172B3A] max-w-sm mx-auto rounded-3xl p-5 shadow-2xl">
          <DialogHeader className="text-center pb-2 border-b border-[#E7ECF0]">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-[#EBF3F8] text-[#123B5D] flex items-center justify-center mb-2">
              <TicketCheck className="w-6 h-6" />
            </div>
            <DialogTitle className="text-base font-bold text-[#172B3A]">E-Ticket AyoTrip Resmi</DialogTitle>
            <DialogDescription className="text-xs text-[#7B8794]">
              Tunjukkan bukti booking ini saat registrasi di titik kumpul.
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4 py-2 text-xs">
              {/* QR Code Simulation */}
              <div className="p-4 bg-[#F7F9FC] border border-[#E7ECF0] rounded-2xl text-[#172B3A] text-center space-y-2">
                <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-[#E7ECF0] flex items-center justify-center shadow-xs">
                  <QrCode className="w-32 h-32 text-[#123B5D]" />
                </div>
                <div>
                  <span className="text-[10px] text-[#7B8794] uppercase tracking-widest block font-bold">Kode Tiket</span>
                  <span className="font-mono text-base font-extrabold text-[#123B5D] tracking-wider">{selectedTicket.bookingCode}</span>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="space-y-2 p-3 bg-[#F7F9FC] rounded-xl border border-[#E7ECF0]">
                <div className="flex justify-between border-b border-[#E7ECF0] pb-1.5">
                  <span className="text-[#7B8794]">Paket Wisata</span>
                  <span className="font-bold text-right truncate max-w-[180px] text-[#172B3A]">{selectedTicket.tripTitle}</span>
                </div>
                <div className="flex justify-between border-b border-[#E7ECF0] pb-1.5">
                  <span className="text-[#7B8794]">Jadwal Keberangkatan</span>
                  <span className="font-bold text-[#123B5D]">{selectedTicket.departureDate}</span>
                </div>
                <div className="flex justify-between border-b border-[#E7ECF0] pb-1.5">
                  <span className="text-[#7B8794]">Titik Kumpul</span>
                  <span className="font-bold text-right truncate max-w-[170px] text-[#172B3A]">{selectedTicket.meetingPoint}</span>
                </div>
                <div className="flex justify-between border-b border-[#E7ECF0] pb-1.5">
                  <span className="text-[#7B8794]">Pemesan & Kontak</span>
                  <span className="font-bold text-[#172B3A]">{selectedTicket.customerName} ({selectedTicket.customerPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7B8794]">Status Pembayaran</span>
                  <span className="font-bold text-[#2E9D70]">LUNAS ({selectedTicket.paymentMethod})</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              className="w-full bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold text-xs h-10 rounded-xl"
              onClick={() => setSelectedTicket(null)}
            >
              Tutup E-Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: KONFIRMASI PEMBATALAN PESANAN */}
      <Dialog open={!!cancellingBooking} onOpenChange={(open) => !open && setCancellingBooking(null)}>
        <DialogContent className="bg-white border-[#E7ECF0] text-[#172B3A] max-w-sm mx-auto rounded-3xl p-5 shadow-2xl">
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-rose-50 text-[#D9534F] flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-base font-bold text-[#172B3A]">Batalkan Pemesanan?</DialogTitle>
            <DialogDescription className="text-xs text-[#7B8794]">
              Sesuai kebijakan paket ini, pengembalian dana akan diproses dalam 1-3 hari kerja ke rekening asal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E7ECF0] text-[#172B3A]">
              <p className="font-bold text-[#172B3A]">{cancellingBooking?.tripTitle}</p>
              <p className="text-[11px] text-[#7B8794]">Kode: {cancellingBooking?.bookingCode}</p>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#172B3A]">Alasan Pembatalan:</label>
              <Textarea
                rows={3}
                placeholder="Misal: Perubahan jadwal dinas kantor, kendala kesehatan..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="bg-[#F7F9FC] border-[#E7ECF0] text-xs rounded-xl text-[#172B3A]"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setCancellingBooking(null)}
              className="flex-1 text-xs border-[#E7ECF0] text-[#7B8794] rounded-xl hover:bg-[#F7F9FC]"
            >
              Kembali
            </Button>
            <Button
              onClick={handleConfirmCancel}
              className="flex-1 text-xs bg-[#D9534F] hover:bg-[#c94541] text-white font-bold rounded-xl"
            >
              Konfirmasi Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: BERI ULASAN WISATA (REVIEW MODAL) */}
      <Dialog open={!!reviewingBooking} onOpenChange={(open) => !open && setReviewingBooking(null)}>
        <DialogContent className="bg-white border-[#E7ECF0] text-[#172B3A] max-w-sm mx-auto rounded-3xl p-5 shadow-2xl">
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-[#FFF7ED] text-[#F4A340] flex items-center justify-center mb-2">
              <Star className="w-6 h-6 fill-[#F4A340]" />
            </div>
            <DialogTitle className="text-base font-bold text-[#172B3A]">Beri Ulasan Perjalanan</DialogTitle>
            <DialogDescription className="text-xs text-[#7B8794]">
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
                  aria-label={`Beri bintang ${star}`}
                >
                  <Star className={`w-8 h-8 ${star <= reviewRating ? 'fill-[#F4A340] text-[#F4A340]' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#172B3A]">Ceritakan Pengalaman Anda:</label>
              <Textarea
                rows={3}
                placeholder="Bagaimana pelayanan guide, armada transportasi, penginapan, dan keseruan aktivitas trip?"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="bg-[#F7F9FC] border-[#E7ECF0] text-xs rounded-xl text-[#172B3A]"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setReviewingBooking(null)}
              className="flex-1 text-xs border-[#E7ECF0] text-[#7B8794] rounded-xl hover:bg-[#F7F9FC]"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmitReview}
              className="flex-1 text-xs bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold rounded-xl"
            >
              Kirim Ulasan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
