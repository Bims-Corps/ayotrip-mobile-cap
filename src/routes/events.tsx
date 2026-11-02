import { useState, useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { 
  eventService, 
  type EventItem, 
  type TripType, 
  type EventFilterParams 
} from '@/services/eventService'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Compass, 
  Search, 
  X, 
  MapPin, 
  Clock, 
  Users, 
  Radio, 
  Tag as TagIcon, 
  Heart, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  ArrowUpDown, 
  ArrowRight
} from 'lucide-react'

export const Route = createFileRoute('/events')({
  component: EventsListPage,
})

const POPULAR_TAGS = ['ALL', 'touring', 'candi', 'motoran', 'yogyakarta', 'bromo', 'phinisi', 'camping']

function EventsListPage() {
  // Filters state
  const [search, setSearch] = useState('')
  const [statusTab, setStatusTab] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')
  const [selectedTripType, setSelectedTripType] = useState<'ALL' | TripType>('ALL')
  const [selectedTag, setSelectedTag] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'duration' | 'capacity' | 'popular'>('newest')

  // Selected event modal
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [likedEvents, setLikedEvents] = useState<Record<string, number>>({})

  // Fetch events with TanStack Query
  const queryParams: EventFilterParams = useMemo(() => ({
    search,
    isOnAir: statusTab,
    tripType: selectedTripType,
    tag: selectedTag,
    sortBy
  }), [search, statusTab, selectedTripType, selectedTag, sortBy])

  const { data: response, isLoading } = useQuery({
    queryKey: ['eventsList', queryParams],
    queryFn: () => eventService.getEvents(queryParams),
  })

  const events = response?.body?.data || []

  const handleLike = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation()
    const res = eventService.toggleLike(eventId)
    setLikedEvents((prev) => ({
      ...prev,
      [eventId]: res.count
    }))
    toast.success('Event ditambahkan ke suka!')
  }

  const handleShare = (e: React.MouseEvent, item: EventItem) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: `Ikuti event ${item.name} bersama ${item.provider.brandName} di AyoTrip!`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.info('Tautan event disalin ke clipboard!')
    }
  }

  const resetFilters = () => {
    setSearch('')
    setStatusTab('ALL')
    setSelectedTripType('ALL')
    setSelectedTag('ALL')
    setSortBy('newest')
    toast.info('Filter event telah di-reset')
  }

  return (
    <div className="p-4 space-y-4 pb-24 bg-[#F7F9FC]">
      {/* 1. Header Banner Event */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#123B5D] via-[#1A4E78] to-[#2878A5] p-5 text-white shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[#F4A340] text-[11px] font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#F4A340]" />
            Live Event & Touring Komunitas
          </div>
          <span className="text-[10px] text-white/80 font-semibold">
            {events.length} Event Terdaftar
          </span>
        </div>

        <h1 className="text-lg font-black text-white leading-snug">
          Temukan Event Touring & Trip Komunitas
        </h1>
        <p className="text-xs text-white/85 leading-relaxed">
          Pilihan open trip touring motoran, gathering alam, dan private trip resmi dari travel organizer terpercaya.
        </p>
      </div>

      {/* 2. Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8794]" />
        <Input
          placeholder="Cari nama event, kabupaten, destinasi, atau provider..."
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

      {/* 3. Status Tabs (On Air vs Inactive vs All) */}
      <div className="flex items-center gap-1.5 bg-[#E7ECF0]/70 p-1 rounded-2xl border border-[#E7ECF0]">
        <button
          onClick={() => setStatusTab('ALL')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusTab === 'ALL'
              ? 'bg-white text-[#123B5D] shadow-xs'
              : 'text-[#7B8794] hover:text-[#172B3A]'
          }`}
        >
          Semua Status
        </button>
        <button
          onClick={() => setStatusTab('ACTIVE')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            statusTab === 'ACTIVE'
              ? 'bg-white text-[#123B5D] shadow-xs'
              : 'text-[#2E9D70] hover:text-[#172B3A]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#2E9D70] animate-pulse" />
          Sedang On-Air
        </button>
        <button
          onClick={() => setStatusTab('INACTIVE')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusTab === 'INACTIVE'
              ? 'bg-white text-[#123B5D] shadow-xs'
              : 'text-[#7B8794] hover:text-[#172B3A]'
          }`}
        >
          Segera Hadir
        </button>
      </div>

      {/* 4. Trip Type & Sorting Controls */}
      <div className="flex items-center justify-between gap-2 text-xs">
        {/* Trip Type Pills */}
        <div className="flex items-center gap-1.5">
          {(['ALL', 'GENERAL', 'PRIVATE'] as const).map((type) => {
            const labelMap = { ALL: 'Semua Tipe', GENERAL: 'Open Trip', PRIVATE: 'Private Trip' }
            const isSelected = selectedTripType === type
            return (
              <button
                key={type}
                onClick={() => setSelectedTripType(type)}
                className={`px-3 py-1 rounded-xl font-bold transition-all text-[11px] ${
                  isSelected
                    ? 'bg-[#123B5D] text-white shadow-xs'
                    : 'bg-white text-[#7B8794] hover:text-[#172B3A] border border-[#E7ECF0]'
                }`}
              >
                {labelMap[type]}
              </button>
            )
          })}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#7B8794] shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white text-[11px] font-bold text-[#172B3A] border border-[#E7ECF0] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#123B5D] shadow-xs"
          >
            <option value="newest">Terbaru</option>
            <option value="price_asc">Harga Terendah</option>
            <option value="price_desc">Harga Tertinggi</option>
            <option value="duration">Durasi Terpanjang</option>
            <option value="capacity">Kursi Terbanyak</option>
            <option value="popular">Paling Populer</option>
          </select>
        </div>
      </div>

      {/* 5. Tag Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-[11px] text-[#7B8794] mr-1 flex items-center gap-1">
          <TagIcon className="w-3 h-3" /> Tag:
        </span>
        {POPULAR_TAGS.map((tag) => {
          const isSelected = selectedTag === tag
          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#EBF3F8] text-[#123B5D] border border-[#2878A5]/30 font-bold'
                  : 'bg-white text-[#7B8794] hover:text-[#172B3A] border border-[#E7ECF0]'
              }`}
            >
              {tag === 'ALL' ? 'Semua Tag' : `#${tag}`}
            </button>
          )
        })}
      </div>

      {/* 6. Active Filter Indicators */}
      {(search || statusTab !== 'ALL' || selectedTripType !== 'ALL' || selectedTag !== 'ALL') && (
        <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-[#E7ECF0] shadow-xs">
          <span className="text-[11px] text-[#7B8794]">
            Menampilkan filter aktif
          </span>
          <button
            onClick={resetFilters}
            className="text-xs text-[#D9534F] hover:underline font-bold"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* 7. Events List Content */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 bg-white rounded-2xl space-y-3 border border-[#E7ECF0]">
              <Skeleton className="h-40 w-full rounded-xl bg-[#E7ECF0]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-[#E7ECF0]" />
                <Skeleton className="h-3 w-1/2 bg-[#E7ECF0]" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => {
            const formattedPrice = Number(event.startPrice).toLocaleString('id-ID')
            const currentLikes = likedEvents[event.id] ?? event.liked

            return (
              <Link
                key={event.id}
                to="/events/$eventId"
                params={{ eventId: event.id }}
                className="block group"
              >
                <Card
                  className="overflow-hidden border-[#E7ECF0] bg-white hover:border-[#2878A5]/40 transition-all shadow-sm hover:shadow-md cursor-pointer rounded-2xl"
                >
                  {/* Event Cover Photo & Badges */}
                  <div className="relative h-44 w-full overflow-hidden bg-[#F7F9FC]">
                    <img
                      src={event.coverImage || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'}
                      alt={event.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top Badges Row */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                      {event.isOnAir ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F4A340] text-slate-950 font-black text-[10px] shadow-sm animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                          ON AIR (LIVE)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 text-[#123B5D] font-bold text-[10px] border border-[#E7ECF0] backdrop-blur-md">
                          ⏳ SEGERA HADIR
                        </span>
                      )}

                      <Badge className="bg-[#123B5D]/85 text-white border-none text-[10px] font-bold backdrop-blur-md">
                        {event.tripType === 'GENERAL' ? 'OPEN TRIP' : 'PRIVATE TRIP'}
                      </Badge>
                    </div>

                    {/* Top Right Quick Actions */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleLike(e, event.id)
                        }}
                        className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#7B8794] hover:text-[#D9534F] border border-white/60 shadow-xs"
                        aria-label="Suka event"
                      >
                        <Heart className="w-4 h-4 fill-[#D9534F] text-[#D9534F]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleShare(e, event)
                        }}
                        className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#172B3A] hover:bg-white border border-white/60 shadow-xs"
                        aria-label="Bagikan event"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom details on image */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-white flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#F4A340] shrink-0" />
                          <span>{event.destination.displayName}</span>
                        </p>
                        <p className="text-[10px] text-white/80 pl-4 font-medium">
                          {event.eventRegency.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/20 font-semibold text-white flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#F4A340]" />
                          {event.dayDuration} Hari
                        </span>
                        <span className="bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/20 font-bold text-white flex items-center gap-1">
                          <Users className="w-3 h-3 text-[#F4A340]" />
                          {event.seatCapacity} Kursi
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content & Organizer Details */}
                  <CardContent className="p-3.5 space-y-3">
                    {/* Provider Organizer Strip */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#E7ECF0] text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={event.provider.logoUrl}
                          alt={event.provider.brandName}
                          className="w-7 h-7 rounded-lg object-cover border border-[#E7ECF0]"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none'
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-extrabold text-[#172B3A] text-xs">
                              {event.provider.brandName}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#EBF3F8] text-[#123B5D] border border-[#2878A5]/25 font-bold">
                              Official
                            </span>
                          </div>
                          <span className="text-[10px] text-[#7B8794] truncate block max-w-[220px]">
                            {event.provider.brandLegalName}
                          </span>
                        </div>
                      </div>

                      {event.isAllowAddon && (
                        <Badge className="bg-[#FFF7ED] text-[#F4A340] border border-[#F4A340]/30 text-[9px] font-bold">
                          + Addon
                        </Badge>
                      )}
                    </div>

                    {/* Title & Summary */}
                    <div className="space-y-1">
                      <h3 className="font-bold text-[#172B3A] text-sm leading-snug group-hover:text-[#2878A5] transition-colors line-clamp-1">
                        {event.name}
                      </h3>
                      <p className="text-xs text-[#7B8794] line-clamp-2 leading-relaxed">
                        "{event.summary}"
                      </p>
                    </div>

                    {/* Tags Row */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {event.tag.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-[#172B3A] bg-[#F7F9FC] px-2 py-0.5 rounded-md border border-[#E7ECF0]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    {/* Pricing, Social Stats, & Action CTA */}
                    <div className="pt-2 flex items-center justify-between border-t border-[#E7ECF0]">
                      <div>
                        <span className="text-[10px] text-[#7B8794] block uppercase tracking-wider">Mulai dari</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-black text-[#123B5D]">
                            Rp {formattedPrice}
                          </span>
                          <span className="text-[10px] text-[#7B8794]">/ orang</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right text-[10px] text-[#7B8794] mr-1 hidden sm:block">
                          <span>❤️ {currentLikes} disukai</span>
                          <span className="block text-[#123B5D] font-medium">{event.attended} diikuti</span>
                        </div>

                        <Button
                          size="sm"
                          className="bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-extrabold text-xs h-8 px-3.5 rounded-xl shadow-xs gap-1"
                        >
                          Detail Event
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#E7ECF0] space-y-3 shadow-sm">
          <Compass className="w-10 h-10 text-[#7B8794] mx-auto" />
          <h4 className="text-sm font-bold text-[#172B3A]">Tidak Ada Event yang Sesuai</h4>
          <p className="text-xs text-[#7B8794]">
            Coba ubah kata kunci pencarian, tab status, atau pilihan tag event Anda.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="text-xs border-[#E7ECF0] text-[#123B5D] hover:bg-[#F7F9FC] rounded-xl"
          >
            Reset Semua Filter
          </Button>
        </div>
      )}

      {/* 8. MODAL DETAIL EVENT */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="bg-white border-[#E7ECF0] text-[#172B3A] max-w-md mx-auto rounded-3xl p-5 max-h-[90vh] overflow-y-auto shadow-2xl">
          {selectedEvent && (
            <div className="space-y-4 text-xs">
              <DialogHeader className="pb-2 border-b border-[#E7ECF0] space-y-1">
                <div className="flex items-center gap-1.5">
                  {selectedEvent.isOnAir ? (
                    <Badge className="bg-[#F4A340] text-slate-950 font-bold text-[10px]">
                      🟢 ON AIR (LIVE)
                    </Badge>
                  ) : (
                    <Badge className="bg-[#EBF3F8] text-[#123B5D] border border-[#2878A5]/30 text-[10px]">
                      ⏳ SEGERA HADIR
                    </Badge>
                  )}
                  <Badge className="bg-[#123B5D] text-white border-none text-[10px]">
                    {selectedEvent.tripType}
                  </Badge>
                </div>
                <DialogTitle className="text-base font-extrabold text-[#172B3A] text-left leading-snug">
                  {selectedEvent.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#7B8794] text-left">
                  {selectedEvent.eventRegency.name} • Diselenggarakan oleh {selectedEvent.provider.brandName}
                </DialogDescription>
              </DialogHeader>

              {/* Event Image Banner */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-[#F7F9FC]">
                <img
                  src={selectedEvent.coverImage || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between text-white text-[11px] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#F4A340]" /> Durasi: {selectedEvent.dayDuration} Hari
                  </span>
                  <span className="flex items-center gap-1 text-white font-bold">
                    <Users className="w-3.5 h-3.5 text-[#F4A340]" /> Kuota: {selectedEvent.seatCapacity} Kursi
                  </span>
                </div>
              </div>

              {/* Provider Info Card */}
              <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E7ECF0] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#7B8794] uppercase tracking-wider">Travel Agent / Organizer</span>
                  <span className="text-[10px] text-[#2E9D70] font-bold">Terverifikasi</span>
                </div>
                <p className="font-bold text-sm text-[#172B3A]">{selectedEvent.provider.brandName}</p>
                <p className="text-[11px] text-[#7B8794]">{selectedEvent.provider.brandLegalName}</p>
              </div>

              {/* Destination & Coordinates */}
              <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E7ECF0] space-y-1.5">
                <span className="text-[10px] text-[#7B8794] uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F4A340]" /> Titik Destinasi
                </span>
                <p className="font-bold text-[#172B3A] text-xs">{selectedEvent.destination.displayName}</p>
                <p className="text-[11px] text-[#7B8794] font-mono">
                  Koordinat: {selectedEvent.destination.coordinates}
                </p>
                <p className="text-[11px] text-[#7B8794]">
                  Wilayah: {selectedEvent.eventRegency.name}
                </p>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="font-bold text-[#172B3A] text-xs uppercase tracking-wider">Deskripsi Kegiatan</h4>
                <p className="text-xs text-[#172B3A] leading-relaxed bg-[#F7F9FC] p-3 rounded-xl border border-[#E7ECF0]">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Includes & Excludes */}
              <div className="space-y-2">
                {selectedEvent.attributesInclude.length > 0 && (
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-[#2E9D70]/30 space-y-1.5">
                    <span className="font-bold text-[#2E9D70] flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2E9D70]" /> Sudah Termasuk:
                    </span>
                    <ul className="space-y-1 text-[11px] text-[#172B3A] pl-4 list-disc">
                      {selectedEvent.attributesInclude.map((inc, i) => (
                        <li key={i}>{inc}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEvent.attributesExclude.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-50/60 border border-[#D9534F]/30 space-y-1.5">
                    <span className="font-bold text-[#D9534F] flex items-center gap-1.5 text-xs">
                      <XCircle className="w-3.5 h-3.5 text-[#D9534F]" /> Belum Termasuk:
                    </span>
                    <ul className="space-y-1 text-[11px] text-[#172B3A] pl-4 list-disc">
                      {selectedEvent.attributesExclude.map((exc, i) => (
                        <li key={i}>{exc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Pricing & Booking Footer */}
              <DialogFooter className="pt-3 border-t border-[#E7ECF0] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-[#7B8794] block uppercase">Harga Mulai</span>
                  <span className="text-base font-black text-[#123B5D]">
                    Rp {Number(selectedEvent.startPrice).toLocaleString('id-ID')}
                  </span>
                </div>

                <Button
                  onClick={() => {
                    toast.success(`Pemesanan kursimu untuk "${selectedEvent.name}" sedang diproses!`, {
                      description: 'Tim organizer akan segera menghubungi kontak Anda via WhatsApp.',
                    })
                    setSelectedEvent(null)
                  }}
                  className="bg-[#123B5D] hover:bg-[#0e2f4a] text-white font-bold text-xs h-10 px-5 rounded-xl shadow-md"
                >
                  Daftar Kursi Event
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
