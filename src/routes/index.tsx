import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { tripApi } from '@/services/tripService'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, MapPin, Star, Clock, Sparkles, AlertCircle, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const CATEGORIES = ['All', 'Beach', 'Mountain', 'Adventure', 'Culture']

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')

  // TanStack Query integration
  const { data: trips, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['trips', selectedCategory, search],
    queryFn: () => tripApi.getTrips(selectedCategory, search),
  })

  return (
    <div className="p-4 space-y-5">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white shadow-xl">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[12px] font-semibold text-emerald-100">
            <Sparkles className="w-3.5 h-3.5" />
            Promo Liburan Eksotis
          </div>
          <h2 className="text-xl font-bold leading-tight">
            Jelajahi Surga Wisata Terbaik Indonesia
          </h2>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Dari Labuan Bajo sampai Raja Ampat, pesan trip impianmu dengan mudah di AyoTrip Mobile.
          </p>
        </div>
        {/* Abstract decorative circles */}
        <div className="absolute -right-6 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Cari destinasi, kota, atau nama trip..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-emerald-500 rounded-xl text-sm"
        />
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Content Header & Refresh Indicator */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">
            Destinasi Populer
          </h3>
          <p className="text-[11px] text-slate-400">
            Dikelola via TanStack Query & Router
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-xs text-slate-400 hover:text-emerald-400 h-8 px-2 gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-emerald-400' : ''}`} />
          {isFetching ? 'Memuat...' : 'Refresh'}
        </Button>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 bg-slate-800/60 rounded-xl space-y-3 border border-slate-700/60">
              <Skeleton className="h-44 w-full rounded-lg bg-slate-700/60" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-slate-700/60" />
                <Skeleton className="h-3 w-1/2 bg-slate-700/60" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-xs font-semibold">Gagal memuat data perjalanan</p>
          <p className="text-[11px] text-red-300/80">{(error as Error)?.message || 'Terjadi kesalahan sistem'}</p>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="text-xs mt-2 border-red-700 text-red-200 hover:bg-red-900/40">
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Trips List */}
      {!isLoading && !isError && (
        <>
          {trips && trips.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {trips.map((trip) => (
                <Link
                  key={trip.id}
                  to="/trips/$tripId"
                  params={{ tripId: trip.id }}
                  className="block group transition-transform active:scale-[0.98]"
                >
                  <Card className="overflow-hidden border-slate-800 bg-slate-800/50 hover:border-slate-700 transition-all shadow-md group-hover:shadow-emerald-950/20">
                    <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                      <img
                        src={trip.imageUrl}
                        alt={trip.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <Badge className="bg-slate-900/80 backdrop-blur-md text-emerald-400 border-none text-[11px] font-semibold">
                          {trip.category}
                        </Badge>
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-full text-amber-400 text-xs font-bold shadow">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{trip.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-400">({trip.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Bottom Info inside image */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
                        <div className="flex items-center gap-1 text-[11px] text-slate-200">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{trip.destination}, {trip.province}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-300 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          <span>{trip.duration}</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-3.5 space-y-2">
                      <h4 className="font-bold text-white text-base leading-snug group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {trip.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {trip.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Mulai dari</span>
                          <span className="text-base font-extrabold text-emerald-400">
                            Rp {trip.price.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs h-8 px-3 rounded-lg">
                          Lihat Detail
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-800 space-y-3">
              <p className="text-sm text-slate-300 font-medium">Tidak ada trip yang sesuai kriteria.</p>
              <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau kategori filter.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory('All')
                  setSearch('')
                }}
                className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Reset Filter
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

