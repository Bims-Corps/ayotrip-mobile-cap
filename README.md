# AyoTrip Mobile 🏝️🚀

Aplikasi mobile modern untuk penjelajahan destinasi dan pemesanan paket wisata di Indonesia. Dibangun dengan standar arsitektur frontend senior menggunakan kombinasi **Capacitor JS (v8.x)**, **React 19**, **TypeScript 6**, **Tailwind CSS v4**, **Shadcn UI (Full Pack 63+ Komponen)**, **TanStack Query v5**, **TanStack Form**, dan **TanStack Router**.

---

## 🛠️ Tech Stack & Spesifikasi

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Mobile Runtime** | **Capacitor JS (v8.5)** | Hybrid mobile wrapper untuk Android & iOS |
| **Core Framework** | **React 19 + TypeScript 6** | Modern UI & strict type safety |
| **Build Tool** | **Vite 8** | High-performance HMR bundler |
| **Styling** | **Tailwind CSS v4** | Modern utility-first CSS engine dengan mobile safe-area |
| **UI Components** | **Shadcn UI (Full Pack)** | 63+ Komponen modular (Sheet, Dialog, Card, Badge, Input, dll) |
| **Data Fetching** | **TanStack Query (v5.x)** | Asynchronous cache management, background sync |
| **Form Handling** | **TanStack Form (v1.x)** | Type-safe form validation & state |
| **Navigation & Routing**| **TanStack Router (v1.x)** | Type-safe file-based router dengan auto code splitting |
| **Toast & Notification**| **Sonner** | Interactive mobile toast notifications |

---

## 📱 Fitur Utama Aplikasi AyoTrip Mobile

### 1. 🔍 Pencarian & Eksplorasi Wisata (`/search`)
- Pencarian instan berdasarkan nama destinasi, provinsi, atau paket wisata.
- **Filter Rentang Harga**: Batas minimum & maksimum harga paket dengan tombol preset cepat.
- **Filter Titik Keberangkatan**: Pilihan kota asal (Jakarta, Surabaya, Bali/Denpasar, Yogyakarta, Labuan Bajo, Bandung, Malang).
- **Filter Durasi**: Pilihan 1 Hari (Day Trip), 2D1N, 3D2N, hingga 4+ Hari.
- **Filter Jenis Wisata**: Kategori Alam, Pantai, Gunung, Budaya, Bahari, dan Petualangan.
- **Pengurutan (Sorting)**: Berdasarkan Popularitas, Harga Terendah, Harga Tertinggi, Rating Tertinggi, dan Terbaru.
- Filter bottom sheet yang responsif dan ramah sentuhan.

### 2. 🗺️ Detail Paket Wisata (`/trips/$tripId`)
- Galeri foto destinasi dengan preview carousel thumbnail.
- Profil dan rating penyedia paket wisata (*Vendor Tour Organizer*) terverifikasi AyoTrip.
- Harga per orang dengan perbandingan harga coret & diskon.
- Batasan jumlah peserta minimum dan maksimum (Pax capacity).
- Fasilitas yang Termasuk (*Included*) & Belum Termasuk (*Excluded*).
- Kebijakan pembatalan dan jaminan pengembalian dana (*Refund policy*).
- Ulasan dan rating wisatawan asli.
- Tombol bookmark/favorit dan bagikan (*Share*).
- Tombol *Pesan Sekarang* (Sticky bottom bar) langsung menuju checkout.

### 3. 🗓️ Itinerary & Jadwal Perjalanan Interaktif
- Susunan kegiatan harian (*Day-by-Day schedule*) dari hari pertama hingga kepulangan.
- Jam kegiatan, estimasi waktu tempuh antar-lokasi, dan deskripsi detail aktivitas.
- Titik kumpul dan alamat keberangkatan lengkap dengan koordinat dan instruksi navigasi.
- Estimasi biaya tambahan opsional (sewa alat selam, tip ranger, pengeluaran pribadi).

### 4. 💳 Pemesanan Paket Wisata (`/booking/$tripId`)
- Pemilihan tanggal keberangkatan dari jadwal yang tersedia.
- Pengaturan jumlah peserta (Pax counter) dengan input nama masing-masing peserta.
- Pengisian data pemesan (Nama, email, nomor WhatsApp, catatan khusus).
- Fitur input **Kode Promo & Kupon** (misal: `AYOBAHARI35`, `BROMOSERU`, `JOGJAHEMAT`) dengan validasi instan & kalkulasi diskon otomatis.
- Rincian harga transparan (Subtotal, Diskon Kupon, Asuransi Gratis, Biaya Layanan, Total Pembayaran).
- Pilihan metode pembayaran (BCA Virtual Account, Mandiri, QRIS Instant, E-Wallet GoPay/ShopeePay, Kartu Kredit).
- Konfirmasi pemesanan instan yang otomatis menghasilkan **Kode Booking Unik** (misal: `AT-2026-7821`) dan tersimpan di penyimpanan persisten.

