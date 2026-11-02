import { useState } from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { tripApi, type Trip } from '@/services/tripService'
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
  Building2,
  Phone,
  Compass,
  AlertTriangle,
  Info,
  ChevronRight,
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
  const { data: trip, isLoading, isError, error, refetch } = useQuery({
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
      <div className="p-4 space-y-4">
        <Skeleton className="h-64 w-full rounded-2xl bg-slate-800" />
        <Skeleton className="h-6 w-3/4 bg-slate-800" />
        <Skeleton className="h-4 w-1/2 bg-slate-800" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-20 w-full rounded-xl bg-slate-800" />
          <Skeleton className="h-20 w-full rounded-xl bg-slate-800" />
        </div>
      </div>
    )
  }

  if (isError || !trip) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300">
          <p className="font-semibold text-sm">Gagal memuat detail perjalanan</p>
          <p className="text-xs text-red-400 mt-1">{(error as Error)?.message || 'Trip tidak ditemukan'}</p>
        </div>
        <Button onClick={() => router.navigate({ to: '/' })} className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold">
          Kembali ke Beranda
        </Button>
      </div>
    )
  }

  const allPhotos = trip.photos && trip.photos.length > 0 ? trip.photos : [trip.imageUrl]
  const currentPhoto = allPhotos[activePhotoIdx] || trip.imageUrl

  return (
    <div className="space-y-5 pb-20">
      {/* 1. PHOTO GALLERY & HERO CAROUSEL */}
      <div className="relative h-72 w-full bg-slate-950">
        <img
          src={currentPhoto}
          alt={trip.title}
          className="w-full h-full object-cover transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/60" />

        {/* Floating Top Header Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={() => window.history.back()}
            className="h-9 w-9 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-slate-800 transition-all border border-slate-700/60 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="h-9 w-9 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-slate-800 transition-all border border-slate-700/60 shadow-lg"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`h-9 w-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all border shadow-lg ${
                isFavorited 
                  ? 'bg-rose-500 text-white border-rose-400' 
                  : 'bg-slate-900/80 text-slate-300 border-slate-700/60 hover:text-rose-400'
              }`}
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
                className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all ${
                  activePhotoIdx === i ? 'border-emerald-400 scale-105 shadow-md' : 'border-white/40 opacity-70'
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
            <Badge className="bg-emerald-500 text-slate-950 font-bold border-none text-xs">
              {trip.category}
            </Badge>
            {trip.packageType && (
              <Badge className="bg-teal-900/90 text-teal-200 border-teal-500/40 text-xs">
                {trip.packageType}
              </Badge>
            )}
            <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded-full text-amber-400 text-xs font-bold border border-slate-700/50">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{trip.rating.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400">({trip.reviewsCount} review)</span>
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
          <div className="p-2.5 bg-slate-800/60 border border-slate-800 rounded-xl space-y-1">
            <Clock className="w-4 h-4 text-emerald-400 mx-auto" />
            <span className="text-[10px] text-slate-400 block">Durasi</span>
            <span className="font-bold text-slate-200">{trip.duration}</span>
          </div>

          <div className="p-2.5 bg-slate-800/60 border border-slate-800 rounded-xl space-y-1">
            <Users className="w-4 h-4 text-teal-400 mx-auto" />
            <span className="text-[10px] text-slate-400 block">Peserta</span>
            <span className="font-bold text-slate-200">{trip.minParticipants} - {trip.maxParticipants} Pax</span>
          </div>

          <div className="p-2.5 bg-slate-800/60 border border-slate-800 rounded-xl space-y-1">
            <Navigation className="w-4 h-4 text-cyan-400 mx-auto" />
            <span className="text-[10px] text-slate-400 block">Berangkat</span>
            <span className="font-bold text-slate-200 truncate block">{trip.departureCity}</span>
          </div>
        </div>

        {/* 3. VENDOR / PENYEDIA PAKET WISATA */}
        <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={trip.vendor.logo}
              alt={trip.vendor.name}
              className="w-12 h-12 rounded-xl object-cover border border-emerald-500/30"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white">{trip.vendor.name}</h4>
                {trip.vendor.verified && (
                  <span className="p-0.5 rounded-full bg-emerald-500 text-slate-950">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                Penyedia Resmi AyoTrip • {trip.vendor.tripsHandled}+ trip ditangani
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-emerald-400 font-semibold">
                <span>⭐ {trip.vendor.rating} Rating</span>
                <span>• Respon {trip.vendor.responseRate}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-emerald-400 hover:bg-slate-700/50">
            Profil
          </Button>
        </div>

        {/* 4. DESKRIPSI & HIGHLIGHTS */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Deskripsi Perjalanan
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-800/80">
            {trip.description}
          </p>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Highlight Wisata</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {trip.highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-800/30 p-2.5 rounded-lg border border-slate-800/60 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px] leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. ITINERARY & JADWAL PERJALANAN (DAY BY DAY) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
              Itinerary & Jadwal Perjalanan
            </h3>
            <span className="text-[10px] text-emerald-400 font-medium">Bisa Disesuaikan</span>
          </div>

          {trip.itinerary && trip.itinerary.length > 0 ? (
            <div className="space-y-3">
              {/* Day selector tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {trip.itinerary.map((dayPlan) => (
                  <button
                    key={dayPlan.day}
                    onClick={() => setActiveDay(dayPlan.day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activeDay === dayPlan.day
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
                  <div key={dayPlan.day} className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-3">
                    <div className="border-b border-slate-700/60 pb-2">
                      <h4 className="font-bold text-sm text-white">Hari {dayPlan.day}: {dayPlan.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{dayPlan.description}</p>
                    </div>

                    {/* Timeline items */}
                    <div className="space-y-3 relative pl-4 border-l-2 border-emerald-500/40 ml-2">
                      {dayPlan.items.map((item, idx) => (
                        <div key={idx} className="relative group space-y-1">
                          {/* Dot indicator */}
                          <div className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                            item.isHighlight 
                              ? 'bg-emerald-400 border-slate-900 shadow-md shadow-emerald-400/50' 
                              : 'bg-slate-700 border-slate-900'
                          }`} />

                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-mono text-emerald-300 font-bold">{item.time}</span>
                            {item.estimatedTravel && item.estimatedTravel !== '-' && (
                              <span className="text-[10px] text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded">
                                Waktu tempuh: {item.estimatedTravel}
                              </span>
                            )}
                          </div>

                          <p className="text-xs font-bold text-white leading-snug">{item.activity}</p>

                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>{item.locationName}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Extra costs if any */}
                    {dayPlan.extraCosts && dayPlan.extraCosts.length > 0 && (
                      <div className="mt-3 p-2.5 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1 text-xs">
                        <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5" /> Estimasi Biaya Tambahan Hari Ini (Opsional):
                        </span>
                        {dayPlan.extraCosts.map((extra, i) => (
                          <div key={i} className="flex justify-between text-[11px] text-amber-200/90">
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
            <div className="p-4 bg-slate-800/30 rounded-xl text-xs text-slate-400 text-center">
              Jadwal kegiatan fleksibel disesuaikan dengan kondisi cuaca dan preferensi peserta trip.
            </div>
          )}
        </div>

        {/* 6. TITIK KUMPUL & LOKASI KEBERANGKATAN */}
        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" /> Titik Kumpul Keberangkatan
          </h3>
          <div className="space-y-1">
            <p className="text-xs font-bold text-white">{trip.departureLocation.title}</p>
            <p className="text-xs text-slate-300">{trip.departureLocation.address}</p>
            {trip.departureLocation.notes && (
              <p className="text-[11px] text-emerald-400 bg-emerald-950/30 p-2 rounded-lg border border-emerald-800/40 mt-1">
                ℹ️ {trip.departureLocation.notes}
              </p>
            )}
          </div>
        </div>

        {/* 7. FASILITAS TERMASUK & TIDAK TERMASUK */}
        <div className="space-y-3 pt-1">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Fasilitas Paket
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Termasuk */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sudah Termasuk:
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-200">
                {trip.facilitiesIncluded.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tidak Termasuk */}
            <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-2">
              <span className="font-bold text-rose-300 flex items-center gap-1.5 text-xs">
                <XCircle className="w-4 h-4 text-rose-400" /> Belum Termasuk:
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-200">
                {trip.facilitiesExcluded.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 8. KEBIJAKAN PEMBATALAN */}
        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2 text-xs">
          <h3 className="font-bold text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Kebijakan Pembatalan & Pengembalian Dana
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {trip.cancellationPolicy.summary}
          </p>
          <ul className="space-y-1 text-[11px] text-slate-300 pl-4 list-disc">
            {trip.cancellationPolicy.rules.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </div>

        {/* 9. RATING & ULASAN WISATAWAN */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Ulasan Wisatawan ({trip.reviewsCount})
            </h3>
            <span className="text-xs font-bold text-amber-400">{trip.rating.toFixed(1)} / 5.0</span>
          </div>

          {trip.reviews && trip.reviews.length > 0 ? (
            <div className="space-y-2.5">
              {trip.reviews.map((rev) => (
                <div key={rev.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={rev.userAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold text-white">{rev.userName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-3 bg-slate-800/30 rounded-xl">
              Belum ada ulasan untuk trip ini. Jadilah yang pertama memberikan ulasan setelah perjalanan!
            </p>
          )}
        </div>

      </div>

      {/* 10. STICKY BOTTOM ACTION BAR (BOOKING BUTTON) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-4 py-3 flex items-center justify-between shadow-2xl safe-area-bottom">
        <div>
          {trip.originalPrice && (
            <span className="text-[10px] text-slate-500 line-through block">
              Rp {trip.originalPrice.toLocaleString('id-ID')}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-emerald-400">
              Rp {trip.price.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-slate-400">/ orang</span>
          </div>
        </div>

        <Link
          to="/booking/$tripId"
          params={{ tripId: trip.id }}
          className="flex-1 max-w-[200px]"
        >
          <Button
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs h-11 rounded-xl shadow-lg shadow-emerald-500/25"
          >
            Pesan Sekarang
          </Button>
        </Link>
      </div>
    </div>
  )
}
