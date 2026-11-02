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
  ArrowUpDown, 
  X, 
  Compass, 
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
    <div className="p-4 space-y-4 bg-[#F7F9FC]">
      {/* Search Header Bar */}
      <div className="space-y-1.5">
        <h1 className="text-lg font-bold text-[#172B3A] flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#123B5D]" />
          Eksplorasi & Pencarian Wisata
        </h1>
        <p className="text-xs text-[#7B8794]">
          Temukan liburan impian nusantara sesuai anggaran dan titik keberangkatan Anda.
        </p>
      </div>

      {/* Main Search Input & Filter Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8794]" />
          <Input
            placeholder="Cari destinasi, kota, atau nama trip..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-9 bg-white border-[#E7ECF0] text-[#172B3A] placeholder:text-[#7B8794] focus-visible:ring-[#123B5D] rounded-xl text-xs h-11 shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B8794] hover:text-[#172B3A]"
              aria-label="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Trigger Button */}
        <Button
          variant="outline"
          onClick={() => setIsFilterSheetOpen(true)}
          className={`h-11 px-3.5 shrink-0 rounded-xl border border-[#E7ECF0] bg-white text-[#172B3A] hover:bg-[#F7F9FC] text-xs font-bold gap-1.5 shadow-sm relative ${
            activeFiltersCount > 0 ? 'border-[#123B5D] text-[#123B5D] bg-[#EBF3F8]' : ''
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filter</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 bg-[#F4A340] text-slate-950 font-bold rounded-full text-[10px] flex items-center justify-center ml-0.5">
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#123B5D] text-white shadow-sm'
                  : 'bg-white text-[#7B8794] hover:text-[#172B3A] border border-[#E7ECF0] shadow-xs'
              }`}
            >
              {cat === 'All' ? 'Semua Kategori' : cat}
            </button>
          )
        })}
      </div>

      {/* Sorting & Filter Quick Status Row */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E7ECF0]">
        <div className="flex items-center gap-1.5 text-[#7B8794]">
          <span className="font-bold text-[#172B3A]">{trips.length}</span> Paket Ditemukan
          {isFetching && <span className="text-[10px] text-[#2878A5] animate-pulse">(memperbarui...)</span>}
        </div>

        {/* Sorting Dropdown Selector */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#7B8794]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white text-[11px] font-bold text-[#172B3A] border border-[#E7ECF0] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#123B5D] shadow-xs"
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
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF3F8] text-[#123B5D] border border-[#2878A5]/25 font-medium">
              Kategori: {selectedCategory}
              <button onClick={() => setSelectedCategory('All')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedCity !== 'Semua Kota' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF3F8] text-[#123B5D] border border-[#2878A5]/25 font-medium">
              Dari: {selectedCity}
              <button onClick={() => setSelectedCity('Semua Kota')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedDuration > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF3F8] text-[#123B5D] border border-[#2878A5]/25 font-medium">
              {DURATION_OPTIONS.find((d) => d.val === selectedDuration)?.label}
              <button onClick={() => setSelectedDuration(0)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF7ED] text-[#F4A340] border border-[#F4A340]/30 font-medium">
              Budget: {minPrice ? `Rp ${(minPrice/1000).toLocaleString('id-ID')}k` : '0'} - {maxPrice ? `Rp ${(maxPrice/1000).toLocaleString('id-ID')}k` : 'Max'}
              <button onClick={() => { setMinPrice(undefined); setMaxPrice(undefined); }}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={resetAllFilters}
            className="text-xs text-[#D9534F] hover:underline flex items-center gap-1 ml-1 font-bold"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      )}

      {/* Trips Results List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 bg-white rounded-2xl space-y-3 border border-[#E7ECF0]">
              <Skeleton className="h-36 w-full rounded-xl bg-[#E7ECF0]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-[#E7ECF0]" />
                <Skeleton className="h-3 w-1/2 bg-[#E7ECF0]" />
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
              <Card className="overflow-hidden border-[#E7ECF0] bg-white hover:border-[#2878A5]/40 transition-all shadow-sm hover:shadow-md rounded-2xl">
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail Image */}
                  <div className="relative h-40 sm:h-auto sm:w-44 shrink-0 overflow-hidden bg-[#F7F9FC]">
                    <img
                      src={trip.imageUrl}
                      alt={trip.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent sm:hidden" />

                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <Badge className="bg-white/90 backdrop-blur-md text-[#123B5D] border border-[#E7ECF0] text-[10px] font-bold shadow-xs">
                        {trip.category}
                      </Badge>
                      {trip.packageType && (
                        <Badge className="bg-[#123B5D]/85 text-white border-none text-[9px]">
                          {trip.packageType}
                        </Badge>
                      )}
                    </div>

                    <div className="absolute top-2 right-2">
                      <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[#172B3A] text-[11px] font-bold shadow-xs border border-[#E7ECF0]">
                        <Star className="w-3 h-3 fill-[#F4A340] text-[#F4A340]" />
                        <span>{trip.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Details */}
                  <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#7B8794]">
                        <MapPin className="w-3 h-3 text-[#F4A340] shrink-0" />
                        <span className="truncate">{trip.destination}, {trip.province}</span>
                        <span className="text-[#E7ECF0]">•</span>
                        <span className="flex items-center gap-0.5 text-[#172B3A] font-medium">
                          <Clock className="w-3 h-3 text-[#2878A5]" /> {trip.duration}
                        </span>
                      </div>

                      <h3 className="font-bold text-[#172B3A] text-sm leading-snug group-hover:text-[#2878A5] transition-colors line-clamp-1">
                        {trip.title}
                      </h3>

                      <p className="text-[11px] text-[#7B8794] line-clamp-2">
                        {trip.description}
                      </p>
                    </div>

                    {/* Departure info & Vendor */}
                    <div className="flex items-center justify-between text-[10px] text-[#7B8794] pt-2 border-t border-[#E7ECF0]">
                      <span>Berangkat: <strong className="text-[#172B3A]">{trip.departureCity}</strong></span>
                      <span className="text-[#2878A5] font-semibold">{trip.vendor?.name}</span>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-end justify-between pt-1">
                      <div>
                        {trip.originalPrice && (
                          <span className="text-[10px] text-[#7B8794] line-through block">
                            Rp {trip.originalPrice.toLocaleString('id-ID')}
                          </span>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-black text-[#123B5D]">
                            Rp {trip.price.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[10px] text-[#7B8794]">/pax</span>
                        </div>
                      </div>

                      <Button size="sm" className="h-8 px-3.5 text-xs bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold rounded-xl shadow-sm">
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
        <div className="p-8 text-center bg-white rounded-2xl border border-[#E7ECF0] space-y-3 shadow-sm">
          <Compass className="w-10 h-10 text-[#7B8794] mx-auto" />
          <h4 className="text-sm font-bold text-[#172B3A]">Tidak Ada Wisata yang Cocok</h4>
          <p className="text-xs text-[#7B8794]">
            Tidak ditemukan paket wisata yang sesuai dengan filter harga atau kriteria Anda.
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

      {/* FILTER BOTTOM SHEET */}
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetContent side="bottom" className="bg-white border-t border-[#E7ECF0] text-[#172B3A] max-w-md mx-auto rounded-t-3xl max-h-[85vh] overflow-y-auto shadow-2xl">
          <SheetHeader className="pb-3 border-b border-[#E7ECF0]">
            <SheetTitle className="text-base font-bold text-[#172B3A] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#123B5D]" />
              Filter & Pengurutan Wisata
            </SheetTitle>
            <SheetDescription className="text-xs text-[#7B8794]">
              Sesuaikan anggaran, durasi, dan titik keberangkatan liburan Anda.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-4 text-xs">
            {/* Titik Keberangkatan */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#172B3A] block">Titik Keberangkatan</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#F7F9FC] border border-[#E7ECF0] rounded-xl px-3 py-2 text-[#172B3A] focus:outline-none focus:ring-1 focus:ring-[#123B5D]"
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
              <label className="font-bold text-[#172B3A] block">Durasi Perjalanan</label>
              <div className="grid grid-cols-2 gap-2">
                {DURATION_OPTIONS.map((dur) => (
                  <button
                    key={dur.val}
                    onClick={() => setSelectedDuration(dur.val)}
                    className={`py-2 px-2.5 rounded-xl border text-left transition-all ${
                      selectedDuration === dur.val
                        ? 'bg-[#EBF3F8] border-2 border-[#123B5D] text-[#123B5D] font-bold'
                        : 'bg-[#F7F9FC] border-[#E7ECF0] text-[#172B3A]'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Rentang Harga */}
            <div className="space-y-2">
              <label className="font-bold text-[#172B3A] block">Rentang Harga (IDR)</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-[#7B8794] block mb-1">Min (IDR)</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minPrice || ''}
                    onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-[#F7F9FC] border-[#E7ECF0] text-[#172B3A] text-xs h-10 rounded-xl"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#7B8794] block mb-1">Maks (IDR)</span>
                  <Input
                    type="number"
                    placeholder="10000000"
                    value={maxPrice || ''}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-[#F7F9FC] border-[#E7ECF0] text-[#172B3A] text-xs h-10 rounded-xl"
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
                    className="px-2.5 py-1 rounded-lg bg-[#F7F9FC] border border-[#E7ECF0] text-[11px] whitespace-nowrap text-[#172B3A] hover:border-[#123B5D]"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Tanggal Keberangkatan */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#172B3A] block">Tanggal Keberangkatan</label>
              <Input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="bg-[#F7F9FC] border-[#E7ECF0] text-xs h-10 rounded-xl text-[#172B3A]"
              />
            </div>
          </div>

          <SheetFooter className="flex flex-row items-center gap-2 pt-3 border-t border-[#E7ECF0]">
            <Button
              variant="outline"
              size="sm"
              onClick={resetAllFilters}
              className="flex-1 text-xs border-[#E7ECF0] text-[#7B8794] hover:bg-[#F7F9FC] h-11 rounded-xl"
            >
              Reset Filter
            </Button>
            <SheetClose asChild>
              <Button
                size="sm"
                className="flex-1 text-xs bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold h-11 rounded-xl shadow-md"
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
