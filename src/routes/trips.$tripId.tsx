import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { tripApi } from '@/services/tripService'
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
  Share2, 
  Heart, 
  ShieldCheck, 
  CalendarDays,
  Sparkles
} from 'lucide-react'

export const Route = createFileRoute('/trips/$tripId')({
  component: TripDetailPage,
})

function TripDetailPage() {
  const { tripId } = Route.useParams()
  const router = useRouter()

  // TanStack Query for dynamic trip details
  const { data: trip, isLoading, isError, error } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripApi.getTripById(tripId),
  })

  const handleBooking = () => {
    toast.success(`Berhasil memesan: ${trip?.title}!`, {
      description: 'Konfirmasi pemesanan dan e-ticket telah dikirim ke notifikasi.',
    })
  }

  const handleShare = () => {
    toast.info('Tautan trip disalin ke clipboard!')
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

  return (
    <div className="space-y-4">
      {/* Top Banner & Navigation */}
      <div className="relative h-72 w-full bg-slate-950">
        <img
          src={trip.imageUrl}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/60" />

        {/* Floating Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <Link
            to="/"
            className="h-10 w-10 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-slate-800 transition-all border border-slate-700/60 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="h-10 w-10 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-slate-800 transition-all border border-slate-700/60 shadow-lg"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toast.success('Disimpan ke Wishlist!')}
              className="h-10 w-10 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-rose-400 hover:bg-slate-800 transition-all border border-slate-700/60 shadow-lg"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Badges */}
        <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500 text-slate-950 font-bold border-none text-xs">
              {trip.category}
            </Badge>
            <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-full text-amber-400 text-xs font-bold border border-slate-700/50">
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
      <div className="px-4 space-y-5 pb-6">
        {/* Quick Highlights Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-slate-800/60 border border-slate-800 rounded-xl flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Lokasi</span>
              <span className="text-xs font-bold text-slate-200">{trip.destination}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 border border-slate-800 rounded-xl flex items-center gap-2.5">
            <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Durasi</span>
              <span className="text-xs font-bold text-slate-200">{trip.duration}</span>
            </div>
          </div>
        </div>

        {/* Overview Description */}
        <div className="space-y-2 bg-slate-800/40 p-3.5 rounded-xl border border-slate-800/80">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Deskripsi Perjalanan
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {trip.description}
          </p>
        </div>

        {/* Highlights List */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Highlight Aktivitas
          </h3>
          <div className="space-y-2">
            {trip.highlights.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 text-xs text-slate-200 bg-slate-800/30 p-2.5 rounded-lg border border-slate-800/60"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AyoTrip Guarantee Badge */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-emerald-200 text-xs">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-[11px] text-emerald-300">Garansi AyoTrip Verified</p>
            <p className="text-[10px] text-emerald-400/80">Guide berlisensi resmi, asuransi perjalanan, dan armada berstandar nasional.</p>
          </div>
        </div>

        {/* Bottom Booking Action Bar */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800 gap-3">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Total Biaya</span>
            <span className="text-lg font-black text-emerald-400 leading-none">
              Rp {trip.price.toLocaleString('id-ID')}
            </span>
          </div>

          <Button
            onClick={handleBooking}
            className="flex-1 max-w-[200px] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-xs h-11 rounded-xl shadow-lg shadow-emerald-500/20"
          >
            Pesan Sekarang
          </Button>
        </div>
      </div>
    </div>
  )
}

