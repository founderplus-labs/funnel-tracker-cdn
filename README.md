# Funnel Toolkit — Founder+

Powered by **[Founder+](https://founderplus.id)** · **[Academy](https://academy.founderplus.id)** · **[Monetize.id](https://monetize.id)**

Bikin halaman jualan yang langsung bisa terima pembayaran, lacak konversi, dan punya komponen pemasaran siap pakai — cukup tempel satu baris script. Tidak perlu setup payment gateway, tidak perlu coding rumit, tidak perlu langganan tool macam-macam.

---

## Apa itu Founder+?

**Founder+** adalah ekosistem belajar dan monetisasi untuk founder Indonesia. Tempat kamu belajar bisnis dari praktisi, dapat tools yang langsung bisa dipakai, sampai jualan produk digital kamu sendiri.

Tiga pintu masuk utama:

- **[founderplus.id](https://founderplus.id)** — wajah utama Founder+. Cerita, artikel, dan jalur masuk ke semua produk.
- **[academy.founderplus.id](https://academy.founderplus.id)** — kelas, event, mentoring, plus 30+ tools gratis (kalkulator bisnis, prompt AI, template, AI Builder) dan **Creator Studio** untuk kamu jualan produk digital sendiri (course, ebook, event, template, dll).
- **[monetize.id](https://monetize.id)** — landing-landing tematik untuk produk-produk Founder+, contoh-contoh, dan jalan paling cepat dari ide ke uang masuk.

---

## Yang bisa kamu buat dengan toolkit ini

Cukup satu baris script di akhir halaman:

```html
<script src="https://cdn.founderplus.id/funnel-tracker.js" defer></script>
```

Tempel di halaman jualan kamu (HTML biasa, Notion, Carrd, Webflow, atau template Founder+) — dan kamu langsung dapat:

### 🛒 Tombol beli yang langsung jadi
Klik tombol → buyer masuk ke pembayaran Founder+ → bayar lewat transfer/QRIS/kartu → kamu dapat notif. **Kamu tidak perlu setup payment gateway**. Tidak perlu Stripe, tidak perlu Midtrans, tidak perlu pegang data kartu siapa pun.

```html
<button data-product-slug="ebook-saya-abcd1234"
        data-product-type="customProduct">Beli Sekarang</button>
```

### ⏰ Countdown urgency
Bikin penawaran terasa terbatas — dua mode siap pakai:

- **Per-pengunjung**: tiap orang dapat hitung mundur sendiri yang mulai dari saat dia buka halaman (cocok untuk "diskon 60 menit pertama"). Disimpan di browser-nya, refresh tidak reset.
- **Deadline tetap**: misal sampai 31 Desember 23:59 — sama buat semua orang.

```html
<div data-countdown-evergreen="60"></div>            <!-- 60 menit per pengunjung -->
<div data-countdown="2026-12-31T23:59"></div>        <!-- deadline pasti -->
```

### 📌 Tombol beli yang ikut scroll
Setelah pengunjung scroll melewati tombol utama, muncul tombol yang nempel di bawah layar — terutama penting di HP. Tinggal tambah satu kata kunci di tombol yang sudah ada.

```html
<button data-sticky-cta data-product-slug="..." data-product-type="customProduct">Beli</button>
```

### 📊 Tracking otomatis
UTM dari iklan/media sosial tercatat dan ikut sampai ke checkout — kamu tahu campaign mana yang menghasilkan penjualan. Tidak perlu pasang Google Analytics tambahan untuk ini.

### 🤖 Cocok dipakai bareng AI agent
Buka file [`/llms.txt`](https://cdn.founderplus.id/llms.txt) dari Claude/ChatGPT/Cursor — agent kamu langsung tahu cara membantu kamu pakai Founder+ dengan benar (install CLI, ambil slug produk, taruh tombol beli yang tidak salah). Tidak ada lagi tebak-tebakan yang bikin tombol error.

---

## Mulai dari mana?

### Kalau kamu belum punya produk
Buka **[academy.founderplus.id/creator](https://academy.founderplus.id/creator)** — buat akun (gratis), bikin produkmu (ebook, course, mentoring, event, template — apa pun), set harga. Selesai, kamu dapat tautan checkout yang bisa langsung dipakai.

### Kalau kamu mau bikin landing page dari nol
Dua jalan:

1. **Pakai panduan kami**: buka **[cdn.founderplus.id/guide](https://cdn.founderplus.id/guide)** — langkah demi langkah, copy-paste.
2. **Pakai template siap pakai** dari **[Founder+ Templates](https://github.com/founderplus-labs/founderplus-templates)** — pilih `static-landing` (HTML satu file, paling cepat), `ai-studio` (prompt buat Google AI Studio), atau template aplikasi (Astro, Next.js, dll) — semua sudah ke-wire ke checkout Founder+.

### Kalau kamu suka kerja dari terminal
Founder+ punya CLI (`fp`) — sekali install, kamu bisa kelola produk, kupon, transaksi, halaman, dan banyak lagi tanpa buka browser.

```bash
curl -fsSL https://academy.founderplus.id/install.sh | sh
fp login
```

Lalu:

```bash
fp products list             # lihat produkmu
fp products create ...       # bikin produk baru
fp new my-app --template fp-fullstack   # scaffold app jualan dengan auth + checkout
fp skills install <nama>     # install skill untuk AI agent kamu
```

Daftar lengkap: `fp --help`.

---

## SEO on-page

Template-template Founder+ (lihat link di atas) sudah datang dengan:
- meta title + description + Open Graph
- canonical URL + sitemap-ready
- structured data (Product / Course / Event JSON-LD sesuai produk)
- gambar dengan `alt` deskriptif + lazy-loading
- format harga Rupiah yang benar (Rp 99.000)
- format heading + struktur konten yang ramah Google

Tinggal isi judul, harga, deskripsi — sisanya sudah disiapkan.

---

## Yang penting kamu tahu

**Slug produk** itu alamat permanen produkmu di Founder+ (mis. `ebook-saya-abcd1234`). Ambil slug yang asli dari `fp products list` atau dashboard Creator Studio — jangan tebak dari judul (sering ada akhiran unik). Salah slug = tombol beli gagal. Toolkit ini cukup pintar untuk tetap melayani slug lama setelah kamu ganti nama produk, tapi tetap saja pakai slug asli supaya rapi.

**Pembayaran** sepenuhnya diproses oleh Founder+. Kamu tidak menerima/menyimpan data kartu pengunjung. Aman, dan kamu fokus jualan saja.

---

## Pertanyaan & dukungan

- **WhatsApp Founder+**: [+62 811 1341 000](https://wa.me/628111341000)
- **Email**: hello@founderplus.id
- **Belajar lebih jauh**: [academy.founderplus.id](https://academy.founderplus.id)

---

<sub>Untuk developer yang mau berkontribusi ke source toolkit ini, lihat [`CONTRIBUTING.md`](./CONTRIBUTING.md).</sub>
