const STORAGE_KEY = "syntaxia_class_data";
const SESSION_KEY = "syntaxia_session";
const THEME_KEY = "syntaxia_theme";

const Store = {
  getData() {
    let data;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) data = JSON.parse(raw);
    } catch (_) {}
    if (!data) data = structuredClone(DEFAULT_DATA);
    const useDefaultGallery =
      !Array.isArray(data.galeri) ||
      data.galeri.length === 0 ||
      data.galeri.some((g) => !g || typeof g.url !== "string" || !g.url.startsWith("assets/gallery/"));
    if (useDefaultGallery) {
      data.galeri = structuredClone(DEFAULT_DATA.galeri);
    }
    if (typeof data.totalGaleri !== "number" || data.totalGaleri !== data.galeri.length) {
      data.totalGaleri = data.galeri.length;
    }
    data.siswa = normalizeStudents(data.siswa || []);
    normalizeRanking(data);
    const today = new Date().toISOString().split("T")[0];
    if (data.lastPiketReset !== today) {
      data.piketStatus = {};
      data.lastPiketReset = today;
      this.saveData(data);
    }

    return data;
  },

  saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  resetData() {
    localStorage.removeItem(STORAGE_KEY);
    return structuredClone(DEFAULT_DATA);
  },

  getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return null;
  },

  setSession(session) {
    const json = JSON.stringify(session);
    sessionStorage.setItem(SESSION_KEY, json);
    localStorage.setItem(SESSION_KEY, json);
  },

  clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  },

  getTheme() {
    return localStorage.getItem(THEME_KEY) || "dark";
  },

  setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute("data-theme", theme);
  },

  piketKey(hari, nama) {
    return `${hari}::${nama}`;
  },

  getPiketStatus(data, hari, nama) {
    const key = this.piketKey(hari, nama);
    return data.piketStatus[key] ?? null;
  },

  setPiketStatus(data, hari, nama, status) {
    const key = this.piketKey(hari, nama);
    if (status === null) delete data.piketStatus[key];
    else data.piketStatus[key] = status;
    this.saveData(data);
  }
  ,
  /* Absensi storage helpers
     data.absensi is an object keyed by ISO date string -> { [nis]: status }
     status = 'hadir' | 'izin' | 'sakit' | 'alpha' (absen)
  */
  ensureAbsensi(data) {
    if (!data.absensi) data.absensi = {};
  },
  setAttendanceForStudent(data, nis, status, dateISO) {
    this.ensureAbsensi(data);
    const d = dateISO || new Date().toISOString().split("T")[0];
    if (!data.absensi[d]) data.absensi[d] = {};
    if (status === null) delete data.absensi[d][nis];
    else data.absensi[d][nis] = status;
    this.saveData(data);
  },
  getAttendanceStatus(data, nis, dateISO) {
    this.ensureAbsensi(data);
    const d = dateISO || new Date().toISOString().split("T")[0];
    return (data.absensi[d] && data.absensi[d][nis]) || null;
  },
  getAttendanceCountsPeriod(data, nis, startISO, endISO) {
    this.ensureAbsensi(data);
    const start = new Date(startISO);
    const end = new Date(endISO);
    let hadir = 0, total = 0;
    for (const key of Object.keys(data.absensi)) {
      const dt = new Date(key);
      if (dt >= start && dt <= end) {
        const s = data.absensi[key] && data.absensi[key][nis];
        if (s) {
          total += 1;
          if (s === 'hadir') hadir += 1;
        }
      }
    }
    return { hadir, total };
  }
};
