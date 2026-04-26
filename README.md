# Dokumentasi Frontend JArchive

Frontend JArchive adalah antarmuka pengguna berbasis web untuk platform repositori lokal. Aplikasi ini dibangun dengan React.js dan Vite, dirancang secara responsif menggunakan TailwindCSS serta pustaka komponen daisyUI.

## Struktur Direktori

* **src/assets**: Penyimpanan file statis seperti gambar (logo, latar belakang, pratinjau antarmuka) dan ikon SVG.
* **src/components**: Modul komponen antarmuka mandiri, meliputi `Header.jsx`, `Sidebar.jsx`, dan `FileCard.jsx`.
* **src/controller**: Modul pemroses HTTP request ke backend menggunakan klien Axios (`file.controller.js` dan `user.controller.js`).
* **src/layouts**: Modul pembungkus struktur halaman, seperti `HomeLayouts.jsx` dan `MainLayouts.jsx` untuk menjaga konsistensi elemen navigasi.
* **src/pages**: Komponen tingkat halaman seperti `HomePage.jsx`, `Dashboard.jsx`, `Login.jsx`, `LogPage.jsx`, dan `RequestPage.jsx`.
* **src/index.css**: File *stylesheet* utama yang memuat arahan (directives) dari TailwindCSS.
* **vite.config.js**: File konfigurasi utama untuk bundler Vite, termasuk konfigurasi alias *path*.

## Variabel Lingkungan (.env)

Frontend membutuhkan definisi lokasi server backend. Gunakan referensi dari `jarchive-frontend/.env.example` untuk membuat file `.env` di root direktori frontend.

```env
# URL lengkap menuju server backend. 
# Jika dijalankan di jaringan lokal, gunakan IP statis server, bukan localhost.
VITE_API_URL=http://<IP_SERVER_BACKEND>:<PORT_BACKEND>
```

## Persiapan & Eksekusi Lokal (Development)

Eksekusi lokal digunakan untuk pengembangan dan pengujian sebelum masuk tahap *build production*.

1. Pastikan Node.js telah terinstal.
2. Navigasi ke direktori frontend:
   ```bash
   cd jarchive-frontend
   ```
3. Instal semua dependensi dari `package.json`:
   ```bash
   npm install
   ```
4. Jalankan *development server*:
   ```bash
   npm run dev
   ```

## Deployment Docker (Production)

Frontend ini dilengkapi dengan `Dockerfile` dengan skema *multi-stage build*. Node.js mem-build aset statis, lalu hasilnya dilayani menggunakan server web Nginx.

Penggunaan paling efisien adalah melalui *Docker Compose* di folder infrastruktur, namun Anda bisa membangun container secara terisolasi dengan perintah:

```bash
# Ganti argumen VITE_API_URL dengan alamat backend production Anda
docker build --build-arg VITE_API_URL=http://100.94.226.75:61070 -t jarchive-frontend .

docker run -d -p 11223:80 --name jarchive-frontend jarchive-frontend
```

## Dependensi Utama

Berdasarkan `package.json`, modul utama yang menggerakkan logika dan tampilan aplikasi meliputi:
* **React & React DOM**: Inti pustaka perenderan antarmuka.
* **Vite**: Pemaket aset *build tool* (pengganti Webpack/CRA).
* **Axios**: Klien HTTP berorientasi Promise untuk komunikasi REST API.
* **jwt-decode**: Ekstraktor payload JSON Web Token tanpa verifikasi signature untuk keperluan otorisasi role di sisi klien.
* **Tailwind CSS & daisyUI**: Utilitas penata gaya CSS dan plugin komponen semantik.
* **Lucide React**: Implementasi set ikon vektor standar antarmuka.