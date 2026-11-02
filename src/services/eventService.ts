export type TripType = 'GENERAL' | 'PRIVATE'

export interface EventDestination {
  id: string
  coordinates: string
  displayName: string
}

export interface EventRegency {
  id: string
  name: string
}

export interface DetailedProvider {
  id?: string
  brandLegalName: string
  brandName: string
  nibNumber?: string
  logoUrl: string
}

export interface EventCreator {
  id: string
  profile: {
    displayName: string
    avatarUrl: string | null
  }
}

export interface EventDeparture {
  id: string
  eventId: string
  tripType: string
  seatAvailable: number
  startDate: string
  endDate: string
  duration: number
  isActive: boolean
  isFull: boolean
  price: string
  createdAt: string
  updatedAt: string
}

export interface DetailedDestination {
  id: string
  slug: string
  displayName: string
  content: string
  status: string
  addressName: string
  provinceId: string
  regencyId: string
  districtId: string
  villageId: string
  coordinates: string
  createdAt: string
  updatedAt: string
  createdBy: string
  village?: {
    id: string
    districtId: string
    name: string
    createdAt: string
  }
  district?: {
    id: string
    regencyId: string
    name: string
    altName?: string
    createdAt: string
  }
  regency?: {
    id: string
    provinceId: string
    name: string
    altName?: string
    createdAt: string
  }
  province?: {
    id: string
    name: string
    altName?: string
    createdAt: string
  }
  creator?: {
    id: string
    profile: {
      displayName: string
      avatarUrl: string | null
    }
  }
}

export interface EventItem {
  id: string
  providerId: string
  createdBy: string
  destinationId: string
  slug: string
  name: string
  dayDuration: number
  seatCapacity: number
  summary: string
  description: string
  isOnAir: boolean
  isAllowAddon: boolean
  attributesInclude: string[]
  attributesExclude: string[]
  tag: string[]
  regencyId: string
  typeId: string
  startPrice: string
  tripType: TripType
  createdAt: string
  updatedAt: string
  liked: number
  attended: number
  destination: EventDestination
  eventRegency: EventRegency
  provider: DetailedProvider
  coverImage?: string
}

export interface EventDetail extends Omit<EventItem, 'destination'> {
  creator?: EventCreator
  destination: DetailedDestination
  timeline?: any
  eventDepartures: EventDeparture[]
}

export interface EventMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface EventApiResponse {
  status: number
  body: {
    isError: boolean
    message: string
    data: EventItem[]
    meta: EventMeta
  }
}

export interface EventDetailApiResponse {
  status: number
  body: {
    isError: boolean
    message: string
    data: EventDetail
  }
}

