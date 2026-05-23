function normalizeStudent(s, index) {
  const i = index + 1;
  return {
    noAbsen: s.noAbsen ?? i,
    nis: s.nis ?? `2025${String(i).padStart(3, "0")}`,
    nama: s.nama ?? "Siswa",
    jk: s.jk === "P" ? "P" : "L",
    ttl: s.ttl ?? "Kudus, 1 Januari 2009",
    alamat: s.alamat ?? "Kudus, Jawa Tengah",
    noHp: s.noHp ?? "08xxxxxxxxxx",
    email: s.email ?? "",
    namaOrtu: s.namaOrtu ?? "—",
    status: s.status ?? "hadir",
    jabatan: s.jabatan ?? "",
    foto: s.foto ?? STUDENT_PHOTOS[index % STUDENT_PHOTOS.length]
  };
}

function normalizeStudents(list) {
  if (!Array.isArray(list)) return [];
  return list.map((s, i) => normalizeStudent(s, i));
}
