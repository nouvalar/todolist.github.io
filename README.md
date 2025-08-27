# Timeline Magang Harian

Aplikasi timeline untuk mencatat aktivitas magang harian dengan fitur sinkronisasi cloud antar device.

## Fitur Utama

- 📝 Tambah, edit, dan hapus aktivitas magang
- 🏷️ Kategorisasi aktivitas (Belajar, Praktik, Meeting, Review, dll)
- 📅 Tracking tanggal dan durasi aktivitas
- 🖼️ Upload dan preview gambar aktivitas
- 🔄 Sinkronisasi data antar device menggunakan GitHub Gist
- 📱 Responsive design untuk mobile dan desktop
- 💾 Penyimpanan lokal sebagai backup

## Cara Menggunakan Cloud Sync

### 1. Buat GitHub Personal Access Token

1. Buka [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Klik "Generate new token (classic)"
3. Beri nama token (misal: "Timeline Magang Sync")
4. Pilih scope: `gist` (untuk membuat dan mengupdate gist)
5. Klik "Generate token"
6. **Copy token yang dihasilkan** (jangan share ke siapapun!)

### 2. Konfigurasi di Aplikasi

1. Buka aplikasi Timeline Magang Harian
2. Masukkan GitHub token di bagian "Konfigurasi Cloud Sync"
3. Klik "Simpan Token"
4. Status akan berubah menjadi "Online - Data tersinkronisasi ke cloud"

### 3. Sinkronisasi Otomatis

- Setelah token dikonfigurasi, data akan otomatis tersimpan ke cloud
- Setiap kali ada perubahan (tambah/edit/hapus aktivitas), data akan tersinkronisasi
- Data akan tersedia di device lain yang menggunakan token yang sama

## Struktur Data

Data disimpan dalam format JSON dengan struktur:

```json
{
  "dailyTasks": [
    {
      "id": 1234567890,
      "date": "2025-01-27",
      "title": "Judul Aktivitas",
      "description": "Deskripsi detail aktivitas",
      "category": "Belajar",
      "duration": 2.5,
      "status": "Selesai",
      "image": {
        "name": "gambar.jpg",
        "data": "data:image/jpeg;base64,...",
        "type": "image/jpeg"
      },
      "createdAt": "2025-01-27T10:00:00.000Z",
      "updatedAt": "2025-01-27T10:00:00.000Z"
    }
  ],
  "lastUpdated": "2025-01-27T10:00:00.000Z"
}
```

## Keamanan

- GitHub token disimpan secara lokal di browser
- Data disimpan dalam private Gist (hanya bisa diakses dengan token)
- Jangan share token dengan siapapun
- Jika token terkompromi, hapus token lama dan buat yang baru

## Troubleshooting

### Data tidak tersinkronisasi
- Pastikan token GitHub valid dan memiliki permission `gist`
- Cek koneksi internet
- Coba klik "Sinkronisasi Sekarang"

### Token tidak tersimpan
- Pastikan browser mendukung localStorage
- Coba refresh halaman setelah simpan token

### Data hilang
- Data lokal tersimpan di browser, tidak akan hilang kecuali dihapus manual
- Gunakan fitur "Hapus Data Lokal" untuk reset data lokal
- Data di cloud tetap aman

## Teknologi

- HTML5, CSS3, JavaScript ES6+
- GitHub Gist API untuk cloud storage
- LocalStorage untuk offline backup
- Responsive design dengan CSS Grid dan Flexbox

## Lisensi

Open source - silakan gunakan dan modifikasi sesuai kebutuhan. 