### 5. 👤 Akun, Riwayat Perjalanan & Wishlist
- **Riwayat Pemesanan (`/bookings`)**:
  - Filter status pesanan (*Semua*, *Dikonfirmasi*, *Menunggu Pembayaran*, *Selesai*, *Dibatalkan*).
  - **E-Ticket Pop-up**: Tampilan tiket elektronik resmi lengkap dengan QR Code, kode booking, jadwal, titik kumpul, dan status lunas.
  - **Batalkan Pemesanan**: Fasilitas pembatalan dengan alasan dan proses refund sesuai ketentuan.
  - **Beri Ulasan**: Formulir rating bintang 1-5 dan komentar untuk perjalanan yang telah selesai, yang langsung terintegrasi ke data paket wisata.
- **Paket Wisata Favorit (`/wishlist`)**:
  - Menyimpan paket idaman untuk dipesan kemudian hari.
- **Profil Pengguna (`/profile`)**:
  - Identitas pengguna, tier membership (*Platinum Voyager*), poin reward AyoTrip.
  - Dialog edit data profil (nama, telepon, email).
  - Dialog registrasi dan login akun baru.

---

## 📁 Struktur Direktori Project

```text
ayotrip-mobile/
├── capacitor.config.ts      # Konfigurasi Capacitor (App ID, App Name, webDir)
├── components.json          # Konfigurasi Shadcn UI CLI
├── vite.config.ts           # Konfigurasi Vite, Tailwind v4, & TanStack Router Plugin
├── tsconfig.json            # Konfigurasi TypeScript & Path Aliases (@/*)
├── src/
│   ├── components/
│   │   └── ui/              # 63+ Komponen Shadcn UI lengkap (Dialog, Sheet, Button, dll)
│   ├── lib/
│   │   ├── queryClient.ts   # Konfigurasi singleton TanStack QueryClient
│   │   └── utils.ts         # Utility classnames (cn helper)
│   ├── routes/              # File-based routing TanStack Router
│   │   ├── __root.tsx       # Root layout mobile: Header, Bottom Nav (5 Tab), Toaster
│   │   ├── index.tsx        # Beranda (Banner Promo, Kategori, Trending, Rekomendasi)
│   │   ├── search.tsx       # Pencarian, Filter Harga/Kota/Durasi & Sorting
│   │   ├── trips.$tripId.tsx # Detail Paket Wisata, Itinerary Day-by-Day, Fasilitas, Vendor
│   │   ├── booking.$tripId.tsx # Form Checkout, Pilih Tanggal, Pax, Kode Kupon, Bayar
│   │   ├── bookings.tsx     # Riwayat Pemesanan, E-Ticket QR Code, Pembatalan, Beri Ulasan
│   │   ├── wishlist.tsx     # Paket Wisata Favorit
│   │   ├── profile.tsx      # Akun Pengguna, Login/Daftar, Edit Profil
│   │   ├── create.tsx       # Form Rencana Trip Baru (TanStack Form + Query)
│   │   └── about.tsx        # Spesifikasi Arsitektur Native
│   ├── services/
│   │   ├── tripService.ts   # Data layer wisata, vendor, itinerary & destinasi
│   │   ├── bookingService.ts# Manajemen pemesanan & E-Ticket (LocalStorage persisten)
│   │   ├── authService.ts   # Profil pengguna & autentikasi
│   │   └── wishlistService.ts# Manajemen favorit / bookmark
│   ├── routeTree.gen.ts     # Auto-generated route tree TanStack Router
│   ├── index.css            # Tailwind CSS v4 & styling mobile safe-area
│   ├── App.tsx              # RouterProvider & QueryClientProvider setup
│   └── main.tsx             # Entry point React
└── package.json
```

---

## 🚀 Panduan Menjalankan Project

### 1. Web Dev Server (Live Preview)
```bash
npm run dev
```
Buka browser di `http://localhost:3000` (disarankan mengaktifkan mode *Responsive Device / Mobile* di Chrome DevTools).

### 2. Memeriksa Build Produksi & Type-Check
```bash
npm run build
```

### 3. Sinkronisasi ke Platform Mobile (Capacitor)
```bash
# Tambah platform Android (jika pertama kali)
npm run cap:add:android

# Build web & sync ke platform native
npm run build:mobile

# Buka project di Android Studio
npm run cap:android
```
