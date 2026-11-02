import { useState, useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { 
  tripApi, 
  type PromoBanner 
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
  Navigation, 
  X, 
  TicketPercent, 
  Zap, 
  CheckCircle2,
  Users,
  Radio
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
      return <Trees className="w-5 h-5 text-[#2E9D70]" />
    case 'Palmtree':
      return <Palmtree className="w-5 h-5 text-[#2878A5]" />
    case 'Mountain':
      return <Mountain className="w-5 h-5 text-[#F4A340]" />
    case 'Landmark':
      return <Landmark className="w-5 h-5 text-[#D9534F]" />
    case 'Fish':
      return <Fish className="w-5 h-5 text-[#2878A5]" />
    default:
      return <Sparkles className="w-5 h-5 text-[#123B5D]" />
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

  // 4. TanStack Query: Trending Packages
  const { data: trendingPackages = [], isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trendingPackages'],
    queryFn: tripApi.getTrendingPackages,
  })

  // 5. TanStack Query: Main Trips Query (Filtered by Search, Category, and Budget)
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

  return (
    <div className="p-4 space-y-6 bg-[#F7F9FC]">
      
      {/* 1. TOP LOCATION & GPS HEADER */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#E7ECF0] shadow-sm text-xs">
        <div className="flex items-center gap-2.5 text-[#172B3A]">
          <div className="h-8 w-8 rounded-xl bg-[#EBF3F8] flex items-center justify-center text-[#123B5D]">
            <Navigation className="w-4 h-4 text-[#2878A5]" />
          </div>
          <div>
            <p className="text-[10px] text-[#7B8794]">Lokasi Kamu Sekarang</p>
            <p className="font-bold text-[#172B3A]">DKI Jakarta & Sekitarnya (GPS Aktif)</p>
          </div>
        </div>
        <Badge className="bg-[#FFF7ED] text-[#F4A340] border border-[#F4A340]/30 text-[10px] font-bold gap-1 px-2 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F4A340] animate-pulse" />
          Promo Aktif
        </Badge>
      </div>

      {/* 2. SEARCH BOX (DESTINASI & PAKET WISATA) */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8794]" />
            <Input
              placeholder="Cari destinasi wisata, kota, atau paket trip..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-9 bg-white border-[#E7ECF0] text-[#172B3A] placeholder:text-[#7B8794] focus-visible:ring-[#123B5D] rounded-xl text-xs h-11 shadow-sm"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B8794] hover:text-[#172B3A]"
                aria-label="Hapus pencarian"
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
            className={`h-11 w-11 shrink-0 rounded-xl border border-[#E7ECF0] bg-white text-[#172B3A] hover:bg-[#F7F9FC] shadow-sm relative ${
              activeFiltersCount > 0 ? 'border-[#123B5D] text-[#123B5D]' : ''
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F4A340] text-slate-950 font-bold rounded-full text-[9px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {/* Search Scope Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#7B8794] mr-1">Cari:</span>
          {(['all', 'destinasi', 'paket'] as const).map((scope) => {
            const labelMap = { all: 'Semua', destinasi: 'Destinasi', paket: 'Paket Wisata' }
            const isActive = searchScope === scope
            return (
              <button
                key={scope}
                onClick={() => setSearchScope(scope)}
                className={`text-[11px] px-3 py-1 rounded-full transition-all font-medium ${
                  isActive 
                    ? 'bg-[#123B5D] text-white shadow-sm font-semibold' 
                    : 'bg-white text-[#7B8794] hover:text-[#172B3A] border border-[#E7ECF0]'
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
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#EBF3F8] text-[#172B3A] border border-[#E7ECF0] text-[11px] whitespace-nowrap transition-colors shadow-xs"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* EVENT & TOURING SHORTCUT BANNER */}
      <Link to="/events" className="block group">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#123B5D] via-[#1A4E78] to-[#2878A5] border border-[#2878A5]/30 hover:border-[#F4A340]/60 transition-all shadow-md flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/15 text-[#F4A340] flex items-center justify-center shrink-0 border border-white/20 group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5 animate-pulse text-[#F4A340]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-white">Event Touring & Komunitas</span>
                <span className="px-1.5 py-0.5 rounded bg-[#F4A340] text-slate-950 font-black text-[9px] uppercase tracking-wider">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-white/85 line-clamp-1">
                Open Trip Touring Bandung - Yogyakarta & event on-air lainnya
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white/80 shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </Link>

      {/* 3. BANNER PROMO ATAU DISKON */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TicketPercent className="w-4 h-4 text-[#F4A340]" />
            <h3 className="text-sm font-bold text-[#172B3A] tracking-tight">Promo & Diskon Terbatas</h3>
          </div>
          <span className="text-[11px] text-[#2878A5] font-semibold">Geser promo ➔</span>
        </div>

        {isLoadingPromos ? (
          <Skeleton className="h-36 w-full rounded-2xl bg-[#E7ECF0]" />
        ) : (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
            {promos.map((promo) => (
              <div
                key={promo.id}
                className={`snap-center shrink-0 w-[310px] rounded-2xl overflow-hidden p-4 text-white relative shadow-md bg-gradient-to-r ${promo.gradient} border border-white/20`}
              >
                {/* Background photo blend */}
                <img 
                  src={promo.imageUrl} 
                  alt={promo.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none"
                />

                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-extrabold text-[#F4A340] tracking-wider">
                      <Zap className="w-3 h-3 fill-[#F4A340]" />
                      {promo.tag}
                    </span>
                    <Badge className="bg-white/90 text-[#123B5D] font-extrabold text-[10px] border-none shadow-sm">
                      {promo.discount}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm leading-snug line-clamp-1 text-white">{promo.title}</h4>
                    <p className="text-[11px] text-white/90 line-clamp-1 mt-0.5">{promo.subtitle}</p>
                  </div>

                  {/* Promo code copy bar */}
                  <div className="pt-1 flex items-center justify-between bg-black/35 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
                    <div className="pl-2">
                      <span className="text-[9px] uppercase tracking-wider text-slate-200 block">Kode Kupon</span>
                      <span className="font-mono font-bold text-xs text-[#F4A340] tracking-wider">
                        {promo.promoCode}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleCopyPromo(promo)}
                      className="h-7 px-3 text-[10px] font-bold bg-white text-[#123B5D] hover:bg-[#F7F9FC] rounded-lg gap-1 shadow-sm"
                    >
                      {copiedPromoId === promo.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#2E9D70]" />
                          Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#123B5D]" />
                          Salin
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-[9px] text-white/80 text-right">
                    Berlaku s/d {promo.validUntil}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. KATEGORI WISATA */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#2878A5]" />
            <h3 className="text-sm font-bold text-[#172B3A] tracking-tight">Kategori Wisata</h3>
          </div>
          {selectedCategory !== 'All' && (
            <button 
              onClick={() => setSelectedCategory('All')} 
              className="text-[11px] text-[#2878A5] font-semibold hover:underline"
            >
              Reset ke Semua
            </button>
          )}
        </div>

        {/* Visual Category Icons */}
        <div className="grid grid-cols-3 gap-2.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase() || (cat.id === 'All' && selectedCategory === 'All')
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center relative ${
                  isSelected
                    ? 'bg-white border-2 border-[#123B5D] shadow-md text-[#123B5D]'
                    : 'bg-white border-[#E7ECF0] text-[#7B8794] hover:border-[#2878A5]/40 shadow-xs'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${
                  isSelected ? 'bg-[#EBF3F8] scale-110' : 'bg-[#F7F9FC]'
                }`}>
                  {getCategoryIcon(cat.icon)}
                </div>

                <div>
                  <span className={`text-xs block font-bold leading-tight ${isSelected ? 'text-[#123B5D]' : 'text-[#172B3A]'}`}>
                    {cat.name}
                  </span>
                  <span className="text-[9px] text-[#7B8794] block line-clamp-1 mt-0.5">
                    {cat.badgeText}
                  </span>
                </div>

                {isSelected && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#123B5D]" />
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
            <MapPin className="w-4 h-4 text-[#2878A5]" />
            <h3 className="text-sm font-bold text-[#172B3A] tracking-tight">Destinasi Wisata</h3>
          </div>

          {/* Toggle Terpopuler vs Terdekat */}
          <div className="flex items-center bg-[#E7ECF0]/70 p-0.5 rounded-xl border border-[#E7ECF0]">
            <button
              onClick={() => setDestinationMode('popular')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                destinationMode === 'popular'
                  ? 'bg-white text-[#123B5D] shadow-xs'
                  : 'text-[#7B8794] hover:text-[#172B3A]'
              }`}
            >
              🔥 Terpopuler
            </button>
            <button
              onClick={() => setDestinationMode('nearby')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                destinationMode === 'nearby'
                  ? 'bg-white text-[#123B5D] shadow-xs'
                  : 'text-[#7B8794] hover:text-[#172B3A]'
              }`}
            >
              📍 Terdekat
            </button>
          </div>
        </div>

        {isLoadingDestinations ? (
          <div className="flex gap-3 overflow-hidden">
            <Skeleton className="h-44 w-48 rounded-2xl bg-[#E7ECF0] shrink-0" />
            <Skeleton className="h-44 w-48 rounded-2xl bg-[#E7ECF0] shrink-0" />
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
                <div className="rounded-2xl overflow-hidden bg-white border border-[#E7ECF0] hover:border-[#2878A5]/40 transition-all shadow-sm hover:shadow-md">
                  <div className="relative h-28 w-full overflow-hidden bg-[#F7F9FC]">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Tag Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[9px] font-bold text-[#123B5D] shadow-xs">
                        {dest.tag}
                      </span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center gap-0.5 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[#F4A340] text-[10px] font-bold">
                        <Star className="w-2.5 h-2.5 fill-[#F4A340] text-[#F4A340]" />
                        <span className="text-white">{dest.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-1.5 left-2 right-2">
                      <p className="text-[10px] text-white/95 flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 text-[#F4A340]" />
                        <span className="truncate">{dest.city}, {dest.province}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <h5 className="font-bold text-xs text-[#172B3A] line-clamp-1 group-hover:text-[#2878A5] transition-colors">
                      {dest.name}
                    </h5>
                    <div className="flex items-baseline justify-between pt-1 border-t border-[#E7ECF0]">
                      <div>
                        <span className="text-[9px] text-[#7B8794] block">Mulai</span>
                        <span className="text-[11px] font-extrabold text-[#123B5D]">
                          Rp {(dest.startingPrice / 1000).toLocaleString('id-ID')}rb
                        </span>
                      </div>
                      <span className="text-[10px] text-[#7B8794] font-medium">
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
            <Flame className="w-4 h-4 text-[#F4A340] animate-bounce" />
            <div>
              <h3 className="text-sm font-bold text-[#172B3A] tracking-tight">Sedang Ngetren Minggu Ini</h3>
              <p className="text-[10px] text-[#7B8794]">Banyak dipesan oleh wisatawan AyoTrip</p>
            </div>
          </div>
          <span className="text-[11px] text-[#F4A340] font-bold bg-[#FFF7ED] px-2 py-0.5 rounded-full border border-[#F4A340]/30">
            Hot Deals 🔥
          </span>
        </div>

        {isLoadingTrending ? (
          <Skeleton className="h-44 w-full rounded-2xl bg-[#E7ECF0]" />
        ) : (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {trendingPackages.map((trip, idx) => (
              <Link
                key={trip.id}
                to="/trips/$tripId"
                params={{ tripId: trip.id }}
                className="shrink-0 w-64 group block"
              >
                <Card className="overflow-hidden border-[#E7ECF0] bg-white hover:border-[#2878A5]/40 transition-all shadow-sm rounded-2xl">
                  <div className="relative h-32 w-full overflow-hidden bg-[#F7F9FC]">
                    <img
                      src={trip.imageUrl}
                      alt={trip.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded bg-[#F4A340] text-slate-950 font-black text-[9px] uppercase tracking-wider">
                        Trending #{idx + 1}
                      </span>
                      {trip.slotsLeft && trip.slotsLeft <= 4 && (
                        <span className="px-1.5 py-0.5 rounded bg-[#D9534F] text-white font-bold text-[9px]">
                          Sisa {trip.slotsLeft} Slot!
                        </span>
                      )}
                    </div>

                    {trip.discountPercent && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded bg-[#2E9D70] text-white font-extrabold text-[10px]">
                          -{trip.discountPercent}%
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] text-white/95">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-[#F4A340]" />
                        {trip.destination}
                      </span>
                      <span className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                        <Clock className="w-2.5 h-2.5 text-[#F4A340]" />
                        {trip.duration}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-3.5 space-y-2">
                    <h5 className="font-bold text-xs text-[#172B3A] line-clamp-1 group-hover:text-[#2878A5] transition-colors">
                      {trip.title}
                    </h5>

                    {/* Social proof indicator */}
                    <div className="flex items-center gap-1 text-[10px] text-[#7B8794]">
                      <Users className="w-3 h-3 text-[#2878A5]" />
                      <span>{trip.viewersCount || 89} orang melihat hari ini</span>
                    </div>

                    <div className="pt-2 flex items-end justify-between border-t border-[#E7ECF0]">
                      <div>
                        {trip.originalPrice && (
                          <span className="text-[10px] text-[#7B8794] line-through block">
                            Rp {trip.originalPrice.toLocaleString('id-ID')}
                          </span>
                        )}
                        <span className="text-xs font-black text-[#123B5D]">
                          Rp {trip.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <Button size="sm" className="h-7 px-3 text-[10px] bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold rounded-lg shadow-sm">
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
            <Sparkles className="w-4 h-4 text-[#2878A5]" />
            <div>
              <h3 className="text-sm font-bold text-[#172B3A] tracking-tight">Rekomendasi Paket Wisata</h3>
              <p className="text-[10px] text-[#7B8794]">Paket terkurasi dengan fasilitas lengkap & guide profesional</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs text-[#7B8794] hover:text-[#123B5D] h-8 px-2 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-[#123B5D]' : ''}`} />
          </Button>
        </div>

        {/* Loading Skeletons */}
        {isLoadingTrips && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-3 bg-white rounded-2xl space-y-3 border border-[#E7ECF0]">
                <Skeleton className="h-40 w-full rounded-xl bg-[#E7ECF0]" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-[#E7ECF0]" />
                  <Skeleton className="h-3 w-1/2 bg-[#E7ECF0]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-[#D9534F] mx-auto" />
            <p className="text-xs font-semibold">Gagal memuat data paket wisata</p>
            <p className="text-[11px] text-red-600">{(error as Error)?.message || 'Terjadi kesalahan sistem'}</p>
            <Button size="sm" variant="outline" onClick={() => refetch()} className="text-xs mt-2 border-red-300 text-red-700 hover:bg-red-100">
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
                  <Card className="overflow-hidden border-[#E7ECF0] bg-white hover:border-[#2878A5]/40 transition-all shadow-sm hover:shadow-md rounded-2xl">
                    <div className="relative h-44 w-full overflow-hidden bg-[#F7F9FC]">
                      <img
                        src={trip.imageUrl}
                        alt={trip.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                        {trip.isRecommended && (
                          <Badge className="bg-[#F4A340] text-slate-950 font-extrabold text-[10px] border-none shadow-sm">
                            ⭐ Pilihan AyoTrip
                          </Badge>
                        )}
                        <Badge className="bg-white/90 backdrop-blur-md text-[#123B5D] border border-[#E7ECF0] text-[10px] font-semibold">
                          {trip.category}
                        </Badge>
                        {trip.packageType && (
                          <Badge className="bg-[#123B5D]/85 text-white border-none text-[10px]">
                            {trip.packageType}
                          </Badge>
                        )}
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[#172B3A] text-xs font-bold shadow-xs border border-[#E7ECF0]">
                          <Star className="w-3.5 h-3.5 fill-[#F4A340] text-[#F4A340]" />
                          <span>{trip.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-[#7B8794]">({trip.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Bottom Info inside image */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
                        <div className="flex items-center gap-1 text-[11px] text-white/95">
                          <MapPin className="w-3.5 h-3.5 text-[#F4A340]" />
                          <span className="font-medium">{trip.destination}, {trip.province}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-white bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/20">
                          <Clock className="w-3 h-3 text-[#F4A340]" />
                          <span>{trip.duration}</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-3.5 space-y-2.5">
                      <div>
                        <h4 className="font-bold text-[#172B3A] text-base leading-snug group-hover:text-[#2878A5] transition-colors line-clamp-1">
                          {trip.title}
                        </h4>
                        <p className="text-xs text-[#7B8794] line-clamp-2 leading-relaxed mt-1">
                          {trip.description}
                        </p>
                      </div>

                      {/* Facilities Mini Badges */}
                      {trip.facilities && trip.facilities.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          {trip.facilities.slice(0, 3).map((f, i) => (
                            <span 
                              key={i} 
                              className="text-[10px] text-[#172B3A] bg-[#F7F9FC] px-2 py-0.5 rounded-md border border-[#E7ECF0] flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5 text-[#2E9D70]" />
                              {f}
                            </span>
                          ))}
                          {trip.facilities.length > 3 && (
                            <span className="text-[10px] text-[#7B8794]">+{trip.facilities.length - 3} lagi</span>
                          )}
                        </div>
                      )}

                      {/* Pricing and Action */}
                      <div className="pt-2 flex items-center justify-between border-t border-[#E7ECF0]">
                        <div>
                          {trip.originalPrice && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-[#7B8794] line-through">
                                Rp {trip.originalPrice.toLocaleString('id-ID')}
                              </span>
                              {trip.discountPercent && (
                                <span className="text-[10px] font-bold text-[#2E9D70]">
                                  Hemat {trip.discountPercent}%
                                </span>
                              )}
                            </div>
                          )}
                          <div className="flex items-baseline gap-1">
                            <span className="text-base font-black text-[#123B5D]">
                              Rp {trip.price.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] text-[#7B8794]">/ orang</span>
                          </div>
                        </div>

                        <Button size="sm" className="bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold text-xs h-9 px-3.5 rounded-xl shadow-sm">
                          Pesan Paket
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#E7ECF0] space-y-3 shadow-sm">
                <Compass className="w-10 h-10 text-[#7B8794] mx-auto" />
                <p className="text-sm text-[#172B3A] font-bold">Tidak ada paket wisata yang cocok.</p>
                <p className="text-xs text-[#7B8794]">
                  Coba ubah kata kunci pencarian, kategori, atau filter anggaran Anda.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetAllFilters}
                  className="text-xs border-[#E7ECF0] text-[#123B5D] hover:bg-[#F7F9FC] rounded-xl"
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
        <SheetContent side="bottom" className="bg-white border-t border-[#E7ECF0] text-[#172B3A] max-w-md mx-auto rounded-t-3xl max-h-[85vh] overflow-y-auto shadow-2xl">
          <SheetHeader className="pb-3 border-b border-[#E7ECF0]">
            <SheetTitle className="text-base font-bold text-[#172B3A] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#123B5D]" />
              Filter Pencarian Wisata
            </SheetTitle>
            <SheetDescription className="text-xs text-[#7B8794]">
              Sesuaikan preferensi jenis paket dan anggaran liburan Anda.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-4">
            {/* Package Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#172B3A] block">Tipe Paket Wisata</label>
              <div className="grid grid-cols-2 gap-2">
                {['All', 'Open Trip', 'Private Trip', 'Family Trip'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedPackageType(type)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      selectedPackageType === type
                        ? 'bg-[#EBF3F8] border-2 border-[#123B5D] text-[#123B5D] font-bold'
                        : 'bg-[#F7F9FC] border-[#E7ECF0] text-[#172B3A] hover:bg-white'
                    }`}
                  >
                    {type === 'All' ? 'Semua Tipe' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Maximum Budget */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#172B3A] block">Maksimal Anggaran (IDR)</label>
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
                        ? 'bg-[#EBF3F8] border-2 border-[#123B5D] text-[#123B5D] font-bold'
                        : 'bg-[#F7F9FC] border-[#E7ECF0] text-[#172B3A] hover:bg-white'
                    }`}
                  >
                    {budget.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="flex flex-row items-center gap-2 pt-3 border-t border-[#E7ECF0]">
            <Button
              variant="outline"
              size="sm"
              onClick={resetAllFilters}
              className="flex-1 text-xs border-[#E7ECF0] text-[#7B8794] hover:bg-[#F7F9FC] h-11 rounded-xl"
            >
              Reset
            </Button>
            <SheetClose asChild>
              <Button
                size="sm"
                className="flex-1 text-xs bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold h-11 rounded-xl shadow-md"
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
