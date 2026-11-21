import { useState, useEffect, useRef, useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  qiblaService,
  calculateDistanceKm,
  type MasjidItem,
  KABAH_COORDINATES,
} from '@/services/qiblaService'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  Compass,
  MapPin,
  RefreshCw,
  Navigation,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Layers,
  Map as MapIcon,
  CheckCircle2,
  Sliders,
  Maximize2,
  Radio,
  ArrowRight,
  Info,
} from 'lucide-react'

export const Route = createFileRoute('/kompas')({
  component: KompasPage,
})

// Custom SVG Icons for Leaflet Markers
const createMosqueMarkerIcon = (isSelected = false) => {
  return L.divIcon({
    className: 'custom-masjid-marker',
    html: `
      <div style="
        background: ${isSelected ? '#F4A340' : '#123B5D'};
        color: ${isSelected ? '#123B5D' : '#F4A340'};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
        cursor: pointer;
      ">
        <svg style="transform: rotate(45deg); width: 17px; height: 17px;" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a1 1 0 0 1 1 1v1.07A7.002 7.002 0 0 1 19 11v1h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h1v-1a7.002 7.002 0 0 1 6-6.93V3a1 1 0 0 1 1-1zm0 4a5 5 0 0 0-5 5v1h10v-1a5 5 0 0 0-5-5zm-2 10v4h4v-4a2 2 0 1 0-4 0z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

const createUserMarkerIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="position: relative; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #2878A5; opacity: 0.45; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <div style="position: relative; width: 16px; height: 16px; border-radius: 50%; background: #2878A5; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.35);"></div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  })
}

function KompasPage() {
  // Default coordinates: Jakarta / Monas (fallback)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: -6.2088,
    lng: 106.8456,
  })
  const [locationName, setLocationName] = useState<string>('Jakarta & Sekitarnya (GPS Otomatis)')
  const [isLocating, setIsLocating] = useState<boolean>(false)

  // Gyroscope / Device Heading state
  const [deviceHeading, setDeviceHeading] = useState<number>(0)
  const [hasGyroSensor, setHasGyroSensor] = useState<boolean>(false)
  const [isSimulating, setIsSimulating] = useState<boolean>(false)
  const [simulatedHeading, setSimulatedHeading] = useState<number>(0)

  // Qibla state (async from Aladhan API)
  const [qiblaDirection, setQiblaDirection] = useState<number>(295.15)
  const [isLoadingQibla, setIsLoadingQibla] = useState<boolean>(true)
  const [showAladhanCompass, setShowAladhanCompass] = useState<boolean>(false)

  // Nearby Masjids state (async from MasjidNearMe API)
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false)
  const [masjids, setMasjids] = useState<MasjidItem[]>([])
  const [isLoadingMasjids, setIsLoadingMasjids] = useState<boolean>(false)
  const [selectedMasjidId, setSelectedMasjidId] = useState<string | null>(null)

  // Leaflet Map refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const userMarkerRef = useRef<L.Marker | null>(null)
  const markersMapRef = useRef<Record<string, L.Marker>>({})

  // Current active heading (real gyro or simulation)
  const currentHeading = isSimulating ? simulatedHeading : deviceHeading

  // Alignment with Qibla check (within ±4 degrees)
  const headingDiff = useMemo(() => {
    let diff = (currentHeading - qiblaDirection) % 360
    if (diff > 180) diff -= 360
    if (diff < -180) diff += 360
    return diff
  }, [currentHeading, qiblaDirection])

  const isAlignedWithQibla = Math.abs(headingDiff) <= 4

  // Distance to Ka'bah
  const distanceToKabah = useMemo(() => {
    return calculateDistanceKm(
      userLocation.lat,
      userLocation.lng,
      KABAH_COORDINATES.latitude,
      KABAH_COORDINATES.longitude
    )
  }, [userLocation])

  // 1. Get user GPS position
  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.info('Geolocation tidak didukung browser ini, menggunakan lokasi default.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6))
        const lng = Number(pos.coords.longitude.toFixed(6))
        setUserLocation({ lat, lng })
        setLocationName(`Lat: ${lat}, Lng: ${lng}`)
        setIsLocating(false)
        toast.success('Lokasi GPS berhasil diperbarui!')
      },
      (err) => {
        console.warn('Geolocation error:', err)
        setIsLocating(false)
        toast.info('Izin lokasi ditolak, menggunakan koordinat default (Jakarta).')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    )
  }

  // 2. Fetch Qibla direction async when userLocation changes
  useEffect(() => {
    let active = true
    setIsLoadingQibla(true)

    qiblaService
      .getQiblaDirection(userLocation.lat, userLocation.lng)
      .then((data) => {
        if (active) {
          setQiblaDirection(data.direction)
          setIsLoadingQibla(false)
        }
      })
      .catch(() => {
        if (active) setIsLoadingQibla(false)
      })

    return () => {
      active = false
    }
  }, [userLocation])

  // 3. Gyroscope / Device Orientation listener
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading = 0

      // iOS Safari provides webkitCompassHeading directly (0 = North, clockwise)
      if ((e as any).webkitCompassHeading !== undefined && (e as any).webkitCompassHeading !== null) {
        heading = (e as any).webkitCompassHeading
        setHasGyroSensor(true)
      } else if (e.alpha !== null) {
        // Android / Chrome: alpha is rotation around z-axis
        heading = (360 - e.alpha) % 360
        setHasGyroSensor(true)
      }

      setDeviceHeading(Math.round(heading))
    }

    window.addEventListener('deviceorientation', handleOrientation, true)
    window.addEventListener('deviceorientationabsolute' as any, handleOrientation, true)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true)
      window.removeEventListener('deviceorientationabsolute' as any, handleOrientation, true)
    }
  }, [])

  // Request motion permission for iOS
  const requestGyroPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const state = await (DeviceOrientationEvent as any).requestPermission()
        if (state === 'granted') {
          toast.success('Sensor gyroscope diaktifkan!')
          setHasGyroSensor(true)
        } else {
          toast.error('Izin sensor gerak tidak diberikan.')
        }
      } catch (err: any) {
        toast.error('Gagal meminta izin sensor gerak: ' + err.message)
      }
    } else {
      toast.info('Sensor gerak aktif secara otomatis pada perangkat ini.')
    }
  }

  // Haptic feedback when aligning with Qibla
  useEffect(() => {
    if (isAlignedWithQibla && navigator.vibrate) {
      try {
        navigator.vibrate(30)
      } catch {
        // Ignore vibration errors if disabled
      }
    }
  }, [isAlignedWithQibla])

  // 4. Async Fetch Nearby Masjids & Synchronous Leaflet Marker Addition
  const handleFetchNearbyMasjids = async () => {
    setIsMapOpen(true)
    setIsLoadingMasjids(true)
    setSelectedMasjidId(null)

    try {
      const results = await qiblaService.getNearbyMasjids(userLocation.lat, userLocation.lng, 5000)
      setMasjids(results)

      // Synchronously populate markers into Leaflet
      syncAddMarkersToMap(results, userLocation.lat, userLocation.lng)

      toast.success(`Ditemukan ${results.length} masjid & musholla terdekat!`)
    } catch (err) {
      console.error(err)
      toast.error('Gagal mengambil daftar masjid dari API.')
    } finally {
      setIsLoadingMasjids(false)
    }
  }

  // Synchronous marker addition logic into Leaflet map instance
  const syncAddMarkersToMap = (
    items: MasjidItem[],
    uLat: number,
    uLng: number,
    selectedId?: string | null
  ) => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return

    const layer = markersLayerRef.current
    layer.clearLayers()
    markersMapRef.current = {}

    // Add User location marker
    const userMarker = L.marker([uLat, uLng], {
      icon: createUserMarkerIcon(),
      zIndexOffset: 1000,
    }).bindPopup(`
      <div style="font-family: inherit; font-size: 12px; color: #172B3A; padding: 2px;">
        <b style="color: #123B5D;">Lokasi Anda Saat Ini</b>
        <p style="margin: 2px 0 0; color: #7B8794; font-size: 11px;">Akurasi GPS Aktif</p>
      </div>
    `)
    userMarker.addTo(layer)
    userMarkerRef.current = userMarker

    const bounds = L.latLngBounds([uLat, uLng], [uLat, uLng])

    // SINKRONUS: iterasi masjid dan tambahkan marker ke map secara langsung
    items.forEach((m) => {
      const [mLat, mLng] = m.coordinates
      bounds.extend([mLat, mLng])

      const isSel = m.id === selectedId
      const marker = L.marker([mLat, mLng], {
        icon: createMosqueMarkerIcon(isSel),
      })

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; color: #172B3A; min-width: 170px;">
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
            <span style="background: #EBF3F8; color: #123B5D; font-size: 9px; font-weight: bold; padding: 1px 6px; border-radius: 4px;">Masjid</span>
          </div>
          <b style="color: #123B5D; font-size: 13px; line-height: 1.2; display: block;">${m.name}</b>
          <p style="margin: 4px 0 6px; color: #7B8794; font-size: 11px; line-height: 1.3;">${m.address}</p>
          <div style="font-weight: bold; color: #2E9D70; font-size: 11px;">
            📍 ${(m.distanceKm ?? 0).toFixed(2)} km dari Anda
          </div>
        </div>
      `)

      marker.on('click', () => {
        setSelectedMasjidId(m.id)
      })

      marker.addTo(layer)
      markersMapRef.current[m.id] = marker
    })

    // Fit map bounds smoothly
    mapInstanceRef.current.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 16,
      animate: true,
    })
  }

  // Initialize Leaflet map on container mount
  useEffect(() => {
    if (!isMapOpen || !mapContainerRef.current) return

    // Avoid duplicate initialization
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 14,
        zoomControl: false,
      })

      // Add zoom control to top-right
      L.control.zoom({ position: 'topright' }).addTo(map)

      // OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Initialize layer group for synchronous markers
      const markersLayer = L.layerGroup().addTo(map)
      markersLayerRef.current = markersLayer
      mapInstanceRef.current = map

      // If masjids already exist, add them synchronously
      if (masjids.length > 0) {
        syncAddMarkersToMap(masjids, userLocation.lat, userLocation.lng, selectedMasjidId)
      } else {
        // Otherwise trigger fetch
        qiblaService
          .getNearbyMasjids(userLocation.lat, userLocation.lng, 5000)
          .then((results) => {
            setMasjids(results)
            syncAddMarkersToMap(results, userLocation.lat, userLocation.lng)
          })
      }
    } else {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize()
      }, 200)
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isMapOpen])

  // Pan to selected masjid on card click
  const handleSelectMasjid = (m: MasjidItem) => {
    setSelectedMasjidId(m.id)
    if (mapInstanceRef.current && markersMapRef.current[m.id]) {
      const marker = markersMapRef.current[m.id]
      mapInstanceRef.current.flyTo(m.coordinates, 16, { animate: true, duration: 1 })
      marker.openPopup()
    }
  }

  // Compass cardinal text helper
  const getCardinalDirection = (deg: number) => {
    const directions = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL']
    const idx = Math.round(deg / 45) % 8
    return directions[idx]
  }

  return (
    <div className="p-4 space-y-4 bg-[#F7F9FC] min-h-screen pb-28">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2E9D70] animate-pulse"></span>
            <span className="text-[10px] font-bold text-[#2878A5] uppercase tracking-wider">
              AyoTrip Ibadah & Navigasi
            </span>
          </div>
          <h1 className="text-lg font-black text-[#172B3A] flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#123B5D]" />
            Kompas Kiblat & Masjid
          </h1>
        </div>

        <Link
          to="/"
          className="text-xs font-bold text-[#123B5D] bg-white border border-[#E7ECF0] px-3 py-1.5 rounded-full shadow-xs hover:bg-[#F7F9FC]"
        >
          Beranda
        </Link>
      </div>

      {/* 2. Location Banner Card */}
      <Card className="border-[#E7ECF0] bg-white rounded-2xl shadow-xs overflow-hidden">
        <CardContent className="p-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EBF3F8] text-[#123B5D] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-[#2878A5]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-[#172B3A] truncate">{locationName}</p>
              <p className="text-[10px] text-[#7B8794]">
                Jarak ke Ka'bah: <strong className="text-[#123B5D]">{distanceToKabah.toLocaleString('id-ID')} km</strong>
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={requestCurrentLocation}
            disabled={isLocating}
            className="h-8 px-2.5 rounded-xl border-[#E7ECF0] text-xs font-bold text-[#123B5D] shrink-0 gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">GPS</span>
          </Button>
        </CardContent>
      </Card>

      {/* 3. Main Compass Widget */}
      <Card
        className={`border transition-all duration-300 rounded-3xl overflow-hidden shadow-sm ${
          isAlignedWithQibla
            ? 'border-[#2E9D70] bg-gradient-to-b from-white to-[#E8F8F1]'
            : 'border-[#E7ECF0] bg-white'
        }`}
      >
        <CardContent className="p-5 flex flex-col items-center justify-center space-y-4 relative">
          {/* Alignment Banner */}
          {isAlignedWithQibla ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2E9D70] text-white text-xs font-bold shadow-sm animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>TEPAT MENGHADAP KA'BAH!</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3F8] text-[#123B5D] text-xs font-semibold border border-[#2878A5]/25">
              <Navigation className="w-3.5 h-3.5 text-[#2878A5] transform rotate-45" />
              <span>
                Putar HP {headingDiff > 0 ? 'ke kiri' : 'ke kanan'} {Math.abs(Math.round(headingDiff))}°
              </span>
            </div>
          )}

          {/* Compass Dial Outer Ring */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* Top Phone Direction Indicator Arrow (Fixed at 12 o'clock) */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
              <div
                className={`w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[12px] shadow-sm ${
                  isAlignedWithQibla ? 'border-t-[#2E9D70]' : 'border-t-[#123B5D]'
                }`}
              />
            </div>

            {/* Rotating Compass Dial (Rotates negatively with device heading) */}
            <div
              className="w-full h-full rounded-full border-4 border-[#E7ECF0] shadow-inner bg-gradient-to-br from-[#FAFCFF] to-[#EDF3F8] relative transition-transform duration-100 ease-out flex items-center justify-center"
              style={{
                transform: `rotate(${-currentHeading}deg)`,
              }}
            >
              {/* Cardinal Point Labels on the Rotating Dial */}
              <span className="absolute top-2 font-black text-xs text-[#D9534F]">U (N)</span>
              <span className="absolute bottom-2 font-bold text-xs text-[#7B8794]">S</span>
              <span className="absolute right-2 font-bold text-xs text-[#7B8794]">T (E)</span>
              <span className="absolute left-2 font-bold text-xs text-[#7B8794]">B (W)</span>

              {/* Sub-cardinals */}
              <span className="absolute top-9 right-9 text-[9px] font-semibold text-[#7B8794]/70">TL</span>
              <span className="absolute bottom-9 right-9 text-[9px] font-semibold text-[#7B8794]/70">TG</span>
              <span className="absolute bottom-9 left-9 text-[9px] font-semibold text-[#7B8794]/70">BD</span>
              <span className="absolute top-9 left-9 text-[9px] font-semibold text-[#7B8794]/70">BL</span>

              {/* Radial Degree Ticks */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-full flex justify-center pointer-events-none"
                  style={{ transform: `rotate(${i * 30}deg)` }}
                >
                  <div
                    className={`w-0.5 rounded-full ${
                      i === 0 ? 'h-3.5 bg-[#D9534F]' : 'h-2 bg-[#7B8794]/40'
                    }`}
                  />
                </div>
              ))}

              {/* LOGO MASJID / KA'BAH UNTUK MENENTUKAN LOKASI KA'BAH (ASYNC DARI ALADHAN) */}
              {/* Located at qiblaDirection angle on the dial */}
              <div
                className="absolute w-full h-full flex flex-col items-center pointer-events-none z-10"
                style={{ transform: `rotate(${qiblaDirection}deg)` }}
              >
                {/* Pointer line leading to Ka'bah marker */}
                <div
                  className={`w-0.5 h-14 ${
                    isAlignedWithQibla ? 'bg-[#2E9D70]' : 'bg-[#F4A340]'
                  } shadow-xs mt-3`}
                />

                {/* LOGO MASJID & KA'BAH BADGE */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg border-2 transition-transform ${
                    isAlignedWithQibla
                      ? 'bg-[#2E9D70] border-white text-white scale-110 ring-4 ring-[#2E9D70]/30'
                      : 'bg-[#123B5D] border-[#F4A340] text-[#F4A340]'
                  }`}
                  style={{ transform: `rotate(${-qiblaDirection + currentHeading}deg)` }}
                  title="Arah Ka'bah / Qibla"
                >
                  {/* Mosque & Crescent Icon */}
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2a1 1 0 0 1 1 1v1.07A7.002 7.002 0 0 1 19 11v1h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h1v-1a7.002 7.002 0 0 1 6-6.93V3a1 1 0 0 1 1-1zm0 4a5 5 0 0 0-5 5v1h10v-1a5 5 0 0 0-5-5zm-2 10v4h4v-4a2 2 0 1 0-4 0z" />
                  </svg>
                </div>

                <span
                  className="text-[9px] font-black mt-1 px-1.5 py-0.2 rounded bg-black/70 text-[#F4A340] backdrop-blur-xs"
                  style={{ transform: `rotate(${-qiblaDirection + currentHeading}deg)` }}
                >
                  KIBLAT
                </span>
              </div>

              {/* Center Readout Circle */}
              <div className="w-24 h-24 rounded-full bg-white shadow-md border border-[#E7ECF0] flex flex-col items-center justify-center z-10">
                <span className="text-xl font-black text-[#123B5D] leading-none">
                  {currentHeading}°
                </span>
                <span className="text-[10px] font-bold text-[#7B8794] mt-0.5 uppercase tracking-wide">
                  {getCardinalDirection(currentHeading)}
                </span>
              </div>
            </div>
          </div>

          {/* Qibla Direction & Status Info */}
          <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-[#E7ECF0] text-center">
            <div className="p-2 rounded-xl bg-[#F7F9FC] border border-[#E7ECF0]">
              <span className="text-[10px] text-[#7B8794] block">Derajat Kiblat</span>
              {isLoadingQibla ? (
                <Skeleton className="h-4 w-16 mx-auto mt-1" />
              ) : (
                <span className="text-sm font-black text-[#123B5D]">
                  {qiblaDirection.toFixed(1)}°
                </span>
              )}
            </div>

            <div className="p-2 rounded-xl bg-[#F7F9FC] border border-[#E7ECF0]">
              <span className="text-[10px] text-[#7B8794] block">Arah Hadap HP</span>
              <span className="text-sm font-black text-[#172B3A]">
                {currentHeading}° {getCardinalDirection(currentHeading)}
              </span>
            </div>
          </div>

          {/* Gyro Sensor / Simulation Controls */}
          <div className="w-full flex items-center justify-between text-xs pt-1">
            <button
              onClick={requestGyroPermission}
              className="text-[11px] font-bold text-[#2878A5] hover:underline flex items-center gap-1"
            >
              <Radio className="w-3.5 h-3.5" />
              {hasGyroSensor ? 'Sensor Gyro Aktif' : 'Aktifkan Sensor HP'}
            </button>

            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className="text-[11px] font-bold text-[#7B8794] hover:text-[#172B3A] flex items-center gap-1"
            >
              <Sliders className="w-3 h-3" />
              {isSimulating ? 'Gunakan Sensor Asli' : 'Simulasi Putar'}
            </button>
          </div>

          {/* Manual Slider if Simulating or on Desktop */}
          {isSimulating && (
            <div className="w-full p-3 rounded-2xl bg-[#EBF3F8] border border-[#2878A5]/20 space-y-1.5 animate-in fade-in">
              <div className="flex justify-between text-[11px] font-bold text-[#123B5D]">
                <span>Uji Simulasi Putaran HP:</span>
                <span>{simulatedHeading}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={simulatedHeading}
                onChange={(e) => setSimulatedHeading(Number(e.target.value))}
                className="w-full accent-[#123B5D] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#7B8794]">
                <button onClick={() => setSimulatedHeading(0)} className="hover:underline">0° U</button>
                <button onClick={() => setSimulatedHeading(Math.round(qiblaDirection))} className="text-[#2E9D70] font-bold hover:underline">
                  {Math.round(qiblaDirection)}° (Kiblat)
                </button>
                <button onClick={() => setSimulatedHeading(180)} className="hover:underline">180° S</button>
                <button onClick={() => setSimulatedHeading(360)} className="hover:underline">360°</button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. BUTTON "Tampilkan Masjid Terdekat" (Interactive Leaflet + OSM Map) */}
      <div className="space-y-3">
        <Button
          onClick={handleFetchNearbyMasjids}
          disabled={isLoadingMasjids}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#123B5D] via-[#1A4E78] to-[#2878A5] hover:opacity-95 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <MapIcon className="w-4 h-4 text-[#F4A340]" />
          <span>
            {isLoadingMasjids
              ? 'Mencari Masjid Terdekat...'
              : 'Tampilkan Masjid Terdekat (Peta Leaflet)'}
          </span>
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* MAP & MASJID LIST VIEW (When triggered) */}
        {isMapOpen && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Map Container Card */}
            <Card className="border-[#E7ECF0] bg-white rounded-3xl overflow-hidden shadow-sm">
              <div className="p-3.5 bg-white border-b border-[#E7ECF0] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#172B3A] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#2E9D70]" />
                    Peta Masjid Terdekat (OpenStreetMap)
                  </h3>
                  <p className="text-[11px] text-[#7B8794]">
                    Menampilkan {masjids.length} lokasi masjid di sekitar radius 5 km
                  </p>
                </div>

                <Badge className="bg-[#EBF3F8] text-[#123B5D] border border-[#2878A5]/25 text-[10px]">
                  OSM + Leaflet
                </Badge>
              </div>

              {/* The Leaflet Map DOM Element */}
              <div
                ref={mapContainerRef}
                className="w-full h-72 sm:h-80 z-0 bg-[#E7ECF0]"
                style={{ minHeight: '280px' }}
              />

              <div className="p-2.5 bg-[#F7F9FC] border-t border-[#E7ECF0] flex items-center justify-between text-[11px] text-[#7B8794]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#123B5D] border border-white"></span>
                  Pin Masjid
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2878A5] border border-white ml-2"></span>
                  Lokasi Anda
                </span>

                <button
                  onClick={() => {
                    if (mapInstanceRef.current && userMarkerRef.current) {
                      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 15)
                      userMarkerRef.current.openPopup()
                    }
                  }}
                  className="font-bold text-[#123B5D] hover:underline"
                >
                  Pusatkan ke Saya
                </button>
              </div>
            </Card>

            {/* List of Masjids retrieved from API */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#172B3A] uppercase tracking-wider">
                  Daftar Masjid Terdekat ({masjids.length})
                </h4>
                <span className="text-[10px] text-[#7B8794]">Ketuk untuk fokus di peta</span>
              </div>

              {isLoadingMasjids ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-2xl bg-white" />
                  ))}
                </div>
              ) : masjids.length > 0 ? (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {masjids.map((m) => {
                    const isSelected = m.id === selectedMasjidId
                    return (
                      <div
                        key={m.id}
                        onClick={() => handleSelectMasjid(m)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#EBF3F8] border-[#123B5D] shadow-xs'
                            : 'bg-white border-[#E7ECF0] hover:border-[#2878A5]/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-[#123B5D] text-[#F4A340]'
                                : 'bg-[#F7F9FC] text-[#2878A5] border border-[#E7ECF0]'
                            }`}
                          >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2a1 1 0 0 1 1 1v1.07A7.002 7.002 0 0 1 19 11v1h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h1v-1a7.002 7.002 0 0 1 6-6.93V3a1 1 0 0 1 1-1zm0 4a5 5 0 0 0-5 5v1h10v-1a5 5 0 0 0-5-5zm-2 10v4h4v-4a2 2 0 1 0-4 0z" />
                            </svg>
                          </div>

                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-[#172B3A] truncate">
                              {m.name}
                            </h5>
                            <p className="text-[11px] text-[#7B8794] truncate">
                              {m.address}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-[#2E9D70] block">
                            {(m.distanceKm ?? 0).toFixed(2)} km
                          </span>
                          <span className="text-[10px] text-[#2878A5] font-semibold flex items-center gap-0.5 justify-end">
                            Peta <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-6 text-center bg-white rounded-2xl border border-[#E7ECF0] text-xs text-[#7B8794]">
                  Belum ada data masjid di sekitar area ini.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 5. AlAdhan Official Compass Image Preview (Expandable) */}
      <Card className="border-[#E7ECF0] bg-white rounded-2xl shadow-xs overflow-hidden">
        <div
          onClick={() => setShowAladhanCompass(!showAladhanCompass)}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#F7F9FC]"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#2878A5]" />
            <span className="text-xs font-bold text-[#172B3A]">
              Lihat Kompas Resmi AlAdhan API
            </span>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-[#7B8794] transition-transform ${
              showAladhanCompass ? 'rotate-90' : ''
            }`}
          />
        </div>

        {showAladhanCompass && (
          <CardContent className="p-4 pt-0 border-t border-[#E7ECF0] space-y-3">
            <p className="text-[11px] text-[#7B8794]">
              Visualisasi kompas kiblat yang digenerate langsung oleh server AlAdhan:
            </p>
            <div className="flex justify-center bg-[#F7F9FC] p-3 rounded-2xl border border-[#E7ECF0]">
              <img
                src={qiblaService.getCompassImageUrl(userLocation.lat, userLocation.lng)}
                alt="Aladhan Qibla Compass"
                className="w-48 h-48 object-contain"
                loading="lazy"
              />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
