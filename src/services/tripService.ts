export type TripCategory = 
  | 'Alam' 
  | 'Pantai' 
  | 'Gunung' 
  | 'Budaya' 
  | 'Bahari' 
  | 'Beach' 
  | 'Mountain' 
  | 'Culture' 
  | 'Adventure'

export interface ItineraryItem {
  time: string
  activity: string
  locationName: string
  estimatedTravel?: string
  notes?: string
  isHighlight?: boolean
  costEstimated?: number
}

export interface ItineraryDay {
  day: number
  title: string
  description: string
  items: ItineraryItem[]
  extraCosts?: { item: string; cost: number }[]
}

export interface VendorInfo {
  name: string
  logo: string
  verified: boolean
  rating: number
  tripsHandled: number
  joinedYear: string
  phone?: string
  responseRate: string
}

export interface TripReview {
  id: string
  userName: string
  userAvatar: string
  rating: number
  date: string
  comment: string
  helpfulCount: number
}

export interface Trip {
  id: string
  title: string
  destination: string
  province: string
  category: TripCategory
  price: number
  originalPrice?: number
  discountPercent?: number
  rating: number
  reviewsCount: number
  imageUrl: string
  photos: string[]
  duration: string
  durationDays: number
  departureCity: string
  departureLocation: {
    title: string
    address: string
    mapCoordinates?: string
    notes?: string
  }
  departureDates: string[]
  minParticipants: number
  maxParticipants: number
  description: string
  highlights: string[]
  vendor: VendorInfo
  itinerary: ItineraryDay[]
  facilitiesIncluded: string[]
  facilitiesExcluded: string[]
  cancellationPolicy: {
    summary: string
    rules: string[]
  }
  reviews: TripReview[]
  isRecommended?: boolean
  isTrending?: boolean
  isPopular?: boolean
  distanceKm?: number
  packageType?: 'Open Trip' | 'Private Trip' | 'Family Trip'
  slotsLeft?: number
  viewersCount?: number
  facilities?: string[]
}

export interface PromoBanner {
  id: string
  title: string
  subtitle: string
  tag: string
  discount: string
  promoCode: string
  validUntil: string
  gradient: string
  imageUrl: string
  tripTargetId?: string
}

export interface Destination {
  id: string
  name: string
  city: string
  province: string
  category: TripCategory
  imageUrl: string
  rating: number
  tripCount: number
  distanceKm: number
  startingPrice: number
  isPopular: boolean
  tag: string
  linkedTripId: string
}

export interface CategoryInfo {
  id: string
  name: string
  label: string
  icon: string
  badgeText: string
  description: string
}

export const CATEGORIES_LIST: CategoryInfo[] = [
  { id: 'All', name: 'Semua', label: 'Semua', icon: 'Sparkles', badgeText: 'All', description: 'Semua pilihan wisata' },
  { id: 'Alam', name: 'Alam', label: 'Wisata Alam', icon: 'Trees', badgeText: 'Eco', description: 'Hutan, air terjun & lembah hijau' },
  { id: 'Pantai', name: 'Pantai', label: 'Pantai & Pulau', icon: 'Palmtree', badgeText: 'Pesisir', description: 'Pasir putih, sunset & bahari' },
  { id: 'Gunung', name: 'Gunung', label: 'Pegunungan', icon: 'Mountain', badgeText: 'Sunrise', description: 'Trekking puncak & kawah eksotis' },
  { id: 'Budaya', name: 'Budaya', label: 'Budaya & Adat', icon: 'Landmark', badgeText: 'Heritage', description: 'Candi kuno, desa adat & sejarah' },
  { id: 'Bahari', name: 'Bahari', label: 'Bawah Laut', icon: 'Fish', badgeText: 'Diving', description: 'Diving, snorkeling & terumbu karang' },
]

export const DEPARTURE_CITIES = [
  'Semua Kota',
  'Jakarta',
  'Surabaya',
  'Bali / Denpasar',
  'Yogyakarta',
  'Labuan Bajo',
  'Bandung',
  'Malang'
]

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'promo-1',
    title: 'Diskon Spesial Liburan Bahari',
    subtitle: 'Hemat sampai 35% untuk trip Labuan Bajo & Raja Ampat',
    tag: 'FLASH SALE',
    discount: '35% OFF',
    promoCode: 'AYOBAHARI35',
    validUntil: '31 Okt 2026',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    tripTargetId: 'trip-1'
  },
  {
    id: 'promo-2',
    title: 'Sunrise Bromo & Ijen Expedition',
    subtitle: 'Cashback Rp 250.000 + Gratis Dokumentasi Drone',
    tag: 'EARLY BIRD',
    discount: 'HEMAT 250RB',
    promoCode: 'BROMOSERU',
    validUntil: '15 Nov 2026',
    gradient: 'from-amber-600 via-orange-600 to-rose-700',
    imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
    tripTargetId: 'trip-3'
  },
  {
    id: 'promo-3',
    title: 'Pesona Budaya Jogja & Borobudur',
    subtitle: 'Voucher Menginap Hotel Bintang 4 untuk 2 Orang',
    tag: 'WEEKEND DEAL',
    discount: 'POTONGAN 20%',
    promoCode: 'JOGJAHEMAT',
    validUntil: '10 Des 2026',
    gradient: 'from-purple-600 via-indigo-600 to-slate-900',
    imageUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
    tripTargetId: 'trip-5'
  }
]

