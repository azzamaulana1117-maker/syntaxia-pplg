const STUDENT_PHOTOS = [
  "assets/default.jpg",
  "assets/default.jpg",
  "assets/default.jpg",
  "assets/default.jpg",
  "assets/default.jpg",
  "assets/default.jpg",
  "assets/default.jpg",
  "assets/default.jpg"
];

const DEFAULT_DATA = {
  pengumuman: [
  {
    judul: "Libur Sekolah",
    tanggal: "25 Mei-1 Juni 2026",
    isi: "Libur hari raya Idul Adha"
  },

  {
    judul: "Tugas",
    tanggal: "26 Mei 2026",
    isi: "Semua siswa wajib mengumpulkan semua tugas di semester genap."
  }
],
  waliKelas: "Bp. Muhammad Assola, S.Pd.",
  totalSiswa: 27,
  totalGaleri: 37,
  galeri: [
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-01.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-02.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-03.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-04.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-05.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-06.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-07.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-08.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-09.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-10.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-11.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-12.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-13.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-14.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-15.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-16.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-17.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-18.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-19.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-20.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-21.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-22.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-23.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-24.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-25.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-26.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-27.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-28.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-29.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-30.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-31.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-32.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-33.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-34.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-35.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-36.jpeg" },
    { judul: "Galeri PPLG", url: "assets/gallery/pplg-37.jpeg" }
  ],
  siswa: [
    { nis: "0103852484", nama: "ABDUL JABBAR", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0103579681", nama: "ACHMAD BAYHAQI", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0101091802", nama: "AHMAD FAHMIL MAKARIM", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0108768149", nama: "AHMAD HUSAINI", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0103826393", nama: "AHMAD RIFQI HIDAYAH", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0103197671", nama: "ALYA PUTRI SYABRINA", jk: "P", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "00109178900", nama: "AMANDA NOVITA SARI", jk: "P", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "3108978635", nama: "ANANDA RAGIL SAPUTRA", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0103681755", nama: "DEFVIN RADITYA RAMADHONI", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0103237306", nama: "FAHIMUL 'ILMI AL FADHILI", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0109202757", nama: "INTAN NUR FATIHA", jk: "P", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0103834783", nama: "M. AJI ROBBIRKHAM R.A", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0105184263", nama: "MOHAMMAD RIZA NAUFAL ALIFI", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0102809267", nama: "MUCHAMMAD ARSYAD DAHLAWI", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "3091377309", nama: "MUHAMMAD AZHAR MAULANA AZZUHRIE", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0106561025", nama: "MUHAMMAD FAUZUL KHAKIM", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0106677572", nama: "MUHAMMAD FEBRIAN ANGGORO MUSTIKO", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "3108925914", nama: "MUHAMMAD GEDE BUDIARTO", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0103176750", nama: "MUHAMMAD ILHAM MUSTOFA", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0105954739", nama: "MUHAMMAD KHILMY", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "3101321505", nama: "MUHAMMAD NUR RAMADHAN", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0102809266", nama: "MUHAMMAD SYAFI'I", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0102809267", nama: "NOVITA TSABBIT IMANIA", jk: "P", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0114306240", nama: "PUTRI MA'ABAH", jk: "P", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0117619508", nama: "REZA AMELIA", jk: "P", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "3112325245", nama: "RIFA QUEENA AZZAHRA", jk: "P", status: "hadir", jabatan: "", foto: "assets/default.jpg"},
    { nis: "0101931746", nama: "SYAIFULLAH AKBAR", jk: "L", status: "hadir", jabatan: "", foto: "assets/default.jpg"}
  ],
  organisasi: {
    wali: { role: "Wali Kelas", nama: "Bp. Muhammad Assola, S.Pd.", emoji: "👨‍🏫", color: "primary" },
    ketua: { role: "Ketua Kelas", nama: "Ahmad Rifqi Hidayah", emoji: "👑", color: "info" },
    wakil: { role: "Wakil Ketua", nama: "Muhammad Syafi'i", emoji: "⭐", color: "accent" },
    divisi: [
      { role: "Sekretaris", emoji: "📝", color: "secondary", members: ["Achmad Bayhaqi", "Novita Tsabbit Imania"] },
      { role: "Bendahara", emoji: "💰", color: "pink", members: ["Abdul Jabbar", "Amanda Novita Sari"] },
      { role: "Media", emoji: "📢", color: "accent", members: ["Intan Nur Fatiha", "M. Azhar Maulana A."] }
    ]
  },
  jadwalPelajaran: {
    Senin: [
      { jam: "07:00–07:45", mapel: "PENJAS" },
      { jam: "07:45–08:30", mapel: "PENJAS" },
      { jam: "08:30–09:15", mapel: "Dasar PPLG" },
      { jam: "09:30–10:00", mapel: "Matematika" },
      { jam: "10:30–11:15", mapel: "Matematika" },
      { jam: "11:15–12:00", mapel: "PEND AGAMA" },
      { jam: "12:30–13:15", mapel: "PEND AGAMA" },
      { jam: "13:15–14:00", mapel: "PEND AGAMA" }
    ],
    Selasa: [
      { jam: "07:00–07:45", mapel: "CHARACTER BUILDING" },
      { jam: "07:45–08:30", mapel: "PENDIDIKAN PANCASILA" },
      { jam: "08:30–09:15", mapel: "PENDIDIKAN PANCASILA" },
      { jam: "09:30–10:00", mapel: "DASAR PPLG" },
      { jam: "10:30–11:15", mapel: "DASAR PPLG" },
      { jam: "11:15–12:00", mapel: "DASAR PPLG" },
      { jam: "12:30–13:15", mapel: "DASAR PPLG" },
      { jam: "13:15–14:00", mapel: "DASAR PPLG" }
    ],
    Rabu: [
      { jam: "07:00–07:45", mapel: "SEJARAH" },
      { jam: "07:45–08:30", mapel: "BAHASA INGGRIS" },
      { jam: "08:30–09:15", mapel: "INFORMATIKA" },
      { jam: "09:30–10:00", mapel: "INFORMATIKA" },
      { jam: "10:30–11:15", mapel: "BAHASA JAWA" },
      { jam: "11:15–12:00", mapel: "BAHASA JAWA" },
      { jam: "12:30–13:15", mapel: "SENI RUPA" },
      { jam: "13:15–14:00", mapel: "SENI RUPA" }
    ],
    Kamis: [
      { jam: "07:00–07:45", mapel: "BAHASA INGGRIS" },
      { jam: "07:45–08:30", mapel: "BAHASA INGGRIS" },
      { jam: "08:30–09:15", mapel: "BAHASA INGGRIS" },
      { jam: "09:30–10:00", mapel: "SEJARAH" },
      { jam: "10:30–11:15", mapel: "INFORMATIKA" },
      { jam: "11:15–12:00", mapel: "INFORMATIKA" },
      { jam: "12:30–13:15", mapel: "MATEMATIKA" },
      { jam: "13:15–14:00", mapel: "MATEMATIKA" }
    ],
    Jumat: [
      { jam: "07:00–07:45", mapel: "IPAS FISIKA" },
      { jam: "07:45–08:30", mapel: "IPAS FISIKA" },
      { jam: "08:30–09:15", mapel: "ASWAJA" },
      { jam: "09:30–10:00", mapel: "BAHASA INDONESIA" },
      { jam: "10:30–11:15", mapel: "BAHASA INDONESIA" },
    ],
    Sabtu: [
      { jam: "07:00–07:45", mapel: "DASAR PPLG" },
      { jam: "07:45–08:30", mapel: "DASAR PPLG" },
      { jam: "08:30–09:15", mapel: "BAHASA INDONESIA" },
      { jam: "09:30–10:00", mapel: "BAHASA INDONESIA" },
      { jam: "10:30–11:15", mapel: "IPAS IPS" },
      { jam: "11:15–12:00", mapel: "IPAS IPS" },
      { jam: "12:30–13:15", mapel: "IPAS KIMIA" },
      { jam: "13:15–14:00", mapel: "IPAS KIMIA" }
    ]
  },
  jadwalPiket: {
    Senin: [
      { nama: "Rizky Pratama"},
      { nama: "Siti Nurhaliza"},
      { nama: "Budi Santoso"},
      { nama: "Ayu Lestari"},
      { nama: "Dian Permata"}
    ],
    Selasa: [
      { nama: "Fajar Nugroho"},
      { nama: "Hana Safitri"},
      { nama: "Irfan Hakim"},
      { nama: "Joko Susilo"},
      { nama: "Kartika Sari"}
    ],
    Rabu: [
      { nama: "Lukman Hakim"},
      { nama: "Nanda Putra"},
      { nama: "Olivia Putri"},
      { nama: "Pandu Wijaya"},
      { nama: "Qonita Amalia"}
    ],
    Kamis: [
      { nama: "Rendra Kusuma"},
      { nama: "Sari Dewanti"},
      { nama: "Teguh Prasetyo"},
      { nama: "Umi Kalsum"},
      { nama: "Ahmad Fauzi"}
    ],
    Jumat: [
      { nama: "Bella Safira"},
      { nama: "Candra Wijaya"},
      { nama: "Desi Ratnasari"},
      { nama: "Eko Prasetyo"},
      { nama: "Fitri Handayani"}
    ],
    Sabtu: [
      { nama: "Galih Saputra"},
      { nama: "Hesti Wulandari"},
      { nama: "Ilham Ramadhan"},
      { nama: "Jihan Aulia"},
      { nama: "Kevin Ardian"}
    ]
  },
  piketStatus: {},
  ranking: {}
};

const RANKING_PERIODS = [
  "Kelas X — Gasal",
  "Kelas X — Genap",
];

function buildRankingForStudents(siswa) {
  const out = {};
  RANKING_PERIODS.forEach((label, pi) => {
    out[label] = siswa.map((s, i) => ({
      nama: s.nama,
      nilai: Math.round((82 + ((i * 5 + pi * 11) % 18)) * 10) / 10
    }));
  });
  return out;
}

function mergeRankingWithStudents(siswa, ranking) {
  const merged = {};
  RANKING_PERIODS.forEach((period) => {
    const existing = ranking[period] || [];
    const byName = Object.fromEntries(existing.map((e) => [e.nama, e.nilai]));
    merged[period] = siswa.map((s, i) => ({
      nama: s.nama,
      nilai: byName[s.nama] ?? Math.round((80 + (i % 15)) * 10) / 10
    }));
  });
  return merged;
}

function normalizeRanking(data) {
  const keys = Object.keys(data.ranking || {});
  const hasOldFormat = keys.some((k) => /Semester\s*\d/i.test(k));
  const missingPeriod = RANKING_PERIODS.some((p) => !data.ranking[p]);
  if (hasOldFormat || missingPeriod || !keys.length) {
    data.ranking = buildRankingForStudents(data.siswa);
  } else {
    data.ranking = mergeRankingWithStudents(data.siswa, data.ranking);
  }
}

DEFAULT_DATA.ranking = buildRankingForStudents(DEFAULT_DATA.siswa);

const USERS = {
  admin: { password: "syntaxia2025", role: "admin", displayName: "Administrator" },
  member: { password: "kelasx", role: "member", displayName: "Member Kelas" }
};

const HARI_PIKET = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const NAV_ITEMS = [
  { label: "Beranda", page: "beranda" },
  { label: "Pengumuman", page: "pengumuman" },
  { label: "Galeri", page: "gallery" },
  { label: "Siswa", page: "students" },
  { label: "Absensi", page: "absensi" },
  { label: "Piket", page: "piket" },
  { label: "Jadwal", page: "jadwal" },
  { label: "Ranking", page: "ranking" },
  { label: "Organisasi", page: "org" }
];
