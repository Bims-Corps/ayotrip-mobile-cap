import { useState, useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { tripApi, DEPARTURE_CITIES, type TripFilterOptions } from '@/services/tripService'
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
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Star, 
  Clock, 
  CalendarDays, 
  ArrowUpDown, 
  X, 
  Compass, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  ChevronRight,
  RotateCcw
} from 'lucide-react'

export const Route = createFileRoute('/search')({
  component: SearchExplorePage,
})

const DURATION_OPTIONS = [
  { label: 'Semua Durasi', val: 0 },
  { label: '1 Hari (Day Trip)', val: 1 },
  { label: '2 Hari (2D1N)', val: 2 },
  { label: '3 Hari (3D2N)', val: 3 },
  { label: '4+ Hari (Long Trip)', val: 4 },
]

const SORT_OPTIONS = [
  { label: 'Paling Populer', val: 'popularity' as const },
  { label: 'Harga Terendah', val: 'price_asc' as const },
  { label: 'Harga Tertinggi', val: 'price_desc' as const },
  { label: 'Rating Tertinggi', val: 'rating' as const },
  { label: 'Terbaru', val: 'newest' as const },
]

const CATEGORY_PILLS = ['All', 'Alam', 'Pantai', 'Gunung', 'Budaya', 'Bahari']

