# REST API - Sistem Jadwal Pelajaran Sekolah

RESTful API ini dibangun menggunakan Node.js (Express), PostgreSQL (didukung oleh Prisma ORM), dan Multer untuk mengelola dan menganalisis jadwal pelajaran sekolah secara daring.

API ini didesain untuk tiga kelompok pengguna utama:
1. **Siswa:** Untuk melihat jadwal belajar harian.
2. **Guru:** Untuk melihat jadwal mengajar serta menghitung total Jam Pelajaran (JP).
3. **Yayasan / Admin:** Untuk mengelola (CRUD), mengimpor jadwal secara massal (Upload Excel), dan mengekspor laporan aktivitas pengajar ke dalam format Excel (.xlsx).

## Fitur Utama

- **CRUD Jadwal Pelajaran:** Mengelola data jadwal (Tambah, Lihat, Ubah, Hapus).
- **Deteksi Bentrok Jadwal (Bonus):** Mencegah guru atau kelas yang sama dijadwalkan lebih dari satu kali di jam dan tanggal yang sama.
- **Laporan Jam Pelajaran (JP):** Menghitung beban mengajar guru secara otomatis per pekan.
- **Import/Export Excel:** 
  - *Bulk insert* data jadwal menggunakan file excel (`.xlsx`).
  - *Generate* dan *download* laporan rekapitulasi JP per guru ke dalam file `.xlsx`.
- **Autentikasi API Key:** Seluruh *endpoint* dilindungi dan diakses menggunakan *header* `x-api-key`.
- **Swagger Documentation:** Dokumentasi interaktif yang sudah disediakan.

## Teknologi yang Digunakan

- **Backend:** Node.js, Express.js
- **Database:** Prisma ORM, PostgreSQL (Dapat dijalankan secara lokal dengan SQLite saat development)
- **Library:** `exceljs` (Excel Parser), `multer` (File Upload), `swagger-jsdoc` & `swagger-ui-express` (Dokumentasi API).

## Cara Menjalankan secara Lokal

1. **Clone repository ini**
   ```bash
   git clone https://github.com/ToxicBeastt/edulab-schedule-api.git
   cd edulab-schedule-api
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Inisialisasi Database Lokal (SQLite)**
   Untuk keperluan testing lokal, proyek ini menggunakan SQLite bawaan Prisma.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Jalankan Server**
   ```bash
   npm run dev
   ```
   API akan berjalan pada `http://localhost:3000`. 
   Dokumentasi interaktif dapat diakses pada **`http://localhost:3000/api-docs`**.

## Autentikasi API

Semua *request* harus menyertakan Header autentikasi:
- **Key:** `x-api-key`
- **Value:** `SECRET123`

## Endpoint Utama

| Metode | Endpoint | Deskripsi |
| --- | --- | --- |
| `POST` | `/api/schedules` | Menambahkan jadwal baru (termasuk deteksi bentrok). |
| `GET` | `/api/schedules/student` | Menampilkan jadwal belajar siswa berdasarkan kelas & tanggal. |
| `GET` | `/api/schedules/teacher` | Menampilkan jadwal mengajar & Total JP guru per periode. |
| `POST` | `/api/schedules/upload` | Import/Upload file Excel jadwal secara massal. |
| `GET` | `/api/schedules/export` | Export laporan rekap JP ke format Excel. |

## Deployment (Ke Vercel)

Aplikasi ini sudah dipersiapkan (`vercel.json`) untuk di-*deploy* langsung ke Vercel dengan *serverless functions*. Pastikan Anda mengganti konfigurasi Prisma ke PostgreSQL (*Neon/Supabase*) pada `schema.prisma` sebelum melakukan *deployment* produk ke *production*.