// Exact Detailed Response provided by the user
export const DETAILED_EVENT_RESPONSE: EventDetailApiResponse = {
  status: 200,
  body: {
    isError: false,
    message: "Event details retrieved successfully",
    data: {
      id: "996e5e58-db0d-4fd6-953b-8f05f2286f30",
      providerId: "bf2fdaaf-01c5-4803-a401-23d1fd3b13a2",
      createdBy: "8fb239e3-970a-455e-b69b-f4f62e4e5740",
      destinationId: "3631bf36-1d59-476d-a626-3f9c3d54ec69",
      slug: "open-trip-touring-bandung---yogyakarata-1793626080044",
      name: "Open Trip Touring Bandung - Yogyakarata",
      dayDuration: 4,
      seatCapacity: 12,
      summary: "Ikutin aja lah pokonya seru bre",
      description: "Ikutin aja lah pokonya seru bre. Jelajahi rute jalur selatan Jawa Barat menuju Yogyakarta dengan konvoi aman, nikmati kuliner khas pedesaan, serta eksplor Candi Borobudur saat fajar tiba.",
      isOnAir: false,
      isAllowAddon: true,
      attributesInclude: [
        "Makan 3x Sehari",
        "Homestay AC / Penginapan Nyaman",
        "Road Captain & Tim Mekanik Siaga",
        "Dokumentasi Foto & Drone Perjalanan"
      ],
      attributesExclude: [
        "Bensin / BBM Kendaraan Pribadi",
        "Perlengkapan Riding Pribadi (Helm & Jaket)",
        "Pengeluaran Pribadi & Camilan"
      ],
      tag: [
        "candi",
        "yogyakarta",
        "touring",
        "motoran"
      ],
      regencyId: "3308",
      typeId: "ec05932b-ebea-4b04-aa92-1cac2824be33",
      startPrice: "1250000",
      tripType: "GENERAL",
      createdAt: "2026-11-02T13:28:00.060Z",
      updatedAt: "2026-11-02T13:28:00.060Z",
      liked: 48,
      attended: 14,
      eventRegency: {
        id: "3308",
        name: "KABUPATEN MAGELANG"
      },
      coverImage: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
      provider: {
        brandName: "Rakabulan",
        brandLegalName: "PT Rakabumi dari bulan",
        nibNumber: "123985712318",
        logoUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=150&q=80"
      },
      creator: {
        id: "8fb239e3-970a-455e-b69b-f4f62e4e5740",
        profile: {
          displayName: "Travel Agent Owner 1",
          avatarUrl: null
        }
      },
      destination: {
        id: "3631bf36-1d59-476d-a626-3f9c3d54ec69",
        slug: "candi-borobudur",
        displayName: "Candi Borobudur",
        content: `<header style="margin-bottom: 1.5rem;">
        <nav aria-label="Breadcrumb" style="font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.5rem;">
          Jawa Tengah › Kab. Magelang › Kec. Borobudur › <span style="color: #10b981; font-weight: 600;">Desa Borobudur</span>
        </nav>
        <h1 style="font-size: 1.5rem; color: #f8fafc; font-weight: 700; margin: 0 0 0.5rem 0;">Candi Borobudur: Mahakarya Arsitektur Buddha Terbesar di Dunia</h1>
        <p style="color: #94a3b8; font-size: 0.875rem; margin: 0;">Kategori: Cagar Budaya &amp; Sejarah • Jam Operasional: 06.30 - 16.30 WIB • Estimasi Durasi: 2.5 - 3 Jam</p>
      </header>

      <section style="margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.15rem; color: #38bdf8; border-bottom: 1px solid #334155; padding-bottom: 0.35rem; margin-bottom: 0.5rem;">Deskripsi &amp; Sejarah Singkat</h2>
        <p style="color: #cbd5e1; line-height: 1.6; font-size: 0.875rem;">Candi Borobudur adalah monumen Buddha terbesar di dunia yang dibangun pada masa wangsa Syailendra sekitar abad ke-8 dan ke-9 Masehi. Dikelilingi oleh perbukitan Menoreh dan Gunung Merapi serta Merbabu, struktur punden berundak ini melambangkan tiga tingkatan kosmologi Buddha: Kamadhatu (alam hasrat), Rupadhatu (alam wujud), dan Arupadhatu (alam tanpa wujud).</p>
      </section>

      <section style="margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.15rem; color: #38bdf8; border-bottom: 1px solid #334155; padding-bottom: 0.35rem; margin-bottom: 0.5rem;">Highlight Atraksi</h2>
        <ul style="padding-left: 1.25rem; margin: 0.5rem 0; color: #cbd5e1; font-size: 0.875rem; line-height: 1.6;">
          <li style="margin-bottom: 0.5rem;"><strong style="color: #f1f5f9;">Relief Karmawibhangga &amp; Lalitavistara:</strong> Ribuan panel relief pahatan batu andesit yang memuat ajaran kehidupan dan kisah Siddharta Gautama.</li>
          <li style="margin-bottom: 0.5rem;"><strong style="color: #f1f5f9;">Stupa Utama &amp; Stupa Berterawang:</strong> Barisan 72 stupa terawang dengan arca Buddha di dalamnya yang berpusat pada stupa induk di puncak.</li>
          <li style="margin-bottom: 0.5rem;"><strong style="color: #f1f5f9;">Paket Sunrise Punthuk Setumbu:</strong> Menikmati siluet megah Borobudur yang tersembul di balik kabut fajar dari bukit sekitar.</li>
        </ul>
      </section>

      <section style="margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.15rem; color: #38bdf8; border-bottom: 1px solid #334155; padding-bottom: 0.35rem; margin-bottom: 0.5rem;">Tips &amp; Aturan Kunjungan</h2>
        <div style="background-color: rgba(30, 41, 59, 0.7); border-left: 4px solid #10b981; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; color: #e2e8f0;">
          <p style="margin: 0 0 0.5rem 0;"><strong style="color: #34d399;">Aturan Sandal Upanat:</strong> Pengunjung yang ingin naik ke struktur monumen candi diwajibkan membeli tiket khusus kuota harian dan mengenakan sandal anyaman khusus (Upanat) guna menjaga kelestarian batu candi.</p>
          <p style="margin: 0;"><strong style="color: #38bdf8;">Waktu Terbaik:</strong> Pukul 07.00 - 09.00 WIB untuk menghindari sengatan panas terik di pelataran terbuka.</p>
        </div>
      </section>

      <footer>
        <h3 style="font-size: 0.95rem; color: #94a3b8; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Fasilitas Tersedia</h3>
        <span style="display: inline-block; background: #1e293b; color: #38bdf8; border: 1px solid #334155; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 9999px; margin-right: 0.4rem; margin-bottom: 0.4rem;">Museum Karmawibhangga</span>
        <span style="display: inline-block; background: #1e293b; color: #38bdf8; border: 1px solid #334155; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 9999px; margin-right: 0.4rem; margin-bottom: 0.4rem;">Shuttle &amp; Golf Car</span>
        <span style="display: inline-block; background: #1e293b; color: #38bdf8; border: 1px solid #334155; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 9999px; margin-right: 0.4rem; margin-bottom: 0.4rem;">Pusat Oleh-Oleh</span>
        <span style="display: inline-block; background: #1e293b; color: #38bdf8; border: 1px solid #334155; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 9999px; margin-right: 0.4rem; margin-bottom: 0.4rem;">Masjid &amp; Rest Area</span>
      </footer>`,
        status: "PUBLISHED",
        addressName: "Borobudur Magelang Jawa Tengah",
        provinceId: "33",
        regencyId: "3308",
        districtId: "3308020",
        villageId: "3308020011",
        coordinates: "-6.203701, 106.825562",
        createdAt: "2026-10-13T15:56:27.815Z",
        updatedAt: "2026-10-13T15:56:27.815Z",
        createdBy: "ecb726f0-7487-4cb3-ad80-ddc661f4993c",
        village: {
          id: "3308020011",
          districtId: "3308020",
          name: "BOROBUDUR",
          createdAt: "2026-08-29T09:33:57.827Z"
        },
        district: {
          id: "3308020",
          regencyId: "3308",
          name: "BOROBUDUR",
          altName: "Magelang,",
          createdAt: "2026-08-29T09:32:46.587Z"
        },
        regency: {
          id: "3308",
          provinceId: "33",
          name: "KABUPATEN MAGELANG",
          altName: "KABUPATEN MAGELANG",
          createdAt: "2026-08-29T09:32:41.760Z"
        },
        province: {
          id: "33",
          name: "JAWA TENGAH",
          altName: "JAWA TENGAH",
          createdAt: "2026-08-29T09:32:41.429Z"
        },
        creator: {
          id: "ecb726f0-7487-4cb3-ad80-ddc661f4993c",
          profile: {
            displayName: "Andri Basah",
            avatarUrl: null
          }
        }
      },
      timeline: null,
      eventDepartures: [
        {
          id: "a8eea1f8-541f-4407-94c2-acf566597b8c",
          eventId: "996e5e58-db0d-4fd6-953b-8f05f2286f30",
          tripType: "OPEN_TRIP",
          seatAvailable: 10,
          startDate: "2027-01-25T00:00:00.000Z",
          endDate: "2027-02-25T00:00:00.000Z",
          duration: 31,
          isActive: false,
          isFull: false,
          price: "1250000",
          createdAt: "2026-11-02T14:04:46.277Z",
          updatedAt: "2026-11-02T14:04:46.277Z"
        },
        {
          id: "0bd032a3-b49f-46a8-b982-c371aeb0129d",
          eventId: "996e5e58-db0d-4fd6-953b-8f05f2286f30",
          tripType: "OPEN_TRIP",
          seatAvailable: 10,
          startDate: "2027-03-01T00:00:00.000Z",
          endDate: "2027-04-15T00:00:00.000Z",
          duration: 45,
          isActive: false,
          isFull: false,
          price: "1250000",
          createdAt: "2026-11-02T14:05:09.362Z",
          updatedAt: "2026-11-02T14:05:09.362Z"
        }
      ]
    }
  }
}

