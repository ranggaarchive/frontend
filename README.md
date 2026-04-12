# Platform Investasi Saham UMKM

Platform marketplace untuk menghubungkan investor dengan UMKM (Usaha Mikro Kecil Menengah) di Indonesia. Aplikasi ini memungkinkan UMKM untuk listing usaha mereka, investor untuk membeli saham, dan auditor untuk memvalidasi kelayakan listing.

## Fitur Utama

### 🏢 Untuk Pemilik UMKM
- Dashboard untuk monitoring performa saham
- Form pengajuan listing usaha
- Upload laporan keuangan berkala
- Manajemen profil usaha
- Tracking investor

### 💰 Untuk Investor
- Marketplace UMKM terverifikasi dengan filter & sorting
- Orderbook real-time untuk trading saham
- Chart harga dengan timeframe selector (1D, 1W, 1M, 3M, 1Y)
- Portfolio management dengan pie chart & breakdown
- Portfolio performance chart
- Top gainers & top volume
- Tracking performa investasi real-time

### ✅ Untuk Auditor
- Review pengajuan listing UMKM
- Validasi dokumen dan laporan keuangan
- Approve/reject listing
- Dashboard monitoring

## Fitur Visual

- **Chart Interaktif**: Line chart, area chart, dan pie chart menggunakan Recharts
- **Gradient Background**: Desain modern dengan gradient background
- **Responsive Design**: Tampilan optimal di semua ukuran layar
- **Hover Effects**: Animasi smooth pada card dan button
- **Professional UI**: Desain yang clean dan profesional seperti aplikasi trading modern

## Tech Stack

- **React 19** - UI Framework
- **React Router DOM 7** - Routing
- **Shadcn UI** - Component Library
- **Tailwind CSS 4** - Styling
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Lucide React** - Icons

## Struktur Halaman

```
/                           - Landing page
/login                      - Login page
/register                   - Register page

# Investor Routes
/investor/dashboard         - Dashboard investor
/investor/marketplace       - Marketplace UMKM
/investor/portfolio         - Portfolio investasi
/investor/orderbook/:id     - Orderbook trading

# UMKM Routes
/umkm/dashboard            - Dashboard UMKM
/umkm/listing              - Form pengajuan listing
/umkm/reports              - Laporan keuangan
/umkm/profile              - Profil usaha

# Auditor Routes
/auditor/dashboard         - Dashboard auditor
/auditor/review/:id        - Review pengajuan
/auditor/approved          - Daftar UMKM approved
```

## Instalasi

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

Aplikasi ini menggunakan:
- Shadcn UI components yang sudah terinstall
- React Router DOM untuk routing
- TypeScript untuk type safety
- Vite untuk fast development

Semua komponen UI menggunakan Shadcn UI yang sudah ada di `src/components/ui/`.

## Catatan

Ini adalah prototype/demo aplikasi. Untuk production:
- Implementasi backend API
- Tambahkan authentication & authorization
- Implementasi real-time orderbook dengan WebSocket
- Tambahkan payment gateway
- Implementasi file upload yang proper
- Tambahkan validasi form yang lebih ketat
- Implementasi state management (Redux/Zustand)
