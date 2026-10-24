export interface Trip {
  id: string
  title: string
  destination: string
  province: string
  category: 'Beach' | 'Mountain' | 'Culture' | 'Adventure'
  price: number
  rating: number
  reviewsCount: number
  imageUrl: string
  duration: string
  description: string
  highlights: string[]
}

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    title: 'Labuan Bajo & Komodo Dragon Cruise',
    destination: 'Labuan Bajo',
    province: 'Nusa Tenggara Timur',
    category: 'Adventure',
    price: 4850000,
    rating: 4.9,
    reviewsCount: 320,
    imageUrl: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80',
    duration: '3D2N',
    description: 'Jelajahi keindahan gugusan pulau Labuan Bajo, sailing kapal phinisi, bertemu hewan langka komodo di Pulau Rinca, dan nikmati pink beach yang mempesona.',
    highlights: ['Sailing Kapal Phinisi', 'Trekking Pulau Padar', 'Snorkeling Pink Beach', 'Komodo Encounter']
  },
  {
    id: 'trip-2',
    title: 'Bali Nusa Penida Island Gateway',
    destination: 'Nusa Penida',
    province: 'Bali',
    category: 'Beach',
    price: 1750000,
    rating: 4.8,
    reviewsCount: 512,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    duration: '2D1N',
    description: 'Kunjungi tebing ikonik Kelingking Beach, snorkeling bersama ikan pari Manta, dan nikmati suasana santai pesisir pantai Crystal Bay.',
    highlights: ['Kelingking T-Rex Cliff', 'Broken Beach & Angel Billabong', 'Snorkeling Manta Point']
  },
  {
    id: 'trip-3',
    title: 'Bromo Golden Sunrise & B29 Peak',
    destination: 'Taman Nasional Bromo Tengger',
    province: 'Jawa Timur',
    category: 'Mountain',
    price: 1250000,
    rating: 4.9,
    reviewsCount: 428,
    imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
    duration: '2D1N',
    description: 'Petualangan jeep 4WD dini hari menyambut matahari terbit spektakuler di Penanjakan Bromo dan melintasi lautan pasir berbisik.',
    highlights: ['Sunrise View Penanjakan 1', 'Kawah Bromo', 'Pasir Berbisik', 'Bukit Teletubbies Savana']
  },
  {
    id: 'trip-4',
    title: 'Raja Ampat Misool Underwater Eden',
    destination: 'Kepulauan Misool',
    province: 'Papua Barat Daya',
    category: 'Adventure',
    price: 9200000,
    rating: 5.0,
    reviewsCount: 140,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    duration: '4D3N',
    description: 'Surga bawah laut terkaya di dunia dengan laguna karst toska, terumbu karang warna-warni, serta gua keramat goa tengkorak.',
    highlights: ['Laguna Karst Misool', 'Snorkeling Ubur-ubur Jinak', 'Batu Cinta Heart Lagoon']
  },
  {
    id: 'trip-5',
    title: 'Jogja Heritage, Borobudur & Prambanan',
    destination: 'Yogyakarta',
    province: 'D.I. Yogyakarta',
    category: 'Culture',
    price: 1400000,
    rating: 4.7,
    reviewsCount: 290,
    imageUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
    duration: '3D2N',
    description: 'Menyusuri peradaban megah candi Buddha terbesar Borobudur, candi Hindu Prambanan, kuliner gudeg legendaris, dan keraton Yogyakarta.',
    highlights: ['Sunrise Candi Borobudur', 'Kemegahan Prambanan', 'Keraton Ngayogyakarta', 'Sunset di Obelix Hills']
  }
]

let tripsData: Trip[] = [...INITIAL_TRIPS]

// Simulated Async API calls
export const tripApi = {
  getTrips: async (category?: string, query?: string): Promise<Trip[]> => {
    // simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 600))
    let result = [...tripsData]
    if (category && category !== 'All') {
      result = result.filter((t) => t.category.toLowerCase() === category.toLowerCase())
    }
    if (query) {
      const q = query.toLowerCase()
      result = result.filter((t) => 
        t.title.toLowerCase().includes(q) || 
        t.destination.toLowerCase().includes(q) ||
        t.province.toLowerCase().includes(q)
      )
    }
    return result
  },

  getTripById: async (id: string): Promise<Trip> => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const trip = tripsData.find((t) => t.id === id)
    if (!trip) {
      throw new Error(`Trip dengan ID "${id}" tidak ditemukan.`)
    }
    return trip
  },

  createTrip: async (newTripData: Omit<Trip, 'id' | 'rating' | 'reviewsCount'>): Promise<Trip> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const created: Trip = {
      ...newTripData,
      id: `trip-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
    }
    tripsData = [created, ...tripsData]
    return created
  }
}