export const DESTINATIONS_LIST: Destination[] = [
  {
    id: 'dest-1',
    name: 'Pulau Padar & Pink Beach',
    city: 'Labuan Bajo',
    province: 'Nusa Tenggara Timur',
    category: 'Bahari',
    imageUrl: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    tripCount: 42,
    distanceKm: 1420,
    startingPrice: 4850000,
    isPopular: true,
    tag: 'Terpopuler #1',
    linkedTripId: 'trip-1'
  },
  {
    id: 'dest-2',
    name: 'Kelingking & Angel Billabong',
    city: 'Nusa Penida',
    province: 'Bali',
    category: 'Pantai',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    tripCount: 68,
    distanceKm: 980,
    startingPrice: 1750000,
    isPopular: true,
    tag: 'Viral Spot',
    linkedTripId: 'trip-2'
  },
  {
    id: 'dest-3',
    name: 'Kawah Bromo & Pasir Berbisik',
    city: 'Probolinggo',
    province: 'Jawa Timur',
    category: 'Gunung',
    imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    tripCount: 54,
    distanceKm: 690,
    startingPrice: 1250000,
    isPopular: true,
    tag: 'Favorite Sunrise',
    linkedTripId: 'trip-3'
  },
  {
    id: 'dest-4',
    name: 'Candi Borobudur & Prambanan',
    city: 'Magelang & Sleman',
    province: 'D.I. Yogyakarta',
    category: 'Budaya',
    imageUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    tripCount: 38,
    distanceKm: 450,
    startingPrice: 1400000,
    isPopular: true,
    tag: 'Situs Warisan UNESCO',
    linkedTripId: 'trip-5'
  },
  {
    id: 'dest-near-1',
    name: 'Pulau Pari & Pasir Perawan',
    city: 'Kepulauan Seribu',
    province: 'DKI Jakarta',
    category: 'Pantai',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    tripCount: 24,
    distanceKm: 18.5,
    startingPrice: 420000,
    isPopular: false,
    tag: '18 km • Dekat Kamu',
    linkedTripId: 'trip-near-1'
  },
  {
    id: 'dest-near-2',
    name: 'Curug Cilember & Kebun Teh',
    city: 'Puncak, Bogor',
    province: 'Jawa Barat',
    category: 'Alam',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    tripCount: 31,
    distanceKm: 46.2,
    startingPrice: 350000,
    isPopular: false,
    tag: '46 km • Hawa Sejuk',
    linkedTripId: 'trip-near-2'
  },
  {
    id: 'dest-near-3',
    name: 'Kawah Putih & Rancabali',
    city: 'Ciwidey, Bandung',
    province: 'Jawa Barat',
    category: 'Gunung',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    tripCount: 29,
    distanceKm: 135.0,
    startingPrice: 650000,
    isPopular: false,
    tag: '135 km • Weekend Getaway',
    linkedTripId: 'trip-near-3'
  }
]

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    title: 'Labuan Bajo & Komodo Dragon Cruise',
    destination: 'Labuan Bajo',
    province: 'Nusa Tenggara Timur',
    category: 'Bahari',
    price: 4850000,
    originalPrice: 6200000,
    discountPercent: 22,
    rating: 4.9,
    reviewsCount: 320,
    imageUrl: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    ],
    duration: '3D2N',
    durationDays: 3,
    departureCity: 'Labuan Bajo',
    departureLocation: {
      title: 'Pelabuhan Marina Labuan Bajo',
      address: 'Jl. Soekarno Hatta, Labuan Bajo, Kec. Komodo, Manggarai Barat, NTT',
      mapCoordinates: '-8.4908, 119.8821',
      notes: 'Kumpul di Dermaga 2 dekat kantor Syahbandar pukul 08:00 WITA.'
    },
    departureDates: ['2026-11-05', '2026-11-12', '2026-11-19', '2026-11-26', '2026-12-05'],
    minParticipants: 2,
    maxParticipants: 16,
    description: 'Jelajahi keindahan gugusan pulau Labuan Bajo, berlayar di atas kapal Phinisi ber-AC, trekking di Pulau Padar untuk panorama tiga warna pantai, snorkeling bersama ikan pari Manta, dan bertemu satwa purba Komodo.',
    highlights: ['Sailing Kapal Phinisi AC', 'Trekking Pulau Padar Sunrise', 'Snorkeling Pink Beach', 'Komodo Encounter di Rinca', 'Manta Point Diving'],
    vendor: {
      name: 'Nusantara Phinisi Liveaboard',
      logo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      verified: true,
      rating: 4.9,
      tripsHandled: 840,
      joinedYear: '2021',
      phone: '+62 813-8899-7711',
      responseRate: '100% Cepat'
    },
    itinerary: [
      {
        day: 1,
        title: 'Penjemputan, Pulau Kelor & Sunset Pulau Kalong',
        description: 'Mulai petualangan berlayar dari Labuan Bajo menuju Pulau Kelor dan menyaksikan ribuan kelelawar terbang saat senja.',
        items: [
          { time: '08:30 - 09:30', activity: 'Registrasi & Briefing di Pelabuhan Marina', locationName: 'Pelabuhan Marina Labuan Bajo', estimatedTravel: '30 menit', isHighlight: false },
          { time: '10:00 - 12:30', activity: 'Trekking puncak Pulau Kelor & Snorkeling', locationName: 'Pulau Kelor', estimatedTravel: '45 menit kapal', isHighlight: true },
          { time: '13:00 - 14:30', activity: 'Makan siang fresh seafood di atas Phinisi', locationName: 'Kapal Phinisi Lounge', estimatedTravel: '-', isHighlight: false },
          { time: '15:00 - 17:30', activity: 'Menyusuri pantai Pulau Manjarite', locationName: 'Pulau Manjarite', estimatedTravel: '40 menit', isHighlight: false },
          { time: '18:00 - 19:30', activity: 'Sunset eksotis ribuan kelelawar Pulau Kalong', locationName: 'Pulau Kalong', estimatedTravel: '30 menit', isHighlight: true }
        ],
        extraCosts: [{ item: 'Sewa fin snorkeling pribadi ukuran khusus', cost: 50000 }]
      },
      {
        day: 2,
        title: 'Pulau Padar, Pink Beach & Komodo Dragon',
        description: 'Hari utama menjelajahi ikon dunia: Puncak Padar, pasir merah muda Pantai Pink, dan habitat asli Komodo.',
        items: [
          { time: '05:00 - 07:30', activity: 'Sunrise Trekking Puncak Pulau Padar (Foto Ikonik)', locationName: 'Pulau Padar Peak', estimatedTravel: '20 menit jalan setapak', isHighlight: true },
          { time: '08:30 - 10:30', activity: 'Santai & Snorkeling Terumbu Karang Pink Beach', locationName: 'Pink Beach', estimatedTravel: '35 menit kapal', isHighlight: true },
          { time: '11:00 - 13:00', activity: 'Trekking dipandu Ranger bertemu Komodo liar', locationName: 'Taman Nasional Komodo (Pulau Rinca)', estimatedTravel: '45 menit kapal', isHighlight: true },
          { time: '14:30 - 16:30', activity: 'Snorkeling mencari Ikan Pari Manta di Manta Point', locationName: 'Manta Point', estimatedTravel: '30 menit', isHighlight: true },
          { time: '17:00 - 18:30', activity: 'Berfoto di pasir timbul Taka Makassar', locationName: 'Taka Makassar Atoll', estimatedTravel: '15 menit', isHighlight: false }
        ],
        extraCosts: [{ item: 'Tip opsional Ranger Komodo lokal', cost: 50000 }]
      },
      {
        day: 3,
        title: 'Pulau Kanawa & Perjalanan Kembali',
        description: 'Snorkeling santai di dermaga bening Pulau Kanawa sebelum kembali berlabuh ke Labuan Bajo.',
        items: [
          { time: '07:30 - 09:30', activity: 'Sarapan & Snorkeling terumbu karang Kanawa', locationName: 'Pulau Kanawa Pier', estimatedTravel: '1 jam kapal', isHighlight: true },
          { time: '10:30 - 12:00', activity: 'Sailing kembali ke Pelabuhan Marina Labuan Bajo', locationName: 'Pelabuhan Marina Labuan Bajo', estimatedTravel: '1 jam 30 menit', isHighlight: false },
          { time: '12:30 - 13:30', activity: 'Drop-off ke Bandara Komodo / Hotel masing-masing', locationName: 'Bandara Komodo (LBJ)', estimatedTravel: '15 menit mobil', isHighlight: false }
        ]
      }
    ],
    facilitiesIncluded: [
      'Kapal Phinisi AC Kamar Tidur & Kamar Mandi Dalam',
      'Makan 3x Sehari (Menu Nusantara & Western Chef)',
      'Air Mineral, Teh & Kopi Sepuasnya',
      'Peralatan Snorkeling Lengkap (Masker & Snorkel)',
      'Life Jacket / Pelampung Keselamatan Standar SOLAS',
      'Tour Leader Berpengalaman & Lisensi HPI',
      'Dokumentasi Foto & Video Drone HD',
      'Asuransi Perjalanan Laut Jasa Raharja'
    ],
    facilitiesExcluded: [
      'Tiket Pesawat PP dari Kota Asal ke Labuan Bajo',
      'Tiket Masuk Taman Nasional Komodo (WNI: Rp 250.000 / WNA: Rp 500.000)',
      'Tipping Sukarela untuk Crew Kapal & Ranger',
      'Pengeluaran Pribadi (Camilan tambahan, alkohol, suvenir)'
    ],
    cancellationPolicy: {
      summary: 'Garansi Pengembalian Fleksibel',
      rules: [
        'Pembatalan s/d 14 hari sebelum keberangkatan: Pengembalian dana 100%.',
        'Pembatalan 7-13 hari sebelum keberangkatan: Pengembalian dana 50%.',
        'Pembatalan kurang dari 7 hari: Dana hangus (namun dapat dialihkan ke peserta lain).',
        'Pembatalan akibat cuaca ekstrem / penutupan resmi otoritas TN Komodo: Reschedule 100% gratis.'
      ]
    },
    reviews: [
      {
        id: 'rev-1',
        userName: 'Ahmad Fauzi',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: '18 Oktober 2026',
        comment: 'Luar biasa! Kapal Phinisi-nya bersih, makanan chef di atas kapal enak banget, dan sunrise di Pulau Padar bener-bener magis. Rekomendasi banget!',
        helpfulCount: 38
      },
      {
        id: 'rev-2',
        userName: 'Nadya Larasati',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: '12 Oktober 2026',
        comment: 'Ketemu 4 manta ray besar waktu snorkeling di Manta Point! Guide Mas Ricky profesional dan jago motret drone.',
        helpfulCount: 24
      }
    ],
    isRecommended: true,
    isTrending: true,
    isPopular: true,
    distanceKm: 1420,
    packageType: 'Open Trip',
    slotsLeft: 4,
    viewersCount: 148,
    facilities: ['Kapal Phinisi AC', 'Makan 3x Sehari', 'Guide Berlisensi', 'Alat Snorkeling']
  },
  {
    id: 'trip-2',
    title: 'Bali Nusa Penida Island Gateway',
    destination: 'Nusa Penida',
    province: 'Bali',
    category: 'Pantai',
    price: 1750000,
    originalPrice: 2200000,
    discountPercent: 20,
    rating: 4.8,
    reviewsCount: 512,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    duration: '2D1N',
    durationDays: 2,
    departureCity: 'Bali / Denpasar',
    departureLocation: {
      title: 'Pelabuhan Sanur Pantai Sanur',
      address: 'Jl. Hang Tuah No. 45, Sanur Kaja, Denpasar Selatan, Bali',
      notes: 'Kumpul di Counter Fastboat Maruti Express Sanur pukul 07:30 WITA.'
    },
    departureDates: ['2026-11-06', '2026-11-13', '2026-11-20', '2026-11-27'],
    minParticipants: 2,
    maxParticipants: 10,
    description: 'Kunjungi tebing ikonik Kelingking Beach T-Rex, snorkeling bersama ikan pari Manta, Broken Beach dan kolam alami Angel Billabong.',
    highlights: ['Kelingking T-Rex Cliff', 'Broken Beach & Angel Billabong', 'Snorkeling Manta Point', 'Crystal Bay Sunset'],
    vendor: {
      name: 'Dewata Island Explorer',
      logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      verified: true,
      rating: 4.8,
      tripsHandled: 1200,
      joinedYear: '2020',
      responseRate: '98% Cepat'
    },
    itinerary: [
      {
        day: 1,
        title: 'Penida Barat & Sunset Crystal Bay',
        description: 'Menyeberang fastboat menuju Nusa Penida dan eksplorasi tebing Kelingking.',
        items: [
          { time: '07:30 - 08:30', activity: 'Boarding Fastboat Sanur menuju Nusa Penida', locationName: 'Pelabuhan Sanur', estimatedTravel: '45 menit', isHighlight: false },
          { time: '09:30 - 12:00', activity: 'Explore Tebing Kelingking T-Rex & Spot Foto', locationName: 'Kelingking Beach', estimatedTravel: '40 menit mobil', isHighlight: true },
          { time: '12:30 - 13:30', activity: 'Makan siang resto lokal khas Bali', locationName: 'Restoran Penida', estimatedTravel: '-', isHighlight: false },
          { time: '14:00 - 16:00', activity: 'Menyusuri Broken Beach & Angel Billabong', locationName: 'Broken Beach', estimatedTravel: '25 menit', isHighlight: true },
          { time: '16:30 - 18:30', activity: 'Sunset santai di tepi pantai Crystal Bay', locationName: 'Crystal Bay', estimatedTravel: '30 menit', isHighlight: true }
        ]
      },
      {
        day: 2,
        title: 'Snorkeling Manta & Penida Timur',
        description: 'Snorkeling 3 spot utama dan kembali menyeberang ke Bali.',
        items: [
          { time: '08:00 - 11:30', activity: 'Snorkeling Manta Point, Gamat Bay & Wall Bay', locationName: 'Manta Point', estimatedTravel: 'Speedboat lokal', isHighlight: true },
          { time: '12:00 - 13:30', activity: 'Makan siang & Check-out Hotel', locationName: 'Hotel Nusa Penida', estimatedTravel: '-', isHighlight: false },
          { time: '14:30 - 15:30', activity: 'Fastboat kembali ke Sanur Bali', locationName: 'Pelabuhan Sanur', estimatedTravel: '45 menit', isHighlight: false }
        ]
      }
    ],
    facilitiesIncluded: ['Fastboat Tiket PP Sanur-Penida', 'Mobil AC Pribadi di Penida', 'Hotel Bintang 3 AC 1 Malam', 'Driver merangkap Guide & Fotografer', 'Tiket Masuk Seluruh Objek Wisata'],
    facilitiesExcluded: ['Pengeluaran pribadi & makan malam', 'Tipping guide sukarela'],
    cancellationPolicy: {
      summary: 'Pembatalan Mudah',
      rules: ['Pembatalan H-3 pengembalian dana 100%.', 'Pembatalan H-1 pengembalian dana 50%.']
    },
    reviews: [
      {
        id: 'rev-3',
        userName: 'Jessica Miller',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: '05 Oktober 2026',
        comment: 'Driver Mas Wayan sangat ramah dan tahu spot foto terbaik tanpa antre lama. Recommended!',
        helpfulCount: 19
      }
    ],
    isRecommended: true,
    isTrending: false,
    isPopular: true,
    distanceKm: 980,
    packageType: 'Private Trip',
    slotsLeft: 6,
    viewersCount: 92,
    facilities: ['Fastboat PP', 'Mobil Avanza/Innova AC', 'Hotel Bintang 3', 'Tiket Objek Wisata']
  },
  {
    id: 'trip-3',
    title: 'Bromo Golden Sunrise & B29 Peak',
    destination: 'Taman Nasional Bromo Tengger',
    province: 'Jawa Timur',
    category: 'Gunung',
    price: 1250000,
    originalPrice: 1600000,
    discountPercent: 22,
    rating: 4.9,
    reviewsCount: 428,
    imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
    ],
    duration: '2D1N',
    durationDays: 2,
    departureCity: 'Surabaya',
    departureLocation: {
      title: 'Stasiun Gubeng Surabaya / Stasiun Kota Baru Malang',
      address: 'Jl. Gubeng Masjid No. 1, Surabaya, Jawa Timur',
      notes: 'Penjemputan malam hari pukul 23:30 WIB.'
    },
    departureDates: ['2026-11-07', '2026-11-14', '2026-11-21', '2026-11-28'],
    minParticipants: 1,
    maxParticipants: 18,
    description: 'Petualangan jeep 4WD dini hari menyambut matahari terbit spektakuler di Penanjakan Bromo, kawah aktif, Pasir Berbisik, dan Bukit Teletubbies.',
    highlights: ['Sunrise View Penanjakan 1', 'Kawah Aktif Bromo', 'Pasir Berbisik', 'Bukit Teletubbies Savana'],
    vendor: {
      name: 'Bromo Tengger Adventure',
      logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      verified: true,
      rating: 4.9,
      tripsHandled: 2150,
      joinedYear: '2019',
      responseRate: '100% Cepat'
    },
    itinerary: [
      {
        day: 1,
        title: 'Penjemputan Tengah Malam & Menuju Bromo',
        description: 'Meeting point di stasiun/bandara dan perjalanan darat menuju basecamp jeep Sukapura.',
        items: [
          { time: '23:30 - 02:30', activity: 'Penjemputan Surabaya/Malang & Perjalanan ke Sukapura', locationName: 'Basecamp Jeep Bromo', estimatedTravel: '2.5 jam', isHighlight: false }
        ]
      },
      {
        day: 2,
        title: 'Golden Sunrise, Kawah Bromo & Lautan Pasir',
        description: 'Ekspedisi jeep 4WD menyambut matahari terbit dan menjelajahi kawah aktif.',
        items: [
          { time: '03:00 - 05:30', activity: 'Naik Jeep 4WD menuju Puncak Penanjakan 1', locationName: 'Penanjakan 1 Viewpoint', estimatedTravel: '45 menit jeep', isHighlight: true },
          { time: '05:30 - 06:30', activity: 'Menyaksikan Golden Sunrise Bromo & Lautan Awan', locationName: 'Penanjakan 1', estimatedTravel: '-', isHighlight: true },
          { time: '07:00 - 09:00', activity: 'Trekking tangga kawah Bromo & Pura Luhur Poten', locationName: 'Kawah Bromo', estimatedTravel: '20 menit jalan', isHighlight: true },
          { time: '09:30 - 11:00', activity: 'Foto epik jeep di Pasir Berbisik & Savana Teletubbies', locationName: 'Pasir Berbisik', estimatedTravel: '15 menit jeep', isHighlight: true },
          { time: '11:30 - 14:00', activity: 'Sarapan lokal & Pengantaran kembali ke Malang/Surabaya', locationName: 'Stasiun Kota', estimatedTravel: '2.5 jam', isHighlight: false }
        ],
        extraCosts: [{ item: 'Sewa kuda menuju tangga kawah (opsional)', cost: 150000 }]
      }
    ],
    facilitiesIncluded: ['Jeep 4WD Hardtop Tertutup', 'Tiket Masuk Kawasan TNBTS', 'Driver & Guide Jeep Lokal', 'Masker Debu & Snack Pagi', 'Transport Penjemputan AC PP'],
    facilitiesExcluded: ['Sewa kuda di kawah', 'Pengeluaran pribadi'],
    cancellationPolicy: {
      summary: 'Bisa Reschedule',
      rules: ['Pembatalan H-2 pengembalian 100%.', 'Reschedule gratis tanpa biaya tambahan.']
    },
    reviews: [
      {
        id: 'rev-4',
        userName: 'Rian Hidayat',
        userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: '20 Oktober 2026',
        comment: 'Sunrise Bromo juara dunia! Driver jeepnya lihai banget nyetir di pasir kabut. Mantap!',
        helpfulCount: 42
      }
    ],
    isRecommended: true,
    isTrending: true,
    isPopular: true,
    distanceKm: 690,
    packageType: 'Open Trip',
    slotsLeft: 2,
    viewersCount: 215,
    facilities: ['Jeep Hardtop 4x4', 'Homestay Bromo', 'Jaket Hangat Standar', 'Tiket Masuk TNBTS']
  },
  {
    id: 'trip-4',
    title: 'Raja Ampat Misool Underwater Eden',
    destination: 'Kepulauan Misool',
    province: 'Papua Barat Daya',
    category: 'Bahari',
    price: 9200000,
    originalPrice: 11500000,
    discountPercent: 20,
    rating: 5.0,
    reviewsCount: 140,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80'
    ],
    duration: '4D3N',
    durationDays: 4,
    departureCity: 'Sorong',
    departureLocation: {
      title: 'Pelabuhan Rakyat Sorong',
      address: 'Jl. Usahamina, Klademak, Sorong, Papua Barat Daya',
      notes: 'Kumpul pukul 08:30 WIT.'
    },
    departureDates: ['2026-11-10', '2026-11-24', '2026-12-08'],
    minParticipants: 4,
    maxParticipants: 12,
    description: 'Surga bawah laut terkaya di dunia dengan laguna karst toska, terumbu karang warna-warni, serta gua keramat goa tengkorak.',
    highlights: ['Laguna Karst Misool', 'Snorkeling Ubur-ubur Jinak', 'Batu Cinta Heart Lagoon'],
    vendor: {
      name: 'Papua Paradise Tour',
      logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      verified: true,
      rating: 5.0,
      tripsHandled: 420,
      joinedYear: '2018',
      responseRate: '100% Cepat'
    },
    itinerary: [
      {
        day: 1,
        title: 'Penjemputan Sorong & Menuju Misool',
        description: 'Speedboat cepat membelah lautan menuju resort Misool.',
        items: [
          { time: '09:00 - 13:00', activity: 'Speedboat Sorong ke Misool', locationName: 'Perairan Misool', isHighlight: true }
        ]
      },
      {
        day: 2,
        title: 'Danau Ubur-ubur & Karst Heart Lagoon',
        description: 'Berenang bersama ubur-ubur tanpa sengat di laguna air asin.',
        items: [
          { time: '08:30 - 11:30', activity: 'Berenang di Danau Ubur-Ubur Lenmakana', locationName: 'Lenmakana Lagoon', isHighlight: true },
          { time: '13:00 - 15:30', activity: 'Foto udara Laguna Bentuk Hati (Batu Cinta)', locationName: 'Batu Cinta Karst', isHighlight: true }
        ]
      },
      {
        day: 3,
        title: 'Gua Keramat & Snorkeling Harfat Peak',
        description: 'Trekking puncak Harfat dan eksplorasi gua keramat purba.',
        items: [
          { time: '08:00 - 12:00', activity: 'Trekking Harfat Peak & Snorkeling Wall', locationName: 'Harfat Peak', isHighlight: true }
        ]
      },
      {
        day: 4,
        title: 'Kembali ke Sorong',
        description: 'Perjalanan kembali menuju bandara Sorong.',
        items: [
          { time: '08:00 - 12:00', activity: 'Speedboat kembali ke Sorong', locationName: 'Bandara DEO Sorong', isHighlight: false }
        ]
      }
    ],
    facilitiesIncluded: ['Resort Water Cottage 3 Malam', 'Speedboat Khusus 4 Mesin', 'Makan Pagi Siang Malam Seafood Segar', 'Guide Asli Papua Berlisensi', 'Peralatan Snorkeling & Life Jacket'],
    facilitiesExcluded: ['Tiket Pesawat ke Sorong', 'Pin Masuk BLUD Raja Ampat (WNI Rp 500rb, WNA Rp 1jt)'],
    cancellationPolicy: {
      summary: 'Strict Policy',
      rules: ['Pembatalan H-14 pengembalian 75%.', 'Pembatalan H-7 tidak ada pengembalian.']
    },
    reviews: [],
    isRecommended: true,
    isTrending: false,
    isPopular: true,
    distanceKm: 2780,
    packageType: 'Private Trip',
    slotsLeft: 3,
    viewersCount: 65,
    facilities: ['Resort Water Cottage', 'Speedboat Eksklusif', 'Full Board Meals', 'Pin Masuk Raja Ampat']
  },
  {
    id: 'trip-5',
    title: 'Jogja Heritage, Borobudur & Prambanan',
    destination: 'Yogyakarta',
    province: 'D.I. Yogyakarta',
    category: 'Budaya',
    price: 1400000,
    originalPrice: 1800000,
    discountPercent: 22,
    rating: 4.7,
    reviewsCount: 290,
    imageUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80'
    ],
    duration: '3D2N',
    durationDays: 3,
    departureCity: 'Yogyakarta',
    departureLocation: {
      title: 'Stasiun Tugu Yogyakarta / Bandara YIA',
      address: 'Jl. Pasar Kembang, Sosromenduran, Gedong Tengen, Yogyakarta',
      notes: 'Penjemputan fleksibel sesuai jadwal kedatangan tamu.'
    },
    departureDates: ['2026-11-06', '2026-11-13', '2026-11-20', '2026-11-27'],
    minParticipants: 2,
    maxParticipants: 14,
    description: 'Menyusuri peradaban megah candi Buddha terbesar Borobudur, candi Hindu Prambanan, kuliner gudeg legendaris, dan keraton Yogyakarta.',
    highlights: ['Sunrise Candi Borobudur', 'Kemegahan Prambanan', 'Keraton Ngayogyakarta', 'Sunset di Obelix Hills'],
    vendor: {
      name: 'Mataram Heritage Tour',
      logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      verified: true,
      rating: 4.8,
      tripsHandled: 1650,
      joinedYear: '2019',
      responseRate: '100% Cepat'
    },
    itinerary: [
      {
        day: 1,
        title: 'Candi Prambanan & Sunset Obelix Hills',
        description: 'Tiba di Jogja, explore Prambanan dan sunset tebing.',
        items: [
          { time: '09:00 - 10:00', activity: 'Penjemputan di Stasiun Tugu / Bandara YIA', locationName: 'Stasiun Tugu', isHighlight: false },
          { time: '10:30 - 13:00', activity: 'Kunjungan Candi Prambanan', locationName: 'Candi Prambanan', isHighlight: true },
          { time: '16:00 - 18:30', activity: 'Sunset View di Obelix Hills', locationName: 'Obelix Hills', isHighlight: true }
        ]
      },
      {
        day: 2,
        title: 'Sunrise Borobudur & VW Safari Desa Wisata',
        description: 'Menyambut fajar di Borobudur dan keliling desa naik mobil VW antik.',
        items: [
          { time: '04:30 - 08:00', activity: 'Sunrise Candi Borobudur', locationName: 'Candi Borobudur', isHighlight: true },
          { time: '09:00 - 12:00', activity: 'Tour VW Safari Magelang & Petik Jamur', locationName: 'Desa Wisata Borobudur', isHighlight: true }
        ]
      },
      {
        day: 3,
        title: 'Keraton Jogja & Belanja Bakpia Malioboro',
        description: 'Wisata sejarah keraton dan oleh-oleh khas.',
        items: [
          { time: '09:00 - 11:30', activity: 'Wisata Budaya Keraton Ngayogyakarta', locationName: 'Keraton Jogja', isHighlight: true },
          { time: '12:00 - 14:00', activity: 'Belanja Bakpia & Pengantaran ke Stasiun', locationName: 'Jalan Malioboro', isHighlight: false }
        ]
      }
    ],
    facilitiesIncluded: ['Hotel Bintang 4 Pusat Kota 2 Malam', 'Mobil HiAce Luxury AC Driver & BBM', 'Tiket Masuk Terusan Borobudur & Prambanan', 'Sewa VW Safari Antik', 'Makan Pagi & Siang Khas Jogja'],
    facilitiesExcluded: ['Tiket Pesawat / Kereta dari Kota Asal', 'Pengeluaran pribadi'],
    cancellationPolicy: {
      summary: 'Fleksibel',
      rules: ['Pembatalan H-3 pengembalian 100%.']
    },
    reviews: [],
    isRecommended: false,
    isTrending: true,
    isPopular: true,
    distanceKm: 450,
    packageType: 'Family Trip',
    slotsLeft: 8,
    viewersCount: 110,
    facilities: ['Hotel Bintang 4 Jogja', 'Mobil HiAce Luxury', 'Makan Kuliner Khas', 'Pemandu Sejarah']
  },
  {
    id: 'trip-6',
    title: 'Derawan & Maratua Whale Shark Swim',
    destination: 'Kepulauan Derawan',
    province: 'Kalimantan Timur',
    category: 'Bahari',
    price: 4250000,
    originalPrice: 5100000,
    discountPercent: 16,
    rating: 4.9,
    reviewsCount: 185,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    duration: '4D3N',
    durationDays: 4,
    departureCity: 'Berau',
    departureLocation: {
      title: 'Bandara Kalimarau Berau',
      address: 'Jl. Kalimarau, Teluk Bayur, Berau, Kalimantan Timur',
      notes: 'Penjemputan pukul 10:00 WITA.'
    },
    departureDates: ['2026-11-08', '2026-11-22'],
    minParticipants: 4,
    maxParticipants: 12,
    description: 'Berenang bersama hiu paus raksasa ramah di perairan Talisayan, danau ubur-ubur tanpa sengat Kakaban, dan villa apung Maratua.',
    highlights: ['Whale Shark Talisayan', 'Danau Ubur-ubur Kakaban', 'Laguna Biru Kehe Daing'],
    vendor: {
      name: 'Borneo Marine Life',
      logo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      verified: true,
      rating: 4.9,
      tripsHandled: 640,
      joinedYear: '2021',
      responseRate: '100% Cepat'
    },
    itinerary: [],
    facilitiesIncluded: ['Water Villa Resort Derawan', 'Speedboat 4 Mesin', 'Makan Pagi Siang Malam', 'Dokumentasi GoPro Underwater'],
    facilitiesExcluded: ['Tiket Pesawat ke Berau', 'Pengeluaran Pribadi'],
    cancellationPolicy: {
      summary: 'Standar Wisata',
      rules: ['Pembatalan H-7 pengembalian 50%.']
    },
    reviews: [],
    isRecommended: true,
    isTrending: true,
    isPopular: true,
    distanceKm: 1350,
    packageType: 'Open Trip',
    slotsLeft: 3,
    viewersCount: 175,
    facilities: ['Water Villa Resort', 'Speedboat 4 Mesin', 'Dokumentasi GoPro', 'Makan Seafood']
  },
  {
    id: 'trip-near-1',
    title: 'Pulau Pari Escape & Virgin Beach',
    destination: 'Kepulauan Seribu',
    province: 'DKI Jakarta',
    category: 'Pantai',
    price: 450000,
    originalPrice: 550000,
    discountPercent: 18,
    rating: 4.6,
    reviewsCount: 210,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    duration: '2D1N',
    durationDays: 2,
    departureCity: 'Jakarta',
    departureLocation: {
      title: 'Dermaga Marina Ancol / Muara Angke',
      address: 'Jl. Lodan Timur No. 7, Ancol, Pademangan, Jakarta Utara',
      notes: 'Kumpul pukul 06:30 WIB di Dermaga 16 Marina Ancol.'
    },
    departureDates: ['2026-11-07', '2026-11-14', '2026-11-21', '2026-11-28'],
    minParticipants: 2,
    maxParticipants: 25,
    description: 'Liburan pantai singkat hemat dekat Jakarta. Bersepeda keliling pulau, bersantai di Pantai Pasir Perawan, dan snorkeling karang bintang.',
    highlights: ['Pantai Pasir Perawan', 'Sepeda Keliling Pulau', 'Snorkeling Bintang Laut', 'Barbeque Ikan Bakar'],
    vendor: {
      name: 'Kepulauan Seribu Bahari Tour',
      logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      verified: true,
      rating: 4.7,
      tripsHandled: 3400,
      joinedYear: '2017',
      responseRate: '100% Cepat'
    },
    itinerary: [],
    facilitiesIncluded: ['Tiket Kapal Ferry PP', 'Homestay AC Tepi Pantai', 'Sepeda Santai Selama Trip', 'Makan 3x + Barbeque Ikan'],
    facilitiesExcluded: ['Tiket Gerbang Masuk Ancol', 'Pengeluaran pribadi'],
    cancellationPolicy: {
      summary: 'Fleksibel H-2',
      rules: ['Pembatalan H-2 refund 100%.']
    },
    reviews: [],
    isRecommended: false,
    isTrending: false,
    isPopular: false,
    distanceKm: 18.5,
    packageType: 'Open Trip',
    slotsLeft: 12,
    viewersCount: 45,
    facilities: ['Kapal Ferry Marina PP', 'Homestay AC', 'Sepeda Santai', 'Makan & BBQ']
  },
  {
    id: 'trip-near-2',
    title: 'Curug Cilember & Puncak Pine Forest',
    destination: 'Puncak Bogor',
    province: 'Jawa Barat',
    category: 'Alam',
    price: 350000,
    originalPrice: 450000,
    discountPercent: 22,
    rating: 4.7,
    reviewsCount: 160,
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
    ],
    duration: '1D (One Day)',
    durationDays: 1,
    departureCity: 'Jakarta',
    departureLocation: {
      title: 'Stasiun Cawang LRT / MRT Lebak Bulus',
      address: 'Jl. MT Haryono, Cawang, Tebet, Jakarta Selatan',
      notes: 'Kumpul pagi hari pukul 06:00 WIB.'
    },
    departureDates: ['2026-11-08', '2026-11-15', '2026-11-22'],
    minParticipants: 2,
    maxParticipants: 14,
    description: 'Refreshing alam sejuk hanya 1 jam dari Jakarta. Trekking 7 air terjun berundak di tengah hutan pinus asri dan penangkaran kupu-kupu.',
    highlights: ['Trekking 7 Air Terjun', 'Hutan Pinus Megamendung', 'Taman Kupu-kupu', 'Kuliner Khas Sunda'],
    vendor: {
      name: 'Bogor Green Adventure',
      logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      verified: true,
      rating: 4.7,
      tripsHandled: 890,
      joinedYear: '2020',
      responseRate: '100% Cepat'
    },
    itinerary: [],
    facilitiesIncluded: ['Transport AC Avanza/HiAce PP', 'Tiket Terusan Masuk Curug', 'Makan Siang Nasi Liwet Kastrol', 'Pemandu Trekking Lokal'],
    facilitiesExcluded: ['Pengeluaran pribadi'],
    cancellationPolicy: {
      summary: 'Reschedule Bebas',
      rules: ['Reschedule gratis hingga H-1.']
    },
    reviews: [],
    isRecommended: false,
    isTrending: false,
    isPopular: false,
    distanceKm: 46.2,
    packageType: 'Private Trip',
    slotsLeft: 10,
    viewersCount: 52,
    facilities: ['Transport AC PP', 'Tiket Masuk Curug', 'Makan Siang Liwet', 'Pemandu Trekking']
  },
  {
    id: 'trip-near-3',
    title: 'Kawah Putih & Glamping Lakeside Ciwidey',
    destination: 'Ciwidey, Bandung',
    province: 'Jawa Barat',
    category: 'Gunung',
    price: 750000,
    originalPrice: 950000,
    discountPercent: 21,
    rating: 4.8,
    reviewsCount: 310,
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
    ],
    duration: '2D1N',
    durationDays: 2,
    departureCity: 'Bandung',
    departureLocation: {
      title: 'Stasiun Kereta Cepat Tegalluar / Stasiun Bandung Kota',
      address: 'Jl. Stasiun Barat No. 1, Bandung, Jawa Barat',
      notes: 'Penjemputan pukul 08:00 WIB.'
    },
    departureDates: ['2026-11-07', '2026-11-14', '2026-11-21'],
    minParticipants: 2,
    maxParticipants: 12,
    description: 'Danau belerang toska ikonik Kawah Putih, kebun teh Rancabali, berlayar di Situ Patenggang, dan menginap di tenda glamping mewah tepi danau.',
    highlights: ['Kawah Putih Ciwidey', 'Jembatan Apung Cantigi', 'Glamping Lakeside Resto Kapal', 'Kebun Strawberry Petik Sendiri'],
    vendor: {
      name: 'Parahyangan Explorer',
      logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      verified: true,
      rating: 4.8,
      tripsHandled: 1120,
      joinedYear: '2019',
      responseRate: '100% Cepat'
    },
    itinerary: [],
    facilitiesIncluded: ['Tenda Glamping Mewah Tepi Danau', 'Mobil Pariwisata AC', 'Tiket Terusan Kawah Putih & Ontang-Anting', 'Pemandu Lokal'],
    facilitiesExcluded: ['Tiket Whoosh / Kereta ke Bandung', 'Petik Strawberry Bayar Sendiri Sesuai Timbangan'],
    cancellationPolicy: {
      summary: 'Standar Wisata',
      rules: ['Pembatalan H-3 pengembalian 100%.']
    },
    reviews: [],
    isRecommended: true,
    isTrending: false,
    isPopular: false,
    distanceKm: 135.0,
    packageType: 'Family Trip',
    slotsLeft: 5,
    viewersCount: 88,
    facilities: ['Tenda Glamping Mewah', 'Ontang-Anting Kawah', 'Tiket Terusan', 'Pemandu Lokal']
  }
]

