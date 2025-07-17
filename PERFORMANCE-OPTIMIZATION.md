# Optimasi Performa Next.js

Dokumen ini menjelaskan cara mengatasi pesan "Slow filesystem detected" pada Next.js.

## Masalah
```
Slow filesystem detected. The benchmark took 541ms. If D:\PROJECT ONLINE\inulpro\.next is a network drive, consider moving it to a local folder.
```

## Solusi yang Sudah Diterapkan

### 1. Optimasi Next.js Config
- ✅ Ditambahkan konfigurasi webpack untuk development
- ✅ Optimasi caching filesystem
- ✅ Optimasi package imports
- ✅ Konfigurasi watch options untuk polling

### 2. Script Symlink ke Drive Lokal
File: `setup-local-next.ps1`

**Cara menggunakan:**
```powershell
# Jalankan sebagai Administrator
.\setup-local-next.ps1
```

Script ini akan:
- Membuat folder `C:\temp\inulpro-next`
- Membuat symbolic link dari `.next` ke folder lokal
- Backup `.next` yang ada jika diperlukan

### 3. Solusi Manual Lainnya

#### A. Exclude dari Antivirus
Tambahkan folder berikut ke whitelist antivirus:
- `D:\PROJECT ONLINE\inulpro`
- `D:\PROJECT ONLINE\inulpro\.next`
- `D:\PROJECT ONLINE\inulpro\node_modules`

#### B. Pindah ke Drive Lokal
```bash
# Clone/pindah proyek ke drive lokal
git clone <repo-url> C:\projects\inulpro
cd C:\projects\inulpro
npm install
npm run dev
```

#### C. Optimasi Windows
1. Disable Windows Defender real-time scanning untuk folder proyek
2. Gunakan SSD untuk development
3. Tutup aplikasi yang tidak perlu

## Verifikasi Performa

Setelah menerapkan solusi, jalankan:
```bash
npm run dev
```

Pesan "Slow filesystem detected" seharusnya tidak muncul lagi, atau waktu benchmark akan lebih rendah (<200ms).

## Troubleshooting

### Symbolic Link Gagal
```powershell
# Pastikan menjalankan sebagai Administrator
# Atau gunakan mklink manual:
mklink /D ".next" "C:\temp\inulpro-next"
```

### Permission Error
```bash
# Pastikan folder target dapat ditulis
icacls "C:\temp\inulpro-next" /grant Users:F
```

### Masih Lambat
1. Cek apakah antivirus masih scanning
2. Pastikan menggunakan SSD
3. Coba pindah seluruh proyek ke `C:\`

## Monitoring Performa

Gunakan tools berikut untuk monitor:
```bash
# Next.js build analyzer
npm run build -- --analyze

# Webpack bundle analyzer
npm install --save-dev webpack-bundle-analyzer
```
