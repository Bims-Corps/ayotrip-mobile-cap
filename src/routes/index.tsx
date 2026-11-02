import { useState, useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { 
  tripApi, 
  type Trip, 
  type PromoBanner, 
  type Destination, 
  type CategoryInfo 
} from '@/services/tripService'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet'
import { toast } from 'sonner'
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Tag, 
  Copy, 
  Check, 
  Flame, 
  SlidersHorizontal, 
  ChevronRight, 
  Trees, 
  Palmtree, 
  Mountain, 
  Landmark, 
  Fish, 
  Compass, 
  ShieldCheck, 
  Navigation, 
  X, 
  TicketPercent, 
  Zap, 
  TrendingUp, 
  CheckCircle2,
  Users
} from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

// Quick search chips suggestions
const SEARCH_SUGGESTIONS = [
  'Labuan Bajo',
  'Bromo Sunrise',
  'Nusa Penida',
  'Raja Ampat',
  'Jogja Heritage',
  'Trip Dekat',
]

function getCategoryIcon(iconName: string) {
  switch (iconName) {
    case 'Trees':
      return <Trees className="w-5 h-5 text-emerald-400" />
    case 'Palmtree':
      return <Palmtree className="w-5 h-5 text-teal-400" />
    case 'Mountain':
      return <Mountain className="w-5 h-5 text-amber-400" />
    case 'Landmark':
      return <Landmark className="w-5 h-5 text-rose-400" />
    case 'Fish':
      return <Fish className="w-5 h-5 text-cyan-400" />
    default:
      return <Sparkles className="w-5 h-5 text-emerald-400" />
  }
}

