<div align="center">
  <h1>Jarchive Frontend</h1>
  <p>Antarmuka pengguna berbasis web untuk platform repositori lokal Jarchive menggunakan React dan Vite.</p>
  <p>
    <a href="https://github.com/siJarchive/jarchive-infrastructure">Infrastructure</a> | 
    <a href="https://github.com/siJarchive/jarchive-backend">Backend</a>
  </p>
</div>

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)
![daisyUI](https://img.shields.io/badge/daisyUI-4.x-563D7C?logo=daisyui&logoColor=white)

## Fitur

| Fitur | Deskripsi |
| --- | --- |
| Responsive Dashboard | Panel navigasi dinamis untuk memantau aset, permintaan, dan log sistem. |
| Role-Based Authorization | Pembatasan akses antarmuka (Guru/Siswa) menggunakan dekripsi token JWT sisi klien. |
| Asynchronous Data Fetching | Manajemen request HTTP ke REST API backend menggunakan klien Axios terpusat. |
| Stream and Download Interface | Pemutar media bawaan untuk file video serta interaksi unduhan aset sekali klik. |

## Konsep dan Arsitektur

Antarmuka beroperasi sepenuhnya di sisi klien (Client-Side Rendering) dan berkomunikasi secara eksternal ke backend API melalui lapisan controller Axios.

```text
+-------------------------------------------------------+
|                    Browser Klien                      |
|                                                       |
|   +---------------+      +------------------------+   |
|   | Pages & Layout| ---> | Components (UI Elements|   |
|   +---------------+      +------------------------+   |
|           |                          |                |
|           v                          v                |
|   +-----------------------------------------------+   |
|   |          Controllers (Axios Instances)        |   |
|   +-----------------------------------------------+   |
+-------------------------------------------------------+
                                |
                         HTTP Requests
                                |
                                v
                    +-----------------------+
                    |  Backend API Server   |
                    |    (VITE_API_URL)     |
                    +-----------------------+

```

## Prasyarat

| Komponen | Spesifikasi / Versi | Keterangan |
| --- | --- | --- |
| Node.js | >= 18.x | Lingkungan runtime untuk kompilasi dan bundler |
| npm | >= 9.x | Manajemen paket dependensi pustaka |
| Nginx | Versi Alpine Terkini | Diperlukan jika melakukan deployment container manual |

## Instalasi

1. Kloning repositori frontend dan masuk ke direktori kerja:

```bash
git clone [https://github.com/siJarchive/jarchive-frontend.git](https://github.com/siJarchive/jarchive-frontend.git)
cd jarchive-frontend

```

2. Pasang seluruh dependensi proyek:

```bash
npm install

```

## Konfigurasi

Buat berkas `.env` pada root direktori proyek dengan menyalin contoh yang tersedia:

```bash
cp .env.example .env

```

| Variabel Lingkungan | Status | Default | Deskripsi |
| --- | --- | --- | --- |
| `VITE_API_URL` | Wajib | - | Endpoint URL absolut REST API backend (contoh: `http://192.168.1.10:5000`). Gunakan IP statis/domain, bukan localhost untuk akses jaringan lokal. |

## Struktur Direktori

| Direktori/File | Fungsi |
| --- | --- |
| `src/assets/` | Penyimpanan berkas statis lokal seperti gambar latar belakang, logo instansi, dan ikon SVG. |
| `src/components/` | Komponen UI modular yang dapat digunakan kembali (contoh: `Header`, `Sidebar`, `FileCard`). |
| `src/controller/` | Modul komunikasi HTTP berbasis Axios (`file.controller.js` dan `user.controller.js`). |
| `src/layouts/` | Struktur template tata letak halaman untuk menjaga konsistensi komponen navigasi. |
| `src/pages/` | Komponen utama tingkat halaman (Dashboard, Login, Halaman Log, Halaman Permintaan). |
| `src/index.css` | Berkas konfigurasi utama untuk injeksi utilitas Tailwind CSS. |
| `vite.config.js` | Berkas konfigurasi mesin pemaket Vite dan pemetaan alias direktori. |

## Manajemen dan Operasional

### Lingkungan Pengembangan (Development)

Menjalankan server lokal untuk kebutuhan modifikasi kode dengan fitur Hot Module Replacement (HMR):

```bash
npm run dev

```

### Lingkungan Produksi Terisolasi (Docker Standalone)

Proyek ini mendukung *multi-stage build*. Tahap pertama melakukan kompilasi aset statis melalui Node.js, dan tahap kedua memuat hasil kompilasi ke dalam server web Nginx.

1. Build image dengan menyuntikkan argumen URL API target:

```bash
docker build --build-arg VITE_API_URL=[http://192.168.1.10:5000](http://192.168.1.10:5000) -t jarchive-frontend .

```

2. Jalankan container secara terisolasi pada port host yang diinginkan:

```bash
docker run -d -p 11223:80 --name jarchive-frontend jarchive-frontend

```