// Database of events
let eventsDatabase: EventItem[] = [
  DETAILED_EVENT_RESPONSE.body.data,
  {
    id: "772a4b12-ca11-4fd2-892a-331f4a991b11",
    providerId: "cc3aa1ef-02d6-4912-b512-11a2fe3c44a1",
    createdBy: "1da245e1-8811-4112-a123-f11122334455",
    destinationId: "4421aa88-2e11-4882-9901-5b8c1d42ec77",
    slug: "bromo-midnight-safari-and-sunrise-camp-1793626090123",
    name: "Bromo Midnight Safari & Sunrise Expedition",
    dayDuration: 2,
    seatCapacity: 8,
    summary: "Konvoi Jeep 4x4 melintasi lautan pasir Bromo menyambut matahari terbit spektakuler",
    description: "Petualangan jeep hardtop malam hari menyusuri lautan kabut, menyaksikan keindahan Golden Sunrise dari puncak Penanjakan 1, dan sarapan bersama di tengah padang savana.",
    isOnAir: true,
    isAllowAddon: true,
    attributesInclude: [
      "Jeep 4x4 Hardtop + Driver Profesional",
      "Tiket Masuk Kawasan TN Bromo Tengger Semeru",
      "Sarapan Hangat & Kopi / Teh Sepuasnya",
      "Dokumentasi Foto Aesthetic"
    ],
    attributesExclude: [
      "Sewa Kuda di Kawah",
      "Jaket Tebal Pribadi"
    ],
    tag: [
      "bromo",
      "sunrise",
      "jeep",
      "adventure"
    ],
    regencyId: "3513",
    typeId: "ec05932b-ebea-4b04-aa92-1cac2824be33",
    startPrice: "650000",
    tripType: "GENERAL",
    createdAt: "2026-11-01T09:15:00.000Z",
    updatedAt: "2026-11-02T10:00:00.000Z",
    liked: 125,
    attended: 32,
    destination: {
      id: "4421aa88-2e11-4882-9901-5b8c1d42ec77",
      coordinates: "-7.942494, 112.953012",
      displayName: "Taman Nasional Bromo"
    },
    eventRegency: {
      id: "3513",
      name: "KABUPATEN PROBOLINGGO"
    },
    provider: {
      brandLegalName: "PT Bromo Lestari Petualang",
      brandName: "BromoXpedition",
      nibNumber: "998877665544",
      logoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    coverImage: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "551e9988-fa22-4bb3-9121-7711223344bb",
    providerId: "ee1bb2aa-9900-4712-a123-445566778899",
    createdBy: "99aa8877-6655-4433-2211-001122334455",
    destinationId: "1234abcd-5678-90ef-1234-567890abcdef",
    slug: "exclusive-private-cruise-labuan-bajo-phinisi-1793626100456",
    name: "Private Phinisi Cruise & Komodo Island Retreat",
    dayDuration: 3,
    seatCapacity: 6,
    summary: "Eksklusif private sailing kapal phinisi mewah keliling kepulauan Komodo",
    description: "Nikmati kemewahan berlayar privat bersama keluarga atau sahabat terbaik. Pemandu privat, chef pribadi di atas kapal, serta snorkeling privat di perairan bening Manta Point.",
    isOnAir: true,
    isAllowAddon: true,
    attributesInclude: [
      "Private Cabin AC Kapal Phinisi Mewah",
      "Chef Pribadi (All-inclusive Breakfast, Lunch, Dinner)",
      "Alat Snorkeling Lengkap & Stand-Up Paddleboard",
      "Speedboat Transfer & Guide Berlisensi HPI"
    ],
    attributesExclude: [
      "Tiket Pesawat ke Bandara Labuan Bajo",
      "Pengeluaran Pribadi di Luar Menu"
    ],
    tag: [
      "phinisi",
      "labuanbajo",
      "luxury",
      "komodo"
    ],
    regencyId: "5315",
    typeId: "aa112233-bb44-cc55-dd66-ee7788990011",
    startPrice: "4850000",
    tripType: "PRIVATE",
    createdAt: "2026-10-28T14:20:00.000Z",
    updatedAt: "2026-11-02T11:45:00.000Z",
    liked: 94,
    attended: 8,
    destination: {
      id: "1234abcd-5678-90ef-1234-567890abcdef",
      coordinates: "-8.4908, 119.8821",
      displayName: "Pulau Padar & Komodo"
    },
    eventRegency: {
      id: "5315",
      name: "KABUPATEN MANGGARAI BARAT"
    },
    provider: {
      brandLegalName: "PT Bahari Nusantara Phinisi",
      brandName: "Nusantara Liveaboard",
      nibNumber: "776655443322",
      logoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    coverImage: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80"
  }
]

export interface EventFilterParams {
  search?: string
  tripType?: 'ALL' | TripType
  isOnAir?: 'ALL' | 'ACTIVE' | 'INACTIVE'
  tag?: string
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'duration' | 'capacity' | 'popular'
}

export const eventService = {
  getEvents: async (params?: EventFilterParams): Promise<EventApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    let list = [...eventsDatabase]

    if (params?.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase()
      list = list.filter((item) => 
        item.name.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.destination.displayName.toLowerCase().includes(q) ||
        item.eventRegency.name.toLowerCase().includes(q) ||
        item.provider.brandName.toLowerCase().includes(q) ||
        item.provider.brandLegalName.toLowerCase().includes(q) ||
        item.tag.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (params?.tripType && params.tripType !== 'ALL') {
      list = list.filter((item) => item.tripType === params.tripType)
    }

    if (params?.isOnAir && params.isOnAir !== 'ALL') {
      const targetIsOnAir = params.isOnAir === 'ACTIVE'
      list = list.filter((item) => item.isOnAir === targetIsOnAir)
    }

    if (params?.tag && params.tag !== 'ALL') {
      list = list.filter((item) => item.tag.includes(params.tag!.toLowerCase()))
    }

    if (params?.sortBy) {
      if (params.sortBy === 'price_asc') {
        list.sort((a, b) => Number(a.startPrice) - Number(b.startPrice))
      } else if (params.sortBy === 'price_desc') {
        list.sort((a, b) => Number(b.startPrice) - Number(a.startPrice))
      } else if (params.sortBy === 'duration') {
        list.sort((a, b) => b.dayDuration - a.dayDuration)
      } else if (params.sortBy === 'capacity') {
        list.sort((a, b) => b.seatCapacity - a.seatCapacity)
      } else if (params.sortBy === 'popular') {
        list.sort((a, b) => (b.liked + b.attended) - (a.liked + a.attended))
      } else if (params.sortBy === 'newest') {
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }
    }

    return {
      status: 200,
      body: {
        isError: false,
        message: "Events retrieved successfully",
        data: list,
        meta: {
          total: list.length,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      }
    }
  },

  getEventDetailById: async (idOrSlug: string): Promise<EventDetailApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    // If matches the primary dummy response
    if (idOrSlug === DETAILED_EVENT_RESPONSE.body.data.id || idOrSlug === DETAILED_EVENT_RESPONSE.body.data.slug) {
      return DETAILED_EVENT_RESPONSE
    }

    // Fallback if matching any other event in db
    const found = eventsDatabase.find((e) => e.id === idOrSlug || e.slug === idOrSlug)
    if (found) {
      const fallbackDetail: EventDetail = {
        ...found,
        creator: {
          id: found.createdBy,
          profile: {
            displayName: "Travel Agent Owner",
            avatarUrl: null
          }
        },
        destination: {
          id: found.destinationId,
          slug: found.slug,
          displayName: found.destination.displayName,
          content: `<header style="margin-bottom: 1.5rem;">
            <h1 style="font-size: 1.5rem; color: #f8fafc; font-weight: 700; margin: 0 0 0.5rem 0;">${found.destination.displayName}</h1>
            <p style="color: #94a3b8; font-size: 0.875rem;">Wilayah: ${found.eventRegency.name} • Durasi Acara: ${found.dayDuration} Hari</p>
          </header>
          <section style="margin-bottom: 1.5rem;">
            <h2 style="font-size: 1.15rem; color: #38bdf8; border-bottom: 1px solid #334155; padding-bottom: 0.35rem; margin-bottom: 0.5rem;">Tentang Destinasi</h2>
            <p style="color: #cbd5e1; line-height: 1.6; font-size: 0.875rem;">${found.description}</p>
          </section>`,
          status: "PUBLISHED",
          addressName: `${found.destination.displayName}, ${found.eventRegency.name}`,
          provinceId: found.regencyId.substring(0, 2),
          regencyId: found.regencyId,
          districtId: `${found.regencyId}01`,
          villageId: `${found.regencyId}0101`,
          coordinates: found.destination.coordinates,
          createdAt: found.createdAt,
          updatedAt: found.updatedAt,
          createdBy: found.createdBy,
          regency: {
            id: found.regencyId,
            provinceId: found.regencyId.substring(0, 2),
            name: found.eventRegency.name,
            createdAt: found.createdAt
          }
        },
        timeline: null,
        eventDepartures: [
          {
            id: `dep-${found.id}-1`,
            eventId: found.id,
            tripType: found.tripType === 'GENERAL' ? 'OPEN_TRIP' : 'PRIVATE_TRIP',
            seatAvailable: found.seatCapacity,
            startDate: "2027-01-25T00:00:00.000Z",
            endDate: "2027-02-25T00:00:00.000Z",
            duration: 31,
            isActive: found.isOnAir,
            isFull: false,
            price: found.startPrice,
            createdAt: found.createdAt,
            updatedAt: found.updatedAt
          }
        ]
      }

      return {
        status: 200,
        body: {
          isError: false,
          message: "Event details retrieved successfully",
          data: fallbackDetail
        }
      }
    }

    throw new Error(`Event dengan ID "${idOrSlug}" tidak ditemukan.`)
  },

  toggleLike: (id: string): { liked: boolean; count: number } => {
    const item = eventsDatabase.find((e) => e.id === id)
    if (item) {
      item.liked = (item.liked || 0) + 1
      return { liked: true, count: item.liked }
    }
    return { liked: false, count: 0 }
  }
}