function SearchExplorePage() {
  // Search inputs
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedCity, setSelectedCity] = useState('Semua Kota')
  const [selectedDuration, setSelectedDuration] = useState<number>(0)
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined)
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('popularity')
  const [departureDate, setDepartureDate] = useState<string>('')
  
  // Sheet filter drawer open state
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)

  // Query trips with all filter options
  const filterParams: TripFilterOptions = useMemo(() => ({
    query,
    category: selectedCategory,
    departureCity: selectedCity,
    durationDays: selectedDuration,
    minPrice,
    maxPrice,
    sortBy,
    departureDate
  }), [query, selectedCategory, selectedCity, selectedDuration, minPrice, maxPrice, sortBy, departureDate])

  const { data: trips = [], isLoading, isFetching } = useQuery({
    queryKey: ['exploreTrips', filterParams],
    queryFn: () => tripApi.getTrips(selectedCategory, query, filterParams),
  })

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (selectedCategory !== 'All') count++
    if (selectedCity !== 'Semua Kota') count++
    if (selectedDuration > 0) count++
    if (minPrice !== undefined && minPrice > 0) count++
    if (maxPrice !== undefined && maxPrice > 0) count++
    if (sortBy !== 'popularity') count++
    if (departureDate) count++
    return count
  }, [selectedCategory, selectedCity, selectedDuration, minPrice, maxPrice, sortBy, departureDate])

  const resetAllFilters = () => {
    setQuery('')
    setSelectedCategory('All')
    setSelectedCity('Semua Kota')
    setSelectedDuration(0)
    setMinPrice(undefined)
    setMaxPrice(undefined)
    setSortBy('popularity')
    setDepartureDate('')
  }

  return (
    <div className="p-4 space-y-4">
      {/* Search Header Bar */}
      <div className="space-y-2">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-400" />
          Eksplorasi & Pencarian Wisata
        </h1>
        <p className="text-xs text-slate-400">
          Temukan liburan impian nusantara sesuai anggaran dan titik keberangkatan Anda.
        </p>
      </div>

      {/* Main Search Input & Filter Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Cari destinasi, kota, atau nama trip..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-9 bg-slate-800/90 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-emerald-500 rounded-xl text-xs h-10 shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Trigger Button */}
        <Button
          variant="outline"
          onClick={() => setIsFilterSheetOpen(true)}
          className={`h-10 px-3 shrink-0 rounded-xl border border-slate-700 bg-slate-800/90 text-slate-200 hover:bg-slate-700 text-xs font-semibold gap-1.5 relative ${
            activeFiltersCount > 0 ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20' : ''
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filter</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 bg-emerald-500 text-slate-950 font-bold rounded-full text-[10px] flex items-center justify-center ml-0.5">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Horizontal Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {CATEGORY_PILLS.map((cat) => {
          const isActive = selectedCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              {cat === 'All' ? 'Semua Kategori' : cat}
            </button>
          )
        })}
      </div>

      {/* Sorting & Filter Quick Status Row */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="font-semibold text-slate-200">{trips.length}</span> Paket Ditemukan
          {isFetching && <span className="text-[10px] text-emerald-400 animate-pulse">(memperbarui...)</span>}
        </div>

        {/* Sorting Dropdown Selector */}
        <div className="flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800 text-[11px] font-semibold text-slate-200 border border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.val} value={opt.val}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Kategori: {selectedCategory}
              <button onClick={() => setSelectedCategory('All')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedCity !== 'Semua Kota' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
              Dari: {selectedCity}
              <button onClick={() => setSelectedCity('Semua Kota')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedDuration > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {DURATION_OPTIONS.find((d) => d.val === selectedDuration)?.label}
              <button onClick={() => setSelectedDuration(0)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Budget: {minPrice ? `Rp ${(minPrice/1000).toLocaleString('id-ID')}k` : '0'} - {maxPrice ? `Rp ${(maxPrice/1000).toLocaleString('id-ID')}k` : 'Max'}
              <button onClick={() => { setMinPrice(undefined); setMaxPrice(undefined); }}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={resetAllFilters}
            className="text-xs text-rose-400 hover:underline flex items-center gap-1 ml-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      )}

      {/* Trips Results List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 bg-slate-800/60 rounded-xl space-y-3 border border-slate-700/60">
              <Skeleton className="h-36 w-full rounded-lg bg-slate-700/60" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-slate-700/60" />
                <Skeleton className="h-3 w-1/2 bg-slate-700/60" />
              </div>
            </div>
          ))}
        </div>
      ) : trips.length > 0 ? (
        <div className="space-y-3">
          {trips.map((trip) => (
            <Link
              key={trip.id}
              to="/trips/$tripId"
              params={{ tripId: trip.id }}
              className="block group"
            >
              <Card className="overflow-hidden border-slate-800 bg-slate-800/50 hover:border-emerald-500/50 transition-all shadow-md group-hover:shadow-emerald-950/20">
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail Image */}
                  <div className="relative h-40 sm:h-auto sm:w-44 shrink-0 overflow-hidden bg-slate-900">
                    <img
                      src={trip.imageUrl}
                      alt={trip.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent sm:hidden" />

                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <Badge className="bg-slate-900/80 backdrop-blur-md text-emerald-400 border-none text-[10px] font-bold">
                        {trip.category}
                      </Badge>
                      {trip.packageType && (
                        <Badge className="bg-teal-950/80 text-teal-300 border-teal-700/60 text-[9px]">
                          {trip.packageType}
                        </Badge>
                      )}
                    </div>

                    <div className="absolute top-2 right-2">
                      <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-full text-amber-400 text-[11px] font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{trip.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Details */}
                  <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{trip.destination}, {trip.province}</span>
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center gap-0.5 text-slate-300">
                          <Clock className="w-3 h-3 text-teal-400" /> {trip.duration}
                        </span>
                      </div>

                      <h3 className="font-bold text-white text-sm leading-snug group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {trip.title}
                      </h3>

                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {trip.description}
                      </p>
                    </div>

                    {/* Departure info & Vendor */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>Berangkat: <strong className="text-slate-300">{trip.departureCity}</strong></span>
                      <span className="text-emerald-400/90 font-medium">{trip.vendor?.name}</span>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-end justify-between pt-1">
                      <div>
                        {trip.originalPrice && (
                          <span className="text-[10px] text-slate-500 line-through block">
                            Rp {trip.originalPrice.toLocaleString('id-ID')}
                          </span>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-black text-emerald-400">
                            Rp {trip.price.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[10px] text-slate-400">/pax</span>
                        </div>
                      </div>

                      <Button size="sm" className="h-8 px-3 text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg shadow-sm">
                        Lihat Paket
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-800 space-y-3">
          <Compass className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-sm font-bold text-slate-200">Tidak Ada Wisata yang Cocok</h4>
          <p className="text-xs text-slate-400">
            Tidak ditemukan paket wisata yang sesuai dengan filter harga atau kriteria Anda.
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

      {/* FILTER BOTTOM SHEET */}
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetContent side="bottom" className="bg-slate-900 border-t border-slate-800 text-slate-100 max-w-md mx-auto rounded-t-3xl max-h-[85vh] overflow-y-auto">
          <SheetHeader className="pb-3 border-b border-slate-800">
            <SheetTitle className="text-base font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              Filter & Pengurutan Wisata
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-400">
              Sesuaikan anggaran, durasi, dan titik keberangkatan liburan Anda.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-3 text-xs">
            {/* Titik Keberangkatan */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 block">Titik Keberangkatan</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {DEPARTURE_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Durasi Perjalanan */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 block">Durasi Perjalanan</label>
              <div className="grid grid-cols-2 gap-2">
                {DURATION_OPTIONS.map((dur) => (
                  <button
                    key={dur.val}
                    onClick={() => setSelectedDuration(dur.val)}
                    className={`py-2 px-2.5 rounded-xl border text-left transition-all ${
                      selectedDuration === dur.val
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-800/70 border-slate-700/60 text-slate-300'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Rentang Harga */}
            <div className="space-y-2">
              <label className="font-bold text-slate-200 block">Rentang Harga (IDR)</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Min (IDR)</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minPrice || ''}
                    onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-slate-800 border-slate-700 text-xs h-9 rounded-xl"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Maks (IDR)</span>
                  <Input
                    type="number"
                    placeholder="10000000"
                    value={maxPrice || ''}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-slate-800 border-slate-700 text-xs h-9 rounded-xl"
                  />
                </div>
              </div>

              {/* Quick Budget Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
                {[
                  { label: '< 1 Juta', max: 1000000 },
                  { label: '1 - 3 Juta', min: 1000000, max: 3000000 },
                  { label: '3 - 5 Juta', min: 3000000, max: 5000000 },
                  { label: '> 5 Juta', min: 5000000 },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMinPrice(preset.min)
                      setMaxPrice(preset.max)
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] whitespace-nowrap text-slate-300 hover:border-emerald-500"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Tanggal Keberangkatan */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 block">Tanggal Keberangkatan</label>
              <Input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="bg-slate-800 border-slate-700 text-xs h-9 rounded-xl text-white"
              />
            </div>
          </div>

          <SheetFooter className="flex flex-row items-center gap-2 pt-3 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={resetAllFilters}
              className="flex-1 text-xs border-slate-700 text-slate-300 hover:bg-slate-800 h-10 rounded-xl"
            >
              Reset Filter
            </Button>
            <SheetClose asChild>
              <Button
                size="sm"
                className="flex-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold h-10 rounded-xl shadow-lg shadow-emerald-500/20"
              >
                Terapkan ({trips.length} Hasil)
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

