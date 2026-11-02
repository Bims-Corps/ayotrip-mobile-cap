export interface BookingParticipant {
  name: string
  idCard?: string
  phone?: string
}

export interface Booking {
  id: string
  bookingCode: string
  tripId: string
  tripTitle: string
  tripDestination: string
  tripImageUrl: string
  duration: string
  departureDate: string
  departureCity: string
  meetingPoint: string
  participantsCount: number
  participants: BookingParticipant[]
  customerName: string
  customerEmail: string
  customerPhone: string
  specialRequests?: string
  pricePerPax: number
  subtotal: number
  discountAmount: number
  promoCodeUsed?: string
  serviceFee: number
  totalAmount: number
  paymentMethod: string
  paymentStatus: 'Lunas' | 'Menunggu Pembayaran' | 'Dibatalkan'
  bookingStatus: 'Dikonfirmasi' | 'Menunggu Pembayaran' | 'Selesai' | 'Dibatalkan'
  createdAt: string
  reviewed?: boolean
  review?: {
    rating: number
    comment: string
    date: string
  }
  cancellationReason?: string
}

const STORAGE_KEY = 'ayotrip_bookings_data'

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1',
    bookingCode: 'AT-2026-7821',
    tripId: 'trip-1',
    tripTitle: 'Labuan Bajo & Komodo Dragon Cruise',
    tripDestination: 'Labuan Bajo, NTT',
    tripImageUrl: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80',
    duration: '3D2N',
    departureDate: '15 November 2026',
    departureCity: 'Labuan Bajo',
    meetingPoint: 'Pelabuhan Marina Labuan Bajo, Dermaga 2 (Pukul 08:00 WITA)',
    participantsCount: 2,
    participants: [
      { name: 'Budi Pratama', phone: '+62 812-3456-7890' },
      { name: 'Siti Rahma', phone: '+62 812-9876-5432' }
    ],
    customerName: 'Budi Pratama',
    customerEmail: 'budi.pratama@gmail.com',
    customerPhone: '+62 812-3456-7890',
    pricePerPax: 4850000,
    subtotal: 9700000,
    discountAmount: 1000000,
    promoCodeUsed: 'AYOBAHARI35',
    serviceFee: 15000,
    totalAmount: 8715000,
    paymentMethod: 'BCA Virtual Account',
    paymentStatus: 'Lunas',
    bookingStatus: 'Dikonfirmasi',
    createdAt: '24 Oktober 2026',
    reviewed: false
  },
  {
    id: 'bk-2',
    bookingCode: 'AT-2026-4419',
    tripId: 'trip-3',
    tripTitle: 'Bromo Golden Sunrise & B29 Peak',
    tripDestination: 'Bromo Tengger, Jawa Timur',
    tripImageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
    duration: '2D1N',
    departureDate: '10 Oktober 2026',
    departureCity: 'Surabaya / Malang',
    meetingPoint: 'Stasiun Malang Kota Baru (Pukul 23:00 WIB)',
    participantsCount: 1,
    participants: [{ name: 'Budi Pratama' }],
    customerName: 'Budi Pratama',
    customerEmail: 'budi.pratama@gmail.com',
    customerPhone: '+62 812-3456-7890',
    pricePerPax: 1250000,
    subtotal: 1250000,
    discountAmount: 250000,
    promoCodeUsed: 'BROMOSERU',
    serviceFee: 10000,
    totalAmount: 1010000,
    paymentMethod: 'QRIS Instant',
    paymentStatus: 'Lunas',
    bookingStatus: 'Selesai',
    createdAt: '01 Oktober 2026',
    reviewed: true,
    review: {
      rating: 5,
      comment: 'Pengalaman sunrise Bromo tak terlupakan! Jeep sangat tangguh dan guide Mas Danang ramah sekali.',
      date: '12 Oktober 2026'
    }
  }
]

export const bookingService = {
  getAll: (): Booking[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) return JSON.parse(data)
    } catch (e) {
      console.error(e)
    }
    return INITIAL_BOOKINGS
  },

  getById: (id: string): Booking | undefined => {
    const list = bookingService.getAll()
    return list.find((b) => b.id === id || b.bookingCode === id)
  },

  create: (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt'>): Booking => {
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingCode: `AT-2026-${randomNum}`,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    }

    const current = bookingService.getAll()
    const updated = [newBooking, ...current]
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      window.dispatchEvent(new Event('ayotrip_bookings_updated'))
    } catch (e) {
      console.error(e)
    }
    return newBooking
  },

  cancel: (id: string, reason: string): boolean => {
    const list = bookingService.getAll()
    const updated = list.map((b) => {
      if (b.id === id || b.bookingCode === id) {
        return {
          ...b,
          bookingStatus: 'Dibatalkan' as const,
          paymentStatus: 'Dibatalkan' as const,
          cancellationReason: reason,
        }
      }
      return b
    })
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      window.dispatchEvent(new Event('ayotrip_bookings_updated'))
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  },

  addReview: (id: string, rating: number, comment: string): boolean => {
    const list = bookingService.getAll()
    const updated = list.map((b) => {
      if (b.id === id || b.bookingCode === id) {
        return {
          ...b,
          reviewed: true,
          review: {
            rating,
            comment,
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
          }
        }
      }
      return b
    })
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      window.dispatchEvent(new Event('ayotrip_bookings_updated'))
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}

