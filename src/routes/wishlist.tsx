import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { tripApi } from '@/services/tripService'
import { wishlistService } from '@/services/wishlistService'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Heart, Trash2, MapPin, Clock, Star, Sparkles, Compass } from 'lucide-react'

export const Route = createFileRoute('/wishlist')({
  component: WishlistPage,
})

function WishlistPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  const loadFavorites = () => {
    setFavoriteIds(wishlistService.getWishlist())
  }

  useEffect(() => {
    loadFavorites()
    window.addEventListener('ayotrip_wishlist_updated', loadFavorites)
    return () => window.removeEventListener('ayotrip_wishlist_updated', loadFavorites)
  }, [])

  // Fetch all trips to match favorited IDs
  const { data: allTrips = [], isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: () => tripApi.getTrips(),
  })

  const favoriteTrips = allTrips.filter((t) => favoriteIds.includes(t.id))

  const handleRemove = (tripId: string, title: string) => {
    wishlistService.toggleWishlist(tripId)
    loadFavorites()
    toast.info(`"${title}" dihapus dari favorit.`)
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="space-y-1">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          Paket Wisata Favorit
        </h1>
        <p className="text-xs text-slate-400">
          Daftar paket liburan impian yang Anda simpan ({favoriteTrips.length} tersimpan).
        </p>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400">Memuat paket favorit...</div>
      ) : favoriteTrips.length > 0 ? (
        <div className="space-y-3">
          {favoriteTrips.map((trip) => (
            <Card key={trip.id} className="bg-slate-800/50 border-slate-700/80 text-white overflow-hidden shadow-md">
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-36 sm:w-36 shrink-0 bg-slate-900">
                  <img
                    src={trip.imageUrl}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-slate-900/80 backdrop-blur-md text-emerald-400 text-[9px]">
                      {trip.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" /> {trip.destination}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold">
                        <Star className="w-3 h-3 fill-amber-400" /> {trip.rating.toFixed(1)}
                      </div>
                    </div>

                    <h3 className="font-bold text-xs text-white line-clamp-1">{trip.title}</h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-teal-400" /> Durasi: {trip.duration}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                    <span className="text-xs font-bold text-emerald-400">
                      Rp {trip.price.toLocaleString('id-ID')}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleRemove(trip.id, trip.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Hapus dari favorit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link to="/trips/$tripId" params={{ tripId: trip.id }}>
                        <Button size="sm" className="h-7 px-3 text-[11px] bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg">
                          Pesan
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-800 space-y-3">
          <Heart className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-sm font-bold text-slate-200">Belum Ada Favorit</h4>
          <p className="text-xs text-slate-400">
            Jelajahi paket wisata nusantara dan ketuk ikon hati pada paket yang Anda sukai!
          </p>
          <Link to="/search">
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs mt-2">
              Cari Wisata
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

