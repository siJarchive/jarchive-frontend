<div align="center">
  <h1>Jarchive Frontend</h1>
  <p>Antarmuka pengguna berbasis web untuk platform repositori lokal Jarchive menggunakan React dan Vite.</p>
  <p>
    <a href="https://github.com/siJarchive/jarchive-infrastructure">Infrastructure</a> |
    <a href="https://github.com/siJarchive/jarchive-backend">Backend</a>
  </p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/daisyUI-5.x-563D7C?logo=daisyui&logoColor=white" alt="daisyUI">
</p>

---

Frontend Jarchive adalah antarmuka pengguna berbasis web untuk platform repositori lokal Jarchive. Dibangun dengan React dan Vite, beroperasi sepenuhnya di sisi klien (client-side rendering) dan berkomunikasi ke backend melalui REST API.

## Daftar Isi

- [Fitur](#fitur)
- [Konsep dan Arsitektur](#konsep-dan-arsitektur)
- [Struktur Repository](#struktur-repository)
- [Dependensi Utama](#dependensi-utama)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Deployment](#deployment)
- [Manajemen dan Operasional](#manajemen-dan-operasional)
- [Keamanan](#keamanan)
- [Lisensi](#lisensi)

---

## Fitur

| Fitur | Deskripsi |
| --- | --- |
| Responsive Dashboard | Panel navigasi dinamis untuk memantau aset, permintaan, dan log sistem. |
| Role-Based Authorization | Pembatasan tampilan antarmuka (Guru/Siswa) menggunakan dekripsi token JWT sisi klien melalui `jwt-decode`. Bersifat kosmetik di frontend; lihat bagian Keamanan. |
| Asynchronous Data Fetching | Manajemen request HTTP ke REST API backend menggunakan klien Axios terpusat. |
| Stream and Download Interface | Pemutar media bawaan untuk file video serta interaksi unduhan aset sekali klik. |
| Client-side Routing | Navigasi antar halaman (`/`, `/login`, `/dashboard`, `/admin/logs`, `/admin/requests`) menggunakan React Router (`BrowserRouter`). |
| Notifikasi Toast | Notifikasi aksi pengguna menggunakan `react-hot-toast`. |

---

## Konsep dan Arsitektur

Antarmuka beroperasi sepenuhnya di sisi klien dan berkomunikasi secara eksternal ke backend API melalui lapisan controller Axios.

```text
+-------------------------------------------------------+
|                    Browser Klien                      |
|                                                       |
|   +---------------+      +------------------------+   |
|   |Pages & Layout | ---> |Components (UI Elements)|   |
|   +---------------+      +------------------------+   |
|           |                          |                |
|           v                          v                |
|   +-----------------------------------------------+   |
|   |         Controllers (Axios Instances)         |   |
|   +-----------------------------------------------+   |
+-------------------------------------------------------+
                                |
                          HTTP Requests
                                |
                                v
                    +-----------------------+
                    |   Backend API Server  |
                    |     (VITE_API_URL)    |
                    +-----------------------+
```

---

## Struktur Repository

```
jarchive-frontend/
├── index.html
├── vite.config.js          Alias '@' -> /src; plugin Tailwind v4; dev server host 0.0.0.0.
├── eslint.config.js
├── Dockerfile               Multi-stage: node:20-bookworm (build) -> nginx:alpine (serve).
├── public/
│   ├── vite.svg
│   └── robots.txt
├── src/
│   ├── main.jsx              Entry point React (StrictMode).
│   ├── App.jsx                Definisi BrowserRouter dan seluruh Route.
│   ├── index.css
│   ├── assets/                 Gambar statis (logo, ilustrasi, screenshot).
│   ├── components/             Header, Sidebar, FileCard, FileCardExample.
│   ├── controller/             file.controller.js, user.controller.js (Axios).
│   ├── layouts/                 HomeLayouts, MainLayouts.
│   └── pages/                  HomePage, Dashboard, Login, LogPage, RequestPage.
├── .env.example
├── .gitignore
├── package.json / package-lock.json
└── README.md
```

---

## Dependensi Utama

Berdasarkan `package.json`:

| Dependensi | Versi | Keterangan |
| --- | --- | --- |
| React & React DOM | ^19.2 | Inti pustaka perenderan antarmuka. |
| Vite | ^7.2 (devDependency) | Build tool / dev server. |
| Tailwind CSS + `@tailwindcss/vite` | ^4.1 | Utilitas styling, terpasang sebagai plugin Vite native (bukan PostCSS). |
| daisyUI | ^5.5 | Plugin komponen UI berbasis Tailwind. |
| Axios | ^1.13 | Klien HTTP berorientasi Promise. |
| jwt-decode | ^4.0 | Ekstraksi payload JWT tanpa verifikasi signature, untuk kebutuhan tampilan berbasis peran. |
| React Router DOM | ^7.12 | Routing client-side (`BrowserRouter`). |
| React Hot Toast | ^2.6 | Notifikasi toast. |
| Lucide React | ^0.562 | Set ikon vektor. |

---

## Prasyarat

| Komponen | Spesifikasi / Versi | Keterangan |
| --- | --- | --- |
| Node.js | >= 18.x | Lingkungan runtime untuk kompilasi dan bundler. Dockerfile resmi menggunakan image `node:20-bookworm`. |
| npm | >= 9.x | Manajemen paket dependensi pustaka. |
| Nginx | Alpine | Digunakan pada stage kedua Dockerfile untuk menyajikan hasil build. |

---

## Instalasi

```bash
git clone https://github.com/siJarchive/jarchive-frontend.git
cd jarchive-frontend
npm install
```

---

## Konfigurasi Environment

```bash
cp .env.example .env
```

| Variabel Lingkungan | Wajib | Default | Deskripsi |
| --- | --- | --- | --- |
| `VITE_API_URL` | Ya | tidak ada | Endpoint absolut REST API backend, contoh `http://192.168.1.10:5000`. Gunakan IP statis/domain, bukan localhost, untuk akses jaringan lokal. |

Catatan: nilai `VITE_API_URL` dibakukan ke dalam bundle statis pada saat proses build (baik `npm run build` maupun `docker build --build-arg`). Mengubah `.env` setelah build tidak memengaruhi hasil build yang sudah ada; diperlukan build ulang.

---

## Deployment

### Development

```bash
npm run dev
```

Dev server Vite dikonfigurasi mendengarkan `0.0.0.0`, sehingga dapat diakses dari perangkat lain pada jaringan lokal yang sama.

### Docker Standalone (Production)

Multi-stage build: Node.js mengompilasi aset statis pada stage pertama, Nginx menyajikan hasilnya pada stage kedua.

```bash
docker build --build-arg VITE_API_URL=http://192.168.1.10:5000 -t jarchive-frontend .
docker run -d -p 11223:80 --name jarchive-frontend jarchive-frontend
```

Konfigurasi Nginx (`default.conf`) digenerate langsung oleh Dockerfile dengan arahan `try_files $uri $uri/ /index.html` agar mendukung client-side routing dari React Router. Tanpa konfigurasi ini, refresh pada rute seperti `/dashboard` akan menghasilkan 404 dari Nginx.

Penggunaan paling efisien adalah melalui Docker Compose pada repository `jarchive-infrastructure`.

---

## Manajemen dan Operasional

Build manual aset produksi tanpa container:

```bash
npm run build
npm run preview
```

---

## Keamanan

`jwt-decode` hanya mendekode payload token tanpa memverifikasi signature. Pembatasan tampilan berbasis peran (Guru/Siswa) di frontend bersifat kosmetik, bukan kontrol keamanan. Kontrol akses sesungguhnya harus diterapkan di sisi backend; pada kondisi backend saat ini, validasi tersebut belum diterapkan (lihat README `jarchive-backend`, bagian Keamanan).

---

## Lisensi

Tidak ditemukan berkas `LICENSE` maupun field `license` pada `package.json`. Status lisensi repository ini belum dideklarasikan secara resmi.

---

<div align="center">
  <sub>Jarchive Frontend &nbsp;|&nbsp; <a href="https://github.com/siJarchive/jarchive-infrastructure">Infrastructure</a> &nbsp;|&nbsp; <a href="https://github.com/siJarchive/jarchive-backend">Backend</a></sub>
</div>
