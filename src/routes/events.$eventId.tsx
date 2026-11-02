import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { eventService, type EventDeparture } from '@/services/eventService'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  Share2, 
  Heart, 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  Compass, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Check
} from 'lucide-react'

export const Route = createFileRoute('/events/$eventId')({
  component: EventDetailPage,
})

function formatDateRange(startDateStr: string, endDateStr: string) {
  try {
    const s = new Date(startDateStr)
    const e = new Date(endDateStr)
    const startFormatted = s.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    const endFormatted = e.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    return `${startFormatted} - ${endFormatted}`
  } catch {
    return `${startDateStr} - ${endDateStr}`
  }
}

function EventDetailPage() {
  const { eventId } = Route.useParams()

  const [isLiked, setIsLiked] = useState(false)
  const [selectedDeparture, setSelectedDeparture] = useState<EventDeparture | null>(null)
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)
  const [paxCount, setPaxCount] = useState(1)

  // Fetch Event Details with TanStack Query
  const { data: response, isLoading, isError, error } = useQuery({
    queryKey: ['eventDetail', eventId],
    queryFn: () => eventService.getEventDetailById(eventId),
  })

  const event = response?.body?.data

  const handleShare = () => {
    if (navigator.share && event) {
      navigator.share({
        title: event.name,
        text: `Lihat event ${event.name} diselenggarakan oleh ${event.provider.brandName} di AyoTrip!`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.info('Tautan event disalin ke clipboard!')
    }
  }

  const handleToggleLike = () => {
    if (!event) return
    setIsLiked(!isLiked)
    eventService.toggleLike(event.id)
    if (!isLiked) {
      toast.success('Event disimpan ke favorit!')
    } else {
      toast.info('Dihapus dari favorit')
    }
  }

  const openGoogleMaps = (coordinates: string, destinationName: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates || destinationName)}`
    window.open(url, '_blank')
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-4 bg-[#F7F9FC]">
        <Skeleton className="h-64 w-full rounded-3xl bg-[#E7ECF0]" />
        <Skeleton className="h-6 w-3/4 bg-[#E7ECF0]" />
        <Skeleton className="h-4 w-1/2 bg-[#E7ECF0]" />
        <div className="space-y-3 pt-3">
          <Skeleton className="h-24 w-full rounded-2xl bg-[#E7ECF0]" />
          <Skeleton className="h-32 w-full rounded-2xl bg-[#E7ECF0]" />
        </div>
      </div>
    )
  }

  if (isError || !event) {
    return (
      <div className="p-6 text-center space-y-4 bg-[#F7F9FC]">
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900">
          <p className="font-semibold text-sm">Gagal memuat detail event</p>
          <p className="text-xs text-red-600 mt-1">{(error as Error)?.message || 'Event tidak ditemukan'}</p>
        </div>
        <Link to="/events">
          <Button className="bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold text-xs rounded-xl">
            Kembali ke Daftar Event
          </Button>
        </Link>
      </div>
    )
  }

  const activeDeparture = selectedDeparture || (event.eventDepartures && event.eventDepartures[0])
  const activePrice = activeDeparture ? Number(activeDeparture.price) : Number(event.startPrice)

  return (
    <div className="space-y-5 pb-24 bg-[#F7F9FC]">
      {/* 1. HERO COVER & CONTROLS */}
      <div className="relative h-72 w-full bg-[#123B5D]">
        <img
          src={event.coverImage || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

        {/* Floating Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={() => window.history.back()}
            className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#172B3A] hover:bg-white transition-all border border-white/60 shadow-md"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#172B3A] hover:bg-white transition-all border border-white/60 shadow-md"
              aria-label="Bagikan"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleLike}
              className={`h-9 w-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all border shadow-md ${
                isLiked 
                  ? 'bg-[#D9534F] text-white border-[#D9534F]' 
                  : 'bg-white/90 text-[#172B3A] border-white/60 hover:text-[#D9534F]'
              }`}
              aria-label="Suka event"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hero Badges on image */}
        <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            {event.isOnAir ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4A340] text-slate-950 font-black text-[10px] shadow-sm animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                ON AIR (LIVE)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 text-[#123B5D] font-bold text-[10px] border border-[#E7ECF0] backdrop-blur-md">
                ⏳ SEGERA HADIR
              </span>
            )}

            <Badge className="bg-[#123B5D] text-white border-none text-xs font-bold backdrop-blur-md">
              {event.tripType === 'GENERAL' ? 'OPEN TRIP' : 'PRIVATE TRIP'}
            </Badge>

            {event.isAllowAddon && (
              <Badge className="bg-[#2878A5] text-white border-none text-[10px]">
                + Addon Tersedia
              </Badge>
            )}
          </div>

          <h1 className="text-xl font-extrabold text-white leading-snug drop-shadow-md">
            {event.name}
          </h1>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="px-4 space-y-5">

        {/* 2. STATS ROW */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-3 bg-white border border-[#E7ECF0] rounded-2xl space-y-1 shadow-sm">
            <Clock className="w-4 h-4 text-[#2878A5] mx-auto" />
            <span className="text-[10px] text-[#7B8794] block">Durasi Trip</span>
            <span className="font-bold text-[#172B3A]">{event.dayDuration} Hari</span>
          </div>

          <div className="p-3 bg-white border border-[#E7ECF0] rounded-2xl space-y-1 shadow-sm">
            <Users className="w-4 h-4 text-[#F4A340] mx-auto" />
            <span className="text-[10px] text-[#7B8794] block">Sisa Kuota</span>
            <span className="font-bold text-[#172B3A]">{event.seatCapacity} Kursi</span>
          </div>

          <div className="p-3 bg-white border border-[#E7ECF0] rounded-2xl space-y-1 shadow-sm">
            <MapPin className="w-4 h-4 text-[#2E9D70] mx-auto" />
            <span className="text-[10px] text-[#7B8794] block">Wilayah</span>
            <span className="font-bold text-[#172B3A] truncate block">{event.eventRegency.name}</span>
          </div>
        </div>

        {/* 3. SUMMARY & TAGS */}
        <div className="space-y-2">
          <div className="p-4 rounded-2xl bg-white border border-[#E7ECF0] space-y-1.5 shadow-sm">
            <span className="text-[10px] font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#2878A5]" /> Ringkasan Kegiatan
            </span>
            <p className="text-xs text-[#172B3A] leading-relaxed font-medium">
              "{event.summary}"
            </p>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {event.tag.map((t, idx) => (
              <span
                key={idx}
                className="text-[11px] text-[#172B3A] bg-white px-3 py-1 rounded-xl border border-[#E7ECF0] shadow-xs"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* 4. TRAVEL ORGANIZER / PROVIDER PROFILE (NIB & LEGALITAS) */}
        <div className="p-4 rounded-2xl bg-white border border-[#E7ECF0] space-y-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#E7ECF0]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2E9D70]" />
              <span className="text-xs font-bold text-[#172B3A] uppercase tracking-wider">
                Travel Agent & Penyelenggara Resmi
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#2E9D70] bg-emerald-50 px-2 py-0.5 rounded-full border border-[#2E9D70]/30">
              Verified Partner
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <img
              src={event.provider.logoUrl}
              alt={event.provider.brandName}
              className="w-12 h-12 rounded-xl object-cover border border-[#E7ECF0] shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none'
              }}
            />
            <div className="space-y-0.5">
              <h3 className="text-sm font-extrabold text-[#172B3A]">{event.provider.brandName}</h3>
              <p className="text-xs text-[#7B8794]">{event.provider.brandLegalName}</p>
              {event.provider.nibNumber && (
                <p className="text-[10px] font-mono text-[#2878A5] font-semibold">
                  NIB: {event.provider.nibNumber} (Izin Usaha Terdaftar)
                </p>
              )}
            </div>
          </div>

          {event.creator && (
            <div className="flex items-center justify-between text-[11px] pt-1 text-[#7B8794] border-t border-[#E7ECF0]">
              <span>PIC Acara: <strong className="text-[#172B3A]">{event.creator.profile.displayName}</strong></span>
              <span>ID: {event.providerId.substring(0, 8)}...</span>
            </div>
          )}
        </div>

        {/* 5. JADWAL KEBERANGKATAN (EVENT DEPARTURES) */}
        {event.eventDepartures && event.eventDepartures.length > 0 && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-[#2878A5]" />
                Pilih Jadwal Keberangkatan
              </h3>
              <span className="text-[10px] text-[#2878A5] font-bold bg-[#EBF3F8] px-2 py-0.5 rounded-full">
                {event.eventDepartures.length} Jadwal Tersedia
              </span>
            </div>

            <div className="space-y-2">
              {event.eventDepartures.map((dep) => {
                const isSelected = activeDeparture?.id === dep.id
                return (
                  <div
                    key={dep.id}
                    onClick={() => setSelectedDeparture(dep)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#EBF3F8] border-2 border-[#123B5D] shadow-sm'
                        : 'bg-white border-[#E7ECF0] hover:border-[#2878A5]/40 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#172B3A]">
                            {formatDateRange(dep.startDate, dep.endDate)}
                          </span>
                          <Badge className="bg-[#123B5D] text-[9px] text-white border-none">
                            {dep.tripType}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-[#7B8794] flex items-center gap-2">
                          <span>⏱️ Durasi: {dep.duration} Hari</span>
                          <span>•</span>
                          <span className="text-[#172B3A] font-bold">
                            🪑 Sisa {dep.seatAvailable} Kursi
                          </span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-[#123B5D] block">
                          Rp {Number(dep.price).toLocaleString('id-ID')}
                        </span>
                        <div className="mt-1">
                          {isSelected ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#123B5D]">
                              <Check className="w-3 h-3" /> Dipilih
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#7B8794] font-medium">Pilih</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 6. DESTINASI & LOKASI GEOGRAFIS */}
        <div className="p-4 rounded-2xl bg-white border border-[#E7ECF0] space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#F4A340]" /> Informasi Destinasi Utama
            </h3>
            <Badge className="bg-[#EBF3F8] text-[#123B5D] border border-[#2878A5]/30 text-[9px] font-bold">
              {event.destination.status}
            </Badge>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-sm font-extrabold text-[#172B3A]">
              {event.destination.displayName}
            </h4>
            <p className="text-xs text-[#7B8794]">
              {event.destination.addressName}
            </p>

            {/* Regional Hierarchy Breadcrumb */}
            <div className="text-[11px] text-[#7B8794] pt-1">
              <span>Wilayah: </span>
              <strong className="text-[#172B3A]">
                {event.destination.village?.name || 'Borobudur'}, Kec. {event.destination.district?.name || 'Borobudur'}, {event.destination.regency?.name || 'Magelang'}, {event.destination.province?.name || 'Jawa Tengah'}
              </strong>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E7ECF0]">
              <span className="text-[10px] font-mono text-[#7B8794]">
                Koordinat: {event.destination.coordinates}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openGoogleMaps(event.destination.coordinates, event.destination.displayName)}
                className="h-8 px-3 text-[10px] border-[#E7ECF0] text-[#123B5D] hover:bg-[#F7F9FC] gap-1 rounded-xl font-bold"
              >
                <ExternalLink className="w-3 h-3" />
                Buka di Peta
              </Button>
            </div>
          </div>
        </div>

        {/* 7. ARTIKEL LENGKAP DESTINASI (RICH HTML CONTENT) */}
        {event.destination.content && (
          <div className="space-y-2 pt-1">
            <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#2878A5]" />
              Panduan & Atraksi Wisata
            </h3>

            {/* Rendered HTML Container */}
            <div 
              className="p-4 rounded-2xl bg-white border border-[#E7ECF0] text-[#172B3A] leading-relaxed text-xs overflow-hidden shadow-sm [&_h1]:text-[#172B3A] [&_h2]:text-[#123B5D] [&_h3]:text-[#172B3A] [&_p]:text-[#172B3A] [&_li]:text-[#172B3A] [&_nav]:text-[#7B8794]"
              dangerouslySetInnerHTML={{ __html: event.destination.content }}
            />
          </div>
        )}

        {/* 8. FASILITAS TERMASUK & TIDAK TERMASUK */}
        <div className="space-y-3 pt-1">
          <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider">
            Fasilitas Acara
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Termasuk */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-[#2E9D70]/30 space-y-2">
              <span className="font-bold text-[#2E9D70] flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#2E9D70]" /> Sudah Termasuk:
              </span>
              {event.attributesInclude && event.attributesInclude.length > 0 ? (
                <ul className="space-y-1.5 text-[11px] text-[#172B3A]">
                  {event.attributesInclude.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#2E9D70] font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-[#7B8794]">
                  Fasilitas standar touring (makan, penginapan & road captain).
                </p>
              )}
            </div>

            {/* Belum Termasuk */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-[#D9534F]/30 space-y-2">
              <span className="font-bold text-[#D9534F] flex items-center gap-1.5 text-xs">
                <XCircle className="w-4 h-4 text-[#D9534F]" /> Belum Termasuk:
              </span>
              {event.attributesExclude && event.attributesExclude.length > 0 ? (
                <ul className="space-y-1.5 text-[11px] text-[#172B3A]">
                  {event.attributesExclude.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#D9534F] font-bold">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-[#7B8794]">
                  Bensin kendaraan pribadi & pengeluaran di luar program.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 9. STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-[#E7ECF0] px-4 py-3 flex items-center justify-between travel-floating-shadow safe-area-bottom">
        <div>
          <span className="text-[10px] text-[#7B8794] block uppercase tracking-wider">Mulai dari</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-[#123B5D]">
              Rp {activePrice.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-[#7B8794]">/ orang</span>
          </div>
        </div>

        <Button
          onClick={() => setIsRegistrationModalOpen(true)}
          className="bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-black text-xs h-11 px-6 rounded-xl shadow-md transition-all"
        >
          Daftar Kursi Event
        </Button>
      </div>

      {/* 10. MODAL KONFIRMASI PENDAFTARAN EVENT */}
      <Dialog open={isRegistrationModalOpen} onOpenChange={setIsRegistrationModalOpen}>
        <DialogContent className="bg-white border-[#E7ECF0] text-[#172B3A] max-w-sm mx-auto rounded-3xl p-5 shadow-2xl">
          <DialogHeader className="pb-2 border-b border-[#E7ECF0] space-y-1">
            <DialogTitle className="text-base font-extrabold text-[#172B3A]">
              Pendaftaran Event Touring
            </DialogTitle>
            <DialogDescription className="text-xs text-[#7B8794]">
              Konfirmasi kuota kursi Anda untuk {event.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3.5 bg-[#F7F9FC] rounded-2xl border border-[#E7ECF0] space-y-1">
              <p className="font-bold text-[#172B3A] text-xs">{event.name}</p>
              <p className="text-[11px] text-[#123B5D] font-semibold">
                Jadwal: {activeDeparture ? formatDateRange(activeDeparture.startDate, activeDeparture.endDate) : `${event.dayDuration} Hari`}
              </p>
              <p className="text-[10px] text-[#7B8794]">
                Penyelenggara: {event.provider.brandName} ({event.provider.brandLegalName})
              </p>
            </div>

            {/* Jumlah Peserta */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E7ECF0]">
              <div>
                <span className="font-bold text-[#172B3A] block">Jumlah Kursi (Pax)</span>
                <span className="text-[10px] text-[#7B8794]">Tersedia {activeDeparture?.seatAvailable || event.seatCapacity} kursi</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPaxCount(Math.max(1, paxCount - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-[#E7ECF0] text-[#172B3A] font-bold flex items-center justify-center hover:bg-[#EBF3F8] shadow-xs"
                  aria-label="Kurang kursi"
                >
                  -
                </button>
                <span className="font-bold text-sm text-[#172B3A] w-4 text-center">{paxCount}</span>
                <button
                  onClick={() => setPaxCount(Math.min(activeDeparture?.seatAvailable || 10, paxCount + 1))}
                  className="w-8 h-8 rounded-lg bg-[#123B5D] text-white font-bold flex items-center justify-center hover:bg-[#0e2f4a] shadow-xs"
                  aria-label="Tambah kursi"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Calculation */}
            <div className="p-3 rounded-xl bg-[#EBF3F8] border border-[#2878A5]/30 flex justify-between items-center text-xs">
              <span className="text-[#172B3A] font-medium">Total Pembayaran ({paxCount} Pax):</span>
              <span className="font-extrabold text-sm text-[#123B5D]">
                Rp {(activePrice * paxCount).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <DialogFooter className="flex flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsRegistrationModalOpen(false)}
              className="flex-1 text-xs border-[#E7ECF0] text-[#7B8794] rounded-xl hover:bg-[#F7F9FC]"
            >
              Batal
            </Button>
            <Button
              onClick={() => {
                toast.success('Pendaftaran event berhasil dikonfirmasi!', {
                  description: `Tiket untuk ${paxCount} peserta telah tercatat. Tim ${event.provider.brandName} akan menghubungi via WhatsApp.`,
                })
                setIsRegistrationModalOpen(false)
              }}
              className="flex-1 text-xs bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold rounded-xl shadow-md"
            >
              Konfirmasi ({paxCount} Pax)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