let tripsData: Trip[] = [...INITIAL_TRIPS]

// Comprehensive Filter Options
export interface TripFilterOptions {
  category?: string
  query?: string
  scope?: 'all' | 'destinasi' | 'paket'
  minPrice?: number
  maxPrice?: number
  durationDays?: number
  departureCity?: string
  departureDate?: string
  sortBy?: 'popularity' | 'price_asc' | 'price_desc' | 'rating' | 'newest'
  packageType?: string
  isRecommended?: boolean
  isTrending?: boolean
}

// Simulated Async API calls with TanStack Query
export const tripApi = {
  getPromos: async (): Promise<PromoBanner[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return PROMO_BANNERS
  },

  getCategories: async (): Promise<CategoryInfo[]> => {
    return CATEGORIES_LIST
  },

  getDepartureCities: async (): Promise<string[]> => {
    return DEPARTURE_CITIES
  },

  getDestinations: async (mode: 'popular' | 'nearby' = 'popular'): Promise<Destination[]> => {
    await new Promise((resolve) => setTimeout(resolve, 250))
    if (mode === 'popular') {
      return DESTINATIONS_LIST.filter((d) => d.isPopular)
    }
    return [...DESTINATIONS_LIST].sort((a, b) => a.distanceKm - b.distanceKm)
  },

  getRecommendedPackages: async (): Promise<Trip[]> => {
    await new Promise((resolve) => setTimeout(resolve, 250))
    return tripsData.filter((t) => t.isRecommended)
  },

  getTrendingPackages: async (): Promise<Trip[]> => {
    await new Promise((resolve) => setTimeout(resolve, 250))
    return tripsData.filter((t) => t.isTrending)
  },

  getTrips: async (category?: string, query?: string, filterOptions?: TripFilterOptions): Promise<Trip[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    let result = [...tripsData]

    // Category filter
    const activeCategory = category || filterOptions?.category
    if (activeCategory && activeCategory !== 'All' && activeCategory !== 'Semua') {
      result = result.filter((t) => {
        const cat = t.category.toLowerCase()
        const target = activeCategory.toLowerCase()
        if (target === 'pantai' || target === 'beach') return cat === 'pantai' || cat === 'beach'
        if (target === 'gunung' || target === 'mountain') return cat === 'gunung' || cat === 'mountain'
        if (target === 'budaya' || target === 'culture') return cat === 'budaya' || cat === 'culture'
        if (target === 'alam') return cat === 'alam' || cat === 'nature'
        if (target === 'bahari' || target === 'adventure') return cat === 'bahari' || cat === 'adventure'
        return cat === target
      })
    }

    // Text Query (Destinasi & Lokasi & Judul)
    const activeQuery = (query || filterOptions?.query || '').trim().toLowerCase()
    if (activeQuery) {
      result = result.filter((t) => 
        t.title.toLowerCase().includes(activeQuery) || 
        t.destination.toLowerCase().includes(activeQuery) ||
        t.province.toLowerCase().includes(activeQuery) ||
        t.departureCity.toLowerCase().includes(activeQuery) ||
        t.category.toLowerCase().includes(activeQuery) ||
        t.highlights.some(h => h.toLowerCase().includes(activeQuery))
      )
    }

    // Min Price
    if (filterOptions?.minPrice !== undefined && filterOptions.minPrice > 0) {
      result = result.filter((t) => t.price >= filterOptions.minPrice!)
    }

    // Max Price
    if (filterOptions?.maxPrice !== undefined && filterOptions.maxPrice > 0) {
      result = result.filter((t) => t.price <= filterOptions.maxPrice!)
    }

    // Duration Days
    if (filterOptions?.durationDays !== undefined && filterOptions.durationDays > 0) {
      if (filterOptions.durationDays >= 4) {
        result = result.filter((t) => t.durationDays >= 4)
      } else {
        result = result.filter((t) => t.durationDays === filterOptions.durationDays)
      }
    }

    // Departure City
    if (filterOptions?.departureCity && filterOptions.departureCity !== 'Semua Kota') {
      result = result.filter((t) => 
        t.departureCity.toLowerCase().includes(filterOptions.departureCity!.toLowerCase())
      )
    }

    // Package Type
    if (filterOptions?.packageType && filterOptions.packageType !== 'All') {
      result = result.filter((t) => t.packageType === filterOptions.packageType)
    }

    // Sorting
    const sort = filterOptions?.sortBy || 'popularity'
    if (sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price)
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount)
    } else if (sort === 'popularity') {
      result.sort((a, b) => (b.reviewsCount + (b.isPopular ? 100 : 0)) - (a.reviewsCount + (a.isPopular ? 100 : 0)))
    } else if (sort === 'newest') {
      result.reverse()
    }

    return result
  },

  getTripById: async (id: string): Promise<Trip> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const trip = tripsData.find((t) => t.id === id)
    if (!trip) {
      throw new Error(`Trip dengan ID "${id}" tidak ditemukan.`)
    }
    return trip
  },

  addReviewToTrip: (tripId: string, review: Omit<TripReview, 'id'>): Trip => {
    const trip = tripsData.find((t) => t.id === tripId)
    if (trip) {
      const newReview: TripReview = {
        ...review,
        id: `rev-${Date.now()}`
      }
      trip.reviews = [newReview, ...trip.reviews]
      trip.reviewsCount = trip.reviews.length
      const totalScore = trip.reviews.reduce((acc, r) => acc + r.rating, 0)
      trip.rating = parseFloat((totalScore / trip.reviewsCount).toFixed(1))
    }
    return trip!
  },

  createTrip: async (newTripData: any): Promise<Trip> => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const created: Trip = {
      ...newTripData,
      id: `trip-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      photos: [newTripData.imageUrl],
      durationDays: 3,
      departureCity: newTripData.province || 'Jakarta',
      departureLocation: {
        title: `Meeting Point ${newTripData.destination}`,
        address: `${newTripData.destination}, ${newTripData.province}`,
      },
      departureDates: ['2026-11-15', '2026-11-22'],
      minParticipants: 2,
      maxParticipants: 15,
      vendor: {
        name: 'AyoTrip Verified Partner',
        logo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        verified: true,
        rating: 5.0,
        tripsHandled: 120,
        joinedYear: '2024',
        responseRate: '100% Cepat'
      },
      itinerary: [],
      facilitiesIncluded: ['Transport AC', 'Tiket Wisata', 'Pemandu Lokal'],
      facilitiesExcluded: ['Pengeluaran pribadi'],
      cancellationPolicy: {
        summary: 'Fleksibel',
        rules: ['Pembatalan H-3 pengembalian 100%.']
      },
      reviews: [],
      isRecommended: true,
      isTrending: true,
      slotsLeft: 6,
      viewersCount: 12
    }
    tripsData = [created, ...tripsData]
    return created
  }
}
