# AyoTrip Mobile 🏝️🚀

Aplikasi mobile modern untuk penjelajahan destinasi wisata di Indonesia. Dibangun dengan standar arsitektur frontend senior menggunakan kombinasi **Capacitor JS**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Shadcn UI (Full Pack)**, **TanStack Query v5**, **TanStack Form**, dan **TanStack Router**.

---

## 🛠️ Tech Stack & Spesifikasi

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Mobile Runtime** | **Capacitor JS (v8.x)** | Hybrid mobile wrapper untuk Android & iOS |
| **Core Framework** | **React 19 + TypeScript 6** | UI component declarative & strict type safety |
| **Build Tool** | **Vite 8** | High-performance HMR bundler |
| **Styling** | **Tailwind CSS v4** | Modern utility-first CSS engine |
| **UI Components** | **Shadcn UI (65+ Components)** | Komponen modular & aksesibel lengkap |
| **Data Fetching** | **TanStack Query (v5.x)** | Cache management, async state, background sync |
| **Form Handling** | **TanStack Form (v1.x)** | Type-safe form validation & state |
| **Navigation & Routing**| **TanStack Router (v1.x)** | Type-safe file-based router dengan auto code splitting |
| **Toast & Notification**| **Sonner** | Interactive toast notifications |

---

## 📁 Struktur Direktori Project

```text
ayotrip-mobile/
├── android/                 # (Generated via `npx cap add android`)
├── ios/                     # (Generated via `npx cap add ios`)
├── capacitor.config.ts      # Konfigurasi Capacitor (App ID, App Name, webDir)
├── components.json          # Konfigurasi Shadcn UI CLI
├── vite.config.ts           # Konfigurasi Vite, Tailwind v4, & TanStack Router Plugin
├── tsconfig.json            # Konfigurasi TypeScript & Path Aliases (@/*)
├── src/
│   ├── components/
│   │   └── ui/              # 65+ Komponen Shadcn UI lengkap (Button, Card, Badge, dll)
│   ├── hooks/               # Custom hooks (use-mobile, use-toast, dll)
│   ├── lib/
│   │   ├── queryClient.ts   # Konfigurasi singleton TanStack QueryClient
│   │   └── utils.ts         # Utility classnames (cn helper)
│   ├── routes/              # File-based routing TanStack Router
│   │   ├── __root.tsx       # Root layout mobile: Header, Bottom Nav, Safe Area, Toaster
│   │   ├── index.tsx        # Halaman Home/Eksplor (TanStack Query list + Search + Filter)
│   │   ├── trips.$tripId.tsx # Dynamic Route: Detail Trip dengan TanStack Query caching
│   │   ├── create.tsx       # Form Rencana Trip menggunakan TanStack Form + Query Mutation
│   │   └── about.tsx        # Informasi arsitektur & testing native bridge
│   ├── services/
│   │   └── tripService.ts   # Data layer & simulasi API destinasi wisata
│   ├── routeTree.gen.ts     # Auto-generated route tree TanStack Router
│   ├── index.css            # Tailwind CSS v4 & styling mobile safe-area
│   ├── App.tsx              # Setup RouterProvider & QueryClientProvider
│   └── main.tsx             # Entry point React
└── package.json
```

---

## 🚀 Panduan Memulai (Development)

### 1. Menjalankan Web Dev Server
```bash
npm run dev
```
Buka browser di `http://localhost:3000` (disarankan inspect element dalam mode **Responsive Mobile Device**, misal iPhone 14 Pro atau Pixel 7).

### 2. Memeriksa Build Produksi & Type-Check
```bash
npm run build
```

---

## 📱 Menjalankan di Native Mobile (Capacitor)

### 1. Menyiapkan Platform Android / iOS
Pastikan Anda telah menginstal **Android Studio** (untuk Android) atau **Xcode** (untuk iOS di macOS).

```bash
# Tambah platform Android
npm run cap:add:android

# Tambah platform iOS (khusus macOS)
npm run cap:add:ios
```

### 2. Sync Aset Web ke Platform Mobile
Setiap kali selesai melakukan perubahan kode atau build web:
```bash
npm run build:mobile
```
*(Perintah ini otomatis menjalankan `npm run build` dan `npx cap sync`)*.

### 3. Membuka di Android Studio / Xcode
```bash
# Buka di Android Studio
npm run cap:android

# Buka di Xcode
npm run cap:ios
```

---

## 🧩 Contoh Rute & Integrasi yang Disediakan

1. **Rute Beranda (`src/routes/index.tsx`)**:
   - Menampilkan daftar destinasi wisata nusantara.
   - Menggunakan `useQuery` dari `@tanstack/react-query` dengan cache time dan skeleton loading.
   - Filter kategori real-time (`Beach`, `Mountain`, `Adventure`, `Culture`) dan instant search.
   - Terintegrasi dengan komponen Shadcn UI (`Card`, `Badge`, `Input`, `Skeleton`, `Button`).

2. **Rute Dinamis Trip Detail (`src/routes/trips.$tripId.tsx`)**:
   - Mengambil parameter URL `$tripId` via `Route.useParams()` yang fully type-safe.
   - Fetching detail data spesifik via TanStack Query.
   - Tombol back, bookmark, dan aksi *Booking* dengan feedback `sonner` toast.

3. **Rute Buat Trip Baru (`src/routes/create.tsx`)**:
   - Menggunakan `@tanstack/react-form` untuk validasi field reaktif (nama trip, destinasi, harga, durasi, deskripsi).
   - Menjalankan `useMutation` dari TanStack Query untuk menambah data baru dan otomatis meng-invalidate cache query `['trips']`.
   - Otomatis navigasi kembali ke halaman utama setelah sukses.
