import { useState } from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { tripApi } from '@/services/tripService'
import { wishlistService } from '@/services/wishlistService'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Share2, 
  Heart, 
  ShieldCheck, 
  CalendarDays,
  Sparkles,
  Users,
  Navigation,
  Check,
  Coins
} from 'lucide-react'

export const Route = createFileRoute('/trips/$tripId')({
  component: TripDetailPage,
})

function TripDetailPage() {
  const { tripId } = Route.useParams()
  const router = useRouter()
  
  // Selected photo index for gallery preview
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)
  
  // Active Itinerary Day Tab
  const [activeDay, setActiveDay] = useState(1)
  
  // Wishlist state
  const [isFavorited, setIsFavorited] = useState(() => wishlistService.isInWishlist(tripId))

  // TanStack Query for dynamic trip details
  const { data: trip, isLoading, isError, error } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripApi.getTripById(tripId),
  })

  const handleToggleFavorite = () => {
    const added = wishlistService.toggleWishlist(tripId)
    setIsFavorited(added)
    if (added) {
      toast.success('Disimpan ke Favorit!')
    } else {
      toast.info('Dihapus dari Favorit')
    }
  }

  const handleShare = () => {
    if (navigator.share && trip) {
      navigator.share({
        title: trip.title,
        text: `Lihat paket wisata ${trip.title} di AyoTrip Mobile!`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.info('Tautan trip disalin ke clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-4 bg-[#F7F9FC]">
        <Skeleton className="h-64 w-full rounded-2xl bg-[#E7ECF0]" />
        <Skeleton className="h-6 w-3/4 bg-[#E7ECF0]" />
        <Skeleton className="h-4 w-1/2 bg-[#E7ECF0]" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-20 w-full rounded-xl bg-[#E7ECF0]" />
          <Skeleton className="h-20 w-full rounded-xl bg-[#E7ECF0]" />
        </div>
      </div>
    )
  }

  if (isError || !trip) {
    return (
      <div className="p-6 text-center space-y-4 bg-[#F7F9FC]">
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900">
          <p className="font-semibold text-sm">Gagal memuat detail perjalanan</p>
          <p className="text-xs text-red-600 mt-1">{(error as Error)?.message || 'Trip tidak ditemukan'}</p>
        </div>
        <Button onClick={() => router.navigate({ to: '/' })} className="bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold rounded-xl">
          Kembali ke Beranda
        </Button>
      </div>
    )
  }

  const allPhotos = trip.photos && trip.photos.length > 0 ? trip.photos : [trip.imageUrl]
  const currentPhoto = allPhotos[activePhotoIdx] || trip.imageUrl

  return (
    <div className="space-y-5 pb-24 bg-[#F7F9FC]">
      {/* 1. PHOTO GALLERY & HERO CAROUSEL */}
      <div className="relative h-72 w-full bg-[#123B5D]">
        <img
          src={currentPhoto}
          alt={trip.title}
          className="w-full h-full object-cover transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

        {/* Floating Top Header Controls */}
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
              onClick={handleToggleFavorite}
              className={`h-9 w-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all border shadow-md ${
                isFavorited 
                  ? 'bg-[#D9534F] text-white border-[#D9534F]' 
                  : 'bg-white/90 text-[#172B3A] border-white/60 hover:text-[#D9534F]'
              }`}
              aria-label="Simpan Favorit"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Thumbnail Selector Pills inside Photo */}
        {allPhotos.length > 1 && (
          <div className="absolute top-16 right-4 flex flex-col gap-1.5 z-10">
            {allPhotos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setActivePhotoIdx(i)}
                className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all shadow-sm ${
                  activePhotoIdx === i ? 'border-[#F4A340] scale-105' : 'border-white/50 opacity-75'
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Hero Badges */}
        <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-[#123B5D] text-white font-bold border-none text-xs shadow-xs">
              {trip.category}
            </Badge>
            {trip.packageType && (
              <Badge className="bg-[#2878A5] text-white border-none text-xs">
                {trip.packageType}
              </Badge>
            )}
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[#172B3A] text-xs font-bold border border-[#E7ECF0] shadow-xs">
              <Star className="w-3.5 h-3.5 fill-[#F4A340] text-[#F4A340]" />
              <span>{trip.rating.toFixed(1)}</span>
              <span className="text-[10px] text-[#7B8794]">({trip.reviewsCount} review)</span>
            </div>
          </div>
          <h1 className="text-xl font-extrabold text-white leading-snug drop-shadow-md">
            {trip.title}
          </h1>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="px-4 space-y-5">
        
        {/* 2. GENERAL INFO STATS GRID */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-3 bg-white border border-[#E7ECF0] rounded-2xl space-y-1 shadow-sm">
            <Clock className="w-4 h-4 text-[#2878A5] mx-auto" />
            <span className="text-[10px] text-[#7B8794] block">Durasi</span>
            <span className="font-bold text-[#172B3A]">{trip.duration}</span>
          </div>

          <div className="p-3 bg-white border border-[#E7ECF0] rounded-2xl space-y-1 shadow-sm">
            <Users className="w-4 h-4 text-[#F4A340] mx-auto" />
            <span className="text-[10px] text-[#7B8794] block">Peserta</span>
            <span className="font-bold text-[#172B3A]">{trip.minParticipants} - {trip.maxParticipants} Pax</span>
          </div>

          <div className="p-3 bg-white border border-[#E7ECF0] rounded-2xl space-y-1 shadow-sm">
            <Navigation className="w-4 h-4 text-[#2E9D70] mx-auto" />
            <span className="text-[10px] text-[#7B8794] block">Berangkat</span>
            <span className="font-bold text-[#172B3A] truncate block">{trip.departureCity}</span>
          </div>
        </div>

        {/* 3. VENDOR / PENYEDIA PAKET WISATA */}
        <div className="p-4 rounded-2xl bg-white border border-[#E7ECF0] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={trip.vendor.logo}
              alt={trip.vendor.name}
              className="w-12 h-12 rounded-xl object-cover border border-[#E7ECF0]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-[#172B3A]">{trip.vendor.name}</h4>
                {trip.vendor.verified && (
                  <span className="p-0.5 rounded-full bg-[#2E9D70] text-white">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#7B8794]">
                Penyedia Resmi AyoTrip • {trip.vendor.tripsHandled}+ trip ditangani
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#2878A5] font-semibold">
                <span>⭐ {trip.vendor.rating} Rating</span>
                <span>• Respon {trip.vendor.responseRate}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-[#123B5D] font-bold hover:bg-[#F7F9FC] rounded-xl">
            Profil
          </Button>
        </div>

        {/* 4. DESKRIPSI & HIGHLIGHTS */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2878A5]" /> Deskripsi Perjalanan
          </h3>
          <p className="text-xs text-[#172B3A] leading-relaxed bg-white p-4 rounded-2xl border border-[#E7ECF0] shadow-sm">
            {trip.description}
          </p>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#172B3A] uppercase tracking-wider">Highlight Wisata</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {trip.highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white p-3 rounded-xl border border-[#E7ECF0] text-[#172B3A] shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E9D70] shrink-0" />
                  <span className="text-[11px] font-medium leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. ITINERARY & JADWAL PERJALANAN (DAY BY DAY) */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-[#2878A5]" />
              Itinerary & Jadwal Perjalanan
            </h3>
            <span className="text-[10px] text-[#2878A5] font-bold bg-[#EBF3F8] px-2 py-0.5 rounded-full">
              Bisa Disesuaikan
            </span>
          </div>

          {trip.itinerary && trip.itinerary.length > 0 ? (
            <div className="space-y-3">
              {/* Day selector tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {trip.itinerary.map((dayPlan) => (
                  <button
                    key={dayPlan.day}
                    onClick={() => setActiveDay(dayPlan.day)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activeDay === dayPlan.day
                        ? 'bg-[#123B5D] text-white shadow-sm'
                        : 'bg-white text-[#7B8794] hover:text-[#172B3A] border border-[#E7ECF0]'
                    }`}
                  >
                    Hari {dayPlan.day}
                  </button>
                ))}
              </div>

              {/* Day details */}
              {trip.itinerary
                .filter((dayPlan) => dayPlan.day === activeDay)
                .map((dayPlan) => (
                  <div key={dayPlan.day} className="p-4 rounded-2xl bg-white border border-[#E7ECF0] shadow-sm space-y-3">
                    <div className="border-b border-[#E7ECF0] pb-2.5">
                      <h4 className="font-bold text-sm text-[#172B3A]">Hari {dayPlan.day}: {dayPlan.title}</h4>
                      <p className="text-xs text-[#7B8794] mt-0.5">{dayPlan.description}</p>
                    </div>

                    {/* Timeline items */}
                    <div className="space-y-3 relative pl-4 border-l-2 border-[#2878A5]/40 ml-2">
                      {dayPlan.items.map((item, idx) => (
                        <div key={idx} className="relative group space-y-1">
                          {/* Dot indicator */}
                          <div className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                            item.isHighlight 
                              ? 'bg-[#123B5D] border-white shadow-xs' 
                              : 'bg-[#7B8794] border-white'
                          }`} />

                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-mono text-[#123B5D] font-bold">{item.time}</span>
                            {item.estimatedTravel && item.estimatedTravel !== '-' && (
                              <span className="text-[10px] text-[#7B8794] bg-[#F7F9FC] px-1.5 py-0.5 rounded border border-[#E7ECF0]">
                                Waktu tempuh: {item.estimatedTravel}
                              </span>
                            )}
                          </div>

                          <p className="text-xs font-bold text-[#172B3A] leading-snug">{item.activity}</p>

                          <div className="flex items-center gap-1 text-[11px] text-[#7B8794]">
                            <MapPin className="w-3 h-3 text-[#F4A340]" />
                            <span>{item.locationName}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Extra costs if any */}
                    {dayPlan.extraCosts && dayPlan.extraCosts.length > 0 && (
                      <div className="mt-3 p-3 rounded-xl bg-[#FFF7ED] border border-[#F4A340]/30 space-y-1 text-xs">
                        <span className="text-[10px] font-bold text-[#F4A340] flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5" /> Estimasi Biaya Tambahan Hari Ini (Opsional):
                        </span>
                        {dayPlan.extraCosts.map((extra, i) => (
                          <div key={i} className="flex justify-between text-[11px] text-[#172B3A]">
                            <span>• {extra.item}</span>
                            <span className="font-bold">Rp {extra.cost.toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-4 bg-white rounded-2xl border border-[#E7ECF0] text-xs text-[#7B8794] text-center shadow-xs">
              Jadwal kegiatan fleksibel disesuaikan dengan kondisi cuaca dan preferensi peserta trip.
            </div>
          )}
        </div>

        {/* 6. TITIK KUMPUL & LOKASI KEBERANGKATAN */}
        <div className="p-4 rounded-2xl bg-white border border-[#E7ECF0] shadow-sm space-y-2.5">
          <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#F4A340]" /> Titik Kumpul Keberangkatan
          </h3>
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#172B3A]">{trip.departureLocation.title}</p>
            <p className="text-xs text-[#7B8794]">{trip.departureLocation.address}</p>
            {trip.departureLocation.notes && (
              <p className="text-[11px] text-[#123B5D] bg-[#EBF3F8] p-2.5 rounded-xl border border-[#2878A5]/20 mt-1">
                ℹ️ {trip.departureLocation.notes}
              </p>
            )}
          </div>
        </div>

        {/* 7. FASILITAS TERMASUK & TIDAK TERMASUK */}
        <div className="space-y-3 pt-1">
          <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider">
            Fasilitas Paket
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Termasuk */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-[#2E9D70]/30 space-y-2">
              <span className="font-bold text-[#2E9D70] flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#2E9D70]" /> Sudah Termasuk:
              </span>
              <ul className="space-y-1.5 text-[11px] text-[#172B3A]">
                {trip.facilitiesIncluded.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#2E9D70] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tidak Termasuk */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-[#D9534F]/30 space-y-2">
              <span className="font-bold text-[#D9534F] flex items-center gap-1.5 text-xs">
                <XCircle className="w-4 h-4 text-[#D9534F]" /> Belum Termasuk:
              </span>
              <ul className="space-y-1.5 text-[11px] text-[#172B3A]">
                {trip.facilitiesExcluded.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#D9534F] font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 8. KEBIJAKAN PEMBATALAN */}
        <div className="p-4 rounded-2xl bg-white border border-[#E7ECF0] shadow-sm space-y-2 text-xs">
          <h3 className="font-bold text-[#172B3A] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2E9D70]" /> Kebijakan Pembatalan & Pengembalian Dana
          </h3>
          <p className="text-[11px] text-[#7B8794] leading-relaxed">
            {trip.cancellationPolicy.summary}
          </p>
          <ul className="space-y-1 text-[11px] text-[#172B3A] pl-4 list-disc">
            {trip.cancellationPolicy.rules.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </div>

        {/* 9. RATING & ULASAN WISATAWAN */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#F4A340] fill-[#F4A340]" /> Ulasan Wisatawan ({trip.reviewsCount})
            </h3>
            <span className="text-xs font-bold text-[#F4A340]">{trip.rating.toFixed(1)} / 5.0</span>
          </div>

          {trip.reviews && trip.reviews.length > 0 ? (
            <div className="space-y-2.5">
              {trip.reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-2xl bg-white border border-[#E7ECF0] shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={rev.userAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold text-[#172B3A]">{rev.userName}</span>
                    </div>
                    <span className="text-[10px] text-[#7B8794]">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[#F4A340]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#F4A340]" />
                    ))}
                  </div>

                  <p className="text-xs text-[#172B3A] leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#7B8794] text-center py-4 bg-white rounded-2xl border border-[#E7ECF0]">
              Belum ada ulasan untuk trip ini. Jadilah yang pertama memberikan ulasan setelah perjalanan!
            </p>
          )}
        </div>

      </div>

      {/* 10. STICKY BOTTOM ACTION BAR (BOOKING BUTTON) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-[#E7ECF0] px-4 py-3 flex items-center justify-between travel-floating-shadow safe-area-bottom">
        <div>
          {trip.originalPrice && (
            <span className="text-[10px] text-[#7B8794] line-through block">
              Rp {trip.originalPrice.toLocaleString('id-ID')}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-[#123B5D]">
              Rp {trip.price.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-[#7B8794]">/ orang</span>
          </div>
        </div>

        <Link
          to="/booking/$tripId"
          params={{ tripId: trip.id }}
          className="flex-1 max-w-[200px]"
        >
          <Button
            className="w-full bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-black text-xs h-11 rounded-xl shadow-md transition-all"
          >
            Pesan Sekarang
          </Button>
        </Link>
      </div>
    </div>
  )
}