function HomePage() {
  // Search & Filter States
  const [search, setSearch] = useState('')
  const [searchScope, setSearchScope] = useState<'all' | 'destinasi' | 'paket'>('all')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [destinationMode, setDestinationMode] = useState<'popular' | 'nearby'>('popular')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [copiedPromoId, setCopiedPromoId] = useState<string | null>(null)

  // Advanced Filters
  const [selectedPackageType, setSelectedPackageType] = useState<string>('All')
  const [maxBudget, setMaxBudget] = useState<number | undefined>(undefined)

  // 1. TanStack Query: Promos & Discounts
  const { data: promos = [], isLoading: isLoadingPromos } = useQuery({
    queryKey: ['promos'],
    queryFn: tripApi.getPromos,
  })

  // 2. TanStack Query: Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: tripApi.getCategories,
  })

  // 3. TanStack Query: Destinations (Popular vs Nearby)
  const { data: destinations = [], isLoading: isLoadingDestinations } = useQuery({
    queryKey: ['destinations', destinationMode],
    queryFn: () => tripApi.getDestinations(destinationMode),
  })

  // 4. TanStack Query: Recommended Packages
  const { data: recommendedPackages = [], isLoading: isLoadingRecommended } = useQuery({
    queryKey: ['recommendedPackages'],
    queryFn: tripApi.getRecommendedPackages,
  })

  // 5. TanStack Query: Trending Packages
  const { data: trendingPackages = [], isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trendingPackages'],
    queryFn: tripApi.getTrendingPackages,
  })

  // 6. TanStack Query: Main Trips Query (Filtered by Search, Category, and Budget)
  const { 
    data: allTrips = [], 
    isLoading: isLoadingTrips, 
    isError, 
    error, 
    refetch, 
    isFetching 
  } = useQuery({
    queryKey: ['trips', selectedCategory, search, selectedPackageType, maxBudget],
    queryFn: () => tripApi.getTrips(selectedCategory, search, {
      packageType: selectedPackageType,
      maxPrice: maxBudget,
    }),
  })

  // Copy promo voucher to clipboard
  const handleCopyPromo = (promo: PromoBanner) => {
    navigator.clipboard.writeText(promo.promoCode)
    setCopiedPromoId(promo.id)
    toast.success(`Kupon "${promo.promoCode}" berhasil disalin!`, {
      description: `Gunakan kupon ini saat checkout untuk mendapatkan ${promo.discount}.`,
    })
    setTimeout(() => {
      setCopiedPromoId(null)
    }, 2500)
  }

  // Active filter count check
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (selectedCategory !== 'All') count++
    if (selectedPackageType !== 'All') count++
    if (maxBudget) count++
    return count
  }, [selectedCategory, selectedPackageType, maxBudget])

  const resetAllFilters = () => {
    setSearch('')
    setSelectedCategory('All')
    setSelectedPackageType('All')
    setMaxBudget(undefined)
    toast.info('Filter pencarian telah di-reset')
  }

  const isFilteringOrSearching = search.trim().length > 0 || selectedCategory !== 'All' || selectedPackageType !== 'All' || !!maxBudget

  return (
    <div className="p-4 space-y-6">
      
      {/* 1. TOP LOCATION & GPS RADIAL HEADER */}
      <div className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/60 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <div className="h-7 w-7 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Navigation className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400">Lokasi Kamu Sekarang</p>
            <p className="font-semibold text-slate-200">DKI Jakarta & Sekitarnya (GPS Aktif)</p>
          </div>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Promo Aktif
        </Badge>
      </div>

      {/* 2. SEARCH BOX (DESTINASI & PAKET WISATA) */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Cari destinasi wisata, kota, atau paket trip..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-9 bg-slate-800/90 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-emerald-500 rounded-xl text-xs h-10 shadow-sm"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Sheet Trigger Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFilterOpen(true)}
            className={`h-10 w-10 shrink-0 rounded-xl border border-slate-700 bg-slate-800/90 text-slate-200 hover:bg-slate-700 relative ${
              activeFiltersCount > 0 ? 'border-emerald-500 text-emerald-400' : ''
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-bold rounded-full text-[9px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {/* Search Scope Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 mr-1">Cari:</span>
          {(['all', 'destinasi', 'paket'] as const).map((scope) => {
            const labelMap = { all: 'Semua', destinasi: 'Destinasi', paket: 'Paket Wisata' }
            const isActive = searchScope === scope
            return (
              <button
                key={scope}
                onClick={() => setSearchScope(scope)}
                className={`text-[11px] px-2.5 py-0.5 rounded-full transition-all font-medium ${
                  isActive 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {labelMap[scope]}
              </button>
            )
          })}
        </div>

        {/* Quick Search Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          {SEARCH_SUGGESTIONS.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                if (tag === 'Trip Dekat') {
                  setDestinationMode('nearby')
                  setSearch('dekat')
                } else {
                  setSearch(tag)
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50 text-[11px] whitespace-nowrap transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* 3. BANNER PROMO ATAU DISKON */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TicketPercent className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">Promo & Diskon Terbatas</h3>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">Geser untuk melihat ➔</span>
        </div>

        {isLoadingPromos ? (
          <Skeleton className="h-36 w-full rounded-2xl bg-slate-800" />
        ) : (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
            {promos.map((promo) => (
              <div
                key={promo.id}
                className={`snap-center shrink-0 w-[310px] rounded-2xl overflow-hidden p-4 text-white relative shadow-lg bg-gradient-to-r ${promo.gradient} border border-white/10`}
              >
                {/* Background photo blend */}
                <img 
                  src={promo.imageUrl} 
                  alt={promo.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none"
                />

                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-extrabold text-amber-300 tracking-wider">
                      <Zap className="w-3 h-3 fill-amber-300" />
                      {promo.tag}
                    </span>
                    <Badge className="bg-white/20 backdrop-blur-md text-white font-extrabold text-[10px] border-none">
                      {promo.discount}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm leading-snug line-clamp-1">{promo.title}</h4>
                    <p className="text-[11px] text-white/90 line-clamp-1 mt-0.5">{promo.subtitle}</p>
                  </div>

                  {/* Promo code copy bar */}
                  <div className="pt-1 flex items-center justify-between bg-black/35 backdrop-blur-md p-1.5 rounded-xl border border-white/15">
                    <div className="pl-2">
                      <span className="text-[9px] uppercase tracking-wider text-slate-300 block">Kode Kupon</span>
                      <span className="font-mono font-bold text-xs text-amber-300 tracking-wider">
                        {promo.promoCode}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleCopyPromo(promo)}
                      className="h-7 px-2.5 text-[10px] font-bold bg-white text-slate-950 hover:bg-slate-200 rounded-lg gap-1"
                    >
                      {copiedPromoId === promo.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Salin
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-[9px] text-white/70 text-right">
                    Berlaku s/d {promo.validUntil}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. KATEGORI WISATA (ALAM, PANTAI, GUNUNG, BUDAYA, BAHARI) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">Kategori Wisata</h3>
          </div>
          {selectedCategory !== 'All' && (
            <button 
              onClick={() => setSelectedCategory('All')} 
              className="text-[11px] text-emerald-400 hover:underline"
            >
              Reset ke Semua
            </button>
          )}
        </div>

        {/* Visual Category Icons */}
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase() || (cat.id === 'All' && selectedCategory === 'All')
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center relative ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500 shadow-md shadow-emerald-500/10 text-white'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${
                  isSelected ? 'bg-emerald-500/20 text-emerald-300 scale-110' : 'bg-slate-800 text-slate-300'
                }`}>
                  {getCategoryIcon(cat.icon)}
                </div>

                <div>
                  <span className={`text-xs block font-bold leading-tight ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {cat.name}
                  </span>
                  <span className="text-[9px] text-slate-400 block line-clamp-1 mt-0.5">
                    {cat.badgeText}
                  </span>
                </div>

                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* 5. DESTINASI TERPOPULER ATAU TERDEKAT */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">Destinasi Wisata</h3>
          </div>

          {/* Toggle Terpopuler vs Terdekat */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setDestinationMode('popular')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                destinationMode === 'popular'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔥 Terpopuler
            </button>
            <button
              onClick={() => setDestinationMode('nearby')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                destinationMode === 'nearby'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📍 Terdekat
            </button>
          </div>
        </div>

        {isLoadingDestinations ? (
          <div className="flex gap-3 overflow-hidden">
            <Skeleton className="h-44 w-48 rounded-xl bg-slate-800 shrink-0" />
            <Skeleton className="h-44 w-48 rounded-xl bg-slate-800 shrink-0" />
          </div>
        ) : (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {destinations.map((dest) => (
              <Link
                key={dest.id}
                to="/trips/$tripId"
                params={{ tripId: dest.linkedTripId }}
                className="shrink-0 w-44 group block"
              >
                <div className="rounded-xl overflow-hidden bg-slate-800/60 border border-slate-700/70 hover:border-emerald-500/60 transition-all shadow-md group-hover:shadow-emerald-950/20">
                  <div className="relative h-28 w-full overflow-hidden bg-slate-900">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Tag Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-[9px] font-extrabold text-emerald-300">
                        {dest.tag}
                      </span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center gap-0.5 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-amber-400 text-[10px] font-bold">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        <span>{dest.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-1.5 left-2 right-2">
                      <p className="text-[10px] text-slate-300 flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                        <span className="truncate">{dest.city}, {dest.province}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 space-y-1">
                    <h5 className="font-bold text-xs text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {dest.name}
                    </h5>
                    <div className="flex items-baseline justify-between pt-1 border-t border-slate-700/50">
                      <div>
                        <span className="text-[9px] text-slate-400 block">Mulai</span>
                        <span className="text-[11px] font-extrabold text-emerald-400">
                          Rp {(dest.startingPrice / 1000).toLocaleString('id-ID')}rb
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {dest.tripCount} Paket
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 6. PAKET WISATA YANG SEDANG NGETREN */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Sedang Ngetren Minggu Ini</h3>
              <p className="text-[10px] text-slate-400">Banyak dipesan oleh wisatawan AyoTrip</p>
            </div>
          </div>
          <span className="text-[11px] text-orange-400 font-semibold bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
            Hot Deals 🔥
          </span>
        </div>

        {isLoadingTrending ? (
          <Skeleton className="h-44 w-full rounded-2xl bg-slate-800" />
        ) : (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {trendingPackages.map((trip, idx) => (
              <Link
                key={trip.id}
                to="/trips/$tripId"
                params={{ tripId: trip.id }}
                className="shrink-0 w-64 group block"
              >
                <Card className="overflow-hidden border-slate-700/80 bg-slate-800/60 hover:border-orange-500/60 transition-all shadow-md">
                  <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                    <img
                      src={trip.imageUrl}
                      alt={trip.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-orange-500 text-slate-950 font-black text-[9px] uppercase tracking-wider">
                        Trending #{idx + 1}
                      </span>
                      {trip.slotsLeft && trip.slotsLeft <= 4 && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-600/90 text-white font-bold text-[9px]">
                          Sisa {trip.slotsLeft} Slot!
                        </span>
                      )}
                    </div>

                    {trip.discountPercent && (
                      <div className="absolute top-2 right-2">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-extrabold text-[10px]">
                          -{trip.discountPercent}%
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-orange-400" />
                        {trip.destination}
                      </span>
                      <span className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                        <Clock className="w-2.5 h-2.5 text-orange-400" />
                        {trip.duration}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-3 space-y-1.5">
                    <h5 className="font-bold text-xs text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
                      {trip.title}
                    </h5>

                    {/* Social proof indicator */}
                    <div className="flex items-center gap-1 text-[10px] text-amber-300/90">
                      <Users className="w-3 h-3" />
                      <span>{trip.viewersCount || 89} orang melihat hari ini</span>
                    </div>

                    <div className="pt-1.5 flex items-end justify-between border-t border-slate-700/60">
                      <div>
                        {trip.originalPrice && (
                          <span className="text-[10px] text-slate-500 line-through block">
                            Rp {trip.originalPrice.toLocaleString('id-ID')}
                          </span>
                        )}
                        <span className="text-xs font-black text-orange-400">
                          Rp {trip.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <Button size="sm" className="h-6 px-2 text-[10px] bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-md">
                        Detail
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 7. REKOMENDASI PAKET WISATA */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Rekomendasi Paket Wisata</h3>
              <p className="text-[10px] text-slate-400">Paket terkurasi dengan fasilitas lengkap & guide profesional</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs text-slate-400 hover:text-emerald-400 h-8 px-2 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-emerald-400' : ''}`} />
          </Button>
        </div>

        {/* Loading Skeletons */}
        {isLoadingTrips && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-3 bg-slate-800/60 rounded-xl space-y-3 border border-slate-700/60">
                <Skeleton className="h-40 w-full rounded-lg bg-slate-700/60" />
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
            <p className="text-xs font-semibold">Gagal memuat data paket wisata</p>
            <p className="text-[11px] text-red-300/80">{(error as Error)?.message || 'Terjadi kesalahan sistem'}</p>
            <Button size="sm" variant="outline" onClick={() => refetch()} className="text-xs mt-2 border-red-700 text-red-200 hover:bg-red-900/40">
              Coba Lagi
            </Button>
          </div>
        )}

        {/* Paket Wisata List */}
        {!isLoadingTrips && !isError && (
          <div className="space-y-4">
            {allTrips && allTrips.length > 0 ? (
              allTrips.map((trip) => (
                <Link
                  key={trip.id}
                  to="/trips/$tripId"
                  params={{ tripId: trip.id }}
                  className="block group transition-transform active:scale-[0.99]"
                >
                  <Card className="overflow-hidden border-slate-800 bg-slate-800/50 hover:border-emerald-500/40 transition-all shadow-md group-hover:shadow-emerald-950/20">
                    <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                      <img
                        src={trip.imageUrl}
                        alt={trip.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                        {trip.isRecommended && (
                          <Badge className="bg-emerald-500 text-slate-950 font-extrabold text-[10px] border-none shadow">
                            ⭐ Pilihan AyoTrip
                          </Badge>
                        )}
                        <Badge className="bg-slate-900/80 backdrop-blur-md text-emerald-300 border-slate-700 text-[10px]">
                          {trip.category}
                        </Badge>
                        {trip.packageType && (
                          <Badge className="bg-teal-950/80 text-teal-300 border-teal-700/60 text-[10px]">
                            {trip.packageType}
                          </Badge>
                        )}
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-full text-amber-400 text-xs font-bold shadow border border-slate-700/50">
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
                        <div className="flex items-center gap-1 text-[11px] text-slate-300 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          <span>{trip.duration}</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-3.5 space-y-2.5">
                      <div>
                        <h4 className="font-bold text-white text-base leading-snug group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {trip.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-1">
                          {trip.description}
                        </p>
                      </div>

                      {/* Facilities Mini Badges */}
                      {trip.facilities && trip.facilities.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          {trip.facilities.slice(0, 3).map((f, i) => (
                            <span 
                              key={i} 
                              className="text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700/60 flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                              {f}
                            </span>
                          ))}
                          {trip.facilities.length > 3 && (
                            <span className="text-[10px] text-slate-400">+{trip.facilities.length - 3} lagi</span>
                          )}
                        </div>
                      )}

                      {/* Pricing and Action */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                        <div>
                          {trip.originalPrice && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-500 line-through">
                                Rp {trip.originalPrice.toLocaleString('id-ID')}
                              </span>
                              {trip.discountPercent && (
                                <span className="text-[10px] font-bold text-emerald-400">
                                  Hemat {trip.discountPercent}%
                                </span>
                              )}
                            </div>
                          )}
                          <div className="flex items-baseline gap-1">
                            <span className="text-base font-black text-emerald-400">
                              Rp {trip.price.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] text-slate-400">/ orang</span>
                          </div>
                        </div>

                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs h-8 px-3 rounded-lg shadow-md shadow-emerald-500/20">
                          Pesan Paket
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-800 space-y-3">
                <Compass className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="text-sm text-slate-200 font-semibold">Tidak ada paket wisata yang cocok.</p>
                <p className="text-xs text-slate-400">
                  Coba ubah kata kunci pencarian, kategori, atau filter anggaran Anda.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetAllFilters}
                  className="text-xs border-slate-700 text-emerald-400 hover:bg-slate-800"
                >
                  Reset Semua Filter
                </Button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 8. BOTTOM SHEET ADVANCED FILTER */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="bottom" className="bg-slate-900 border-t border-slate-800 text-slate-100 max-w-md mx-auto rounded-t-3xl max-h-[85vh] overflow-y-auto">
          <SheetHeader className="pb-2 border-b border-slate-800">
            <SheetTitle className="text-base font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              Filter Pencarian Wisata
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-400">
              Sesuaikan preferensi jenis paket dan anggaran liburan Anda.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-3">
            {/* Package Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 block">Tipe Paket Wisata</label>
              <div className="grid grid-cols-2 gap-2">
                {['All', 'Open Trip', 'Private Trip', 'Family Trip'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedPackageType(type)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      selectedPackageType === type
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-800/70 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {type === 'All' ? 'Semua Tipe' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Maximum Budget */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 block">Maksimal Anggaran (IDR)</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Semua Anggaran', val: undefined },
                  { label: '< Rp 1.500.000', val: 1500000 },
                  { label: '< Rp 3.000.000', val: 3000000 },
                  { label: '< Rp 5.000.000', val: 5000000 },
                ].map((budget, i) => (
                  <button
                    key={i}
                    onClick={() => setMaxBudget(budget.val)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      maxBudget === budget.val
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-800/70 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {budget.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="flex flex-row items-center gap-2 pt-3 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={resetAllFilters}
              className="flex-1 text-xs border-slate-700 text-slate-300 hover:bg-slate-800 h-10 rounded-xl"
            >
              Reset
            </Button>
            <SheetClose asChild>
              <Button
                size="sm"
                className="flex-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold h-10 rounded-xl shadow-lg shadow-emerald-500/20"
              >
                Terapkan Filter
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

    </div>
  )
}
