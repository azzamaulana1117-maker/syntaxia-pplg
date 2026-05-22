# Syntaxia Class — Kelas X PPLG SMK Assa'idiyah

Portal web kelas dengan login admin/member, mode gelap/terang, dan menu Dynamic Island.

## Cara menjalankan

Buka file `index.html` di browser, atau jalankan server lokal:

```bash
cd syntaxia-class
npx serve .
```

Lalu buka `http://localhost:3000` (atau port yang ditampilkan).

## Login

| Role   | Username | Password      |
|--------|----------|---------------|
| Admin  | admin    | syntaxia2025  |
| Member | member   | kelasx        |

Sesi tetap aktif setelah refresh sampai logout.

## Fitur

- Beranda: wali kelas, total siswa (tanpa menu menumpuk)
- Dynamic Island: semua menu di tombol menu mengambang
- Data siswa, organisasi (mind map ke bawah), jadwal pelajaran & piket (Senin–Sabtu)
- Jadwal piket: centang (✓) / silang (✗) per siswa
- Ranking semester 1–6 + gasal/genap untuk Kelas X, XI, XII
- Admin dapat mengedit data via JSON (termasuk ranking)
- Mode gelap / terang, dominan biru

Data disimpan di `localStorage` browser.

## Deployment (Publish online)

Pilihan cepat: deploy ke GitHub Pages. Langkah singkat:

1. Buat repository GitHub dan tambahkan remote, atau gunakan repository baru.

```bash
cd syntaxia-class
git init
git add .
git commit -m "Initial project"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

2. Workflow GitHub Actions (`.github/workflows/deploy.yml`) akan otomatis menjalankan deploy ke branch `gh-pages` saat ada push ke `main`.

3. Setelah Actions selesai, aktifkan GitHub Pages di settings repo: pilih branch `gh-pages` sebagai sumbernya. Situs biasanya tersedia di `https://<your-username>.github.io/<your-repo>/`.

Alternatif cepat tanpa GitHub: gunakan Netlify atau Vercel (drag-and-drop atau connect repo). Jika mau, saya bisa bantu menyiapkan konfigurasi Netlify/Vercel juga.

### Deploy ke Vercel

1. Cara otomatis (connect repo):

- Push kode ke GitHub/GitLab/Bitbucket.
- Buka https://vercel.com, klik "New Project", lalu pilih repo Anda. Vercel akan mendeteksi proyek statis secara otomatis.

2. Cara cepat (lokal) menggunakan CLI:

```bash
npm i -g vercel
cd syntaxia-class
vercel           # ikuti prompt, pilih scope dan beri nama (atau tekan enter)
vercel --prod    # deploy ke production
```

File konfigurasi `vercel.json` sudah ditambahkan untuk memastikan `index.html` dilayani sebagai root.

Butuh saya bantu untuk menghubungkan repo dan memicu deploy? Beri tahu apakah Anda mau saya buatkan commit & push (perlu akses ke remote), atau panduan langkah demi langkah saat Anda siap.
