const Render = {
  data: null,
  esc(str) {
    return String(str ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  },

  init(data) {
    this.data = data;
    this.hero();
    this.stats();
    this.jadwal();
    this.galeri();
    this.piket();
    this.absensi();
    this.organisasi();
    this.ranking();
    this.siswa();
  },

  hero() {
    const greeting = document.getElementById("hero-greeting");
    const dateEl = document.getElementById("hero-date");
    const wali = document.getElementById("wali-kelas-display");
    const deco = document.getElementById("hero-deco-piket");

    if (greeting) {
      const h = new Date().getHours();
      greeting.textContent =
        h < 11 ? "Selamat Pagi" : h < 15 ? "Selamat Siang" : h < 18 ? "Selamat Sore" : "Selamat Malam";
    }
    if (dateEl) {
      const d = new Date();
      const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      dateEl.textContent = `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
    if (wali) wali.textContent = this.data.waliKelas;
    if (deco) {
      const list = this.data.heroPiket || [];
      deco.innerHTML = list.map((p) => `<li><strong>${p.nama}</strong> — ${p.tugas}</li>`).join("");
    }
  },

  stats() {
    const total = this.data.totalSiswa ?? this.data.siswa.length;
    const gal = this.data.totalGaleri ?? this.data.galeri.length;
    const piketDays = HARI_PIKET.filter((h) => this.data.jadwalPiket[h]).length;

    const elS = document.getElementById("stat-students");
    const elG = document.getElementById("stat-gallery");
    const elP = document.getElementById("stat-piket");
    if (elS) elS.textContent = String(total);
    if (elG) elG.textContent = String(gal);
    if (elP) elP.textContent = String(piketDays);
  },

  jadwal(activeDay) {
    const tabs = document.getElementById("jadwal-tabs");
    const panel = document.getElementById("jadwal-panel");
    if (!tabs || !panel) return;

    const days = Object.keys(this.data.jadwalPelajaran);
    let day = activeDay || tabs.dataset.active || days[0];
    if (!days.includes(day)) day = days[0];
    tabs.dataset.active = day;

    tabs.innerHTML = days
      .map(
        (d) =>
          `<button type="button" class="jadwal-tab${d === day ? " active" : ""}" data-day="${d}">${d}</button>`
      )
      .join("");

    const slots = this.data.jadwalPelajaran[day] || [];
    panel.innerHTML = slots
      .map((s) => `<div class="schedule-slot"><span class="schedule-time">${s.jam}</span><span>${s.mapel}</span></div>`)
      .join("");

    tabs.onclick = (e) => {
      const tab = e.target.closest(".jadwal-tab");
      if (!tab) return;
      this.jadwal(tab.dataset.day);
    };
  },

  galleryItemHtml(g, alt = "") {
    const src = g.url || "";
    if (src) {
      return `<img src="${src}" alt="${alt}" loading="lazy" />`;
    }
    return `<div class="gallery-placeholder" style="background:${g.warna || "#3b82f6"}33"></div>`;
  },

  galeri() {
    const grid = document.getElementById("gallery-grid");
    const foot = document.getElementById("gallery-foot");
    if (!grid) return;

    const gallery = this.data.galeri || [];
    if (gallery.length === 0) {
      grid.innerHTML = `<p class="text-muted">Belum ada foto di galeri.</p>`;
    } else {
      const [main, ...rest] = gallery;

      const renderBottom = (items) =>
        items
          .map(
            (g) => `
              <figure class="gallery-item gallery-item-small">
                ${this.galleryItemHtml(g, "Foto galeri")}
              </figure>`
          )
          .join("");

      grid.innerHTML = `
        <div class="gallery-layout">
          <div class="gallery-main">
            <figure class="gallery-item gallery-item-main">
              ${this.galleryItemHtml(main, "Foto galeri utama")}
            </figure>
            ${rest.length ? `<div class="gallery-bottom">${renderBottom(rest)}</div>` : ""}
          </div>
        </div>`;
    }

    if (foot) {
      const n = this.data.totalGaleri ?? this.data.galeri.length;
      foot.textContent = `${n} foto tersimpan di galeri`;
    }
  },

  galleryModalAll() {
    const grid = document.getElementById("gallery-modal-grid");
    if (!grid) return;
    grid.innerHTML = this.data.galeri
      .map(
        (g) => `
          <figure class="gallery-item gallery-item-modal">
            ${this.galleryItemHtml(g, "Foto galeri")}
          </figure>`
      )
      .join("");
  },

  piket(hariOverride) {
    const tabs = document.getElementById("piket-day-tabs");
    const list = document.getElementById("piket-list");
    if (!tabs || !list) return;

    const hariList = HARI_PIKET.filter((h) => this.data.jadwalPiket[h]);
    const todayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const today = todayNames[new Date().getDay()];
    let hari = hariOverride || tabs.dataset.active;
    if (!hari || !hariList.includes(hari)) {
      hari = hariList.includes(today) ? today : hariList[0];
    }
    tabs.dataset.active = hari;

    tabs.innerHTML = hariList
      .map((h) => {
        const isToday = h === today;
        return `<button type="button" class="piket-day-tab${h === hari ? " active" : ""}${isToday ? " today-tag" : ""}" data-hari="${h}">${h}</button>`;
      })
      .join("");

    const isAdmin = document.body.classList.contains("is-admin");
    const rows = this.data.jadwalPiket[hari] || [];
    list.innerHTML = rows
      .map((row) => {
        const item = typeof row === "string" ? { nama: row } : row;
        const status = Store.getPiketStatus(this.data, hari, item.nama);
        const okActive = status === "ok" ? " active" : "";
        const noActive = status === "no" ? " active" : "";
        const disabled = isAdmin ? "" : " disabled";
        return `
          <div class="piket-row" data-hari="${hari}" data-nama="${item.nama}">
            <p class="piket-row-name">${item.nama}</p>
            <div class="piket-actions">
              <button type="button" class="piket-btn piket-btn-ok${okActive}" data-status="ok" title="Hadir piket"${disabled} aria-label="Tandai hadir">✓</button>
              <button type="button" class="piket-btn piket-btn-no${noActive}" data-status="no" title="Tidak hadir"${disabled} aria-label="Tandai tidak hadir">✕</button>
            </div>
          </div>`;
      })
      .join("");

    tabs.onclick = (e) => {
      const btn = e.target.closest(".piket-day-tab");
      if (!btn) return;
      this.piket(btn.dataset.hari);
    };
  },

  organisasi() {
    const root = document.getElementById("mindmap-organisasi");
    if (!root) return;
    const org = this.data.organisasi;
    if (!org.wali) {
      root.innerHTML = "<p class=\"text-muted\">Data organisasi belum diatur.</p>";
      return;
    }

    const node = (n, gradient) => `
      <div class="org-node ${gradient}">
        <div class="org-node-emoji">${n.emoji || "👤"}</div>
        <span class="org-node-badge bg-${n.color || "primary"}">${n.role}</span>
        <p class="org-node-name">${n.nama}</p>
      </div>`;

    const divisiHtml = (org.divisi || [])
      .map((d) => {
        const members = (d.members || [])
          .map((m) => `<p class="org-node-name">${m}</p>`)
          .join('<hr style="border:none;border-top:1px solid var(--border);margin:6px 0" />');
        return `
          <div class="org-branch">
            <div class="org-connector"></div>
            <div class="org-node gradient-card-blue">
              <div class="org-node-emoji">${d.emoji}</div>
              <span class="org-node-badge bg-${d.color}">${d.role}</span>
              ${members}
            </div>
          </div>`;
      })
      .join("");

    root.innerHTML = `
      <div class="org-tree-inner">
        ${node(org.wali, "gradient-card-blue")}
        <div class="org-connector"></div>
        ${node(org.ketua, "gradient-card-purple")}
        <div class="org-connector"></div>
        ${node(org.wakil, "gradient-card-green")}
        <div class="org-connector"></div>
        <div class="org-row">${divisiHtml}</div>
      </div>`;
  },

  siswa() {
    const grid = document.getElementById("students-grid");
    const sub = document.getElementById("students-sub");
    const count = document.getElementById("students-count");
    if (!grid) return;

    const n = this.data.siswa.length;
    if (sub) sub.textContent = `${n} siswa terdaftar di Kelas X PPLG`;
    if (count) count.textContent = String(n);

    grid.innerHTML = this.data.siswa
      .map((s, i) => {
        const foto = s.foto || "assets/foto-baru.jfif";
        
        const jabatan = s.jabatan
          ? `<span class="badge-jabatan">${s.jabatan}</span>`
          : "";
        const noAbsen = s.noAbsen ?? i + 1;
        return `
          <article class="student-card" data-student-idx="${i}" role="button" tabindex="0">
            <div class="student-inner">
              <div class="student-photo-wrap">
                <img class="student-photo" src="${foto}" alt="Foto ${s.nama}" loading="lazy" width="48" height="48" />
                
              </div>
              <div>
                <p class="student-name">${s.nama}</p>
                <p class="student-meta-line">No. Absen: ${noAbsen}</p>
                <div class="student-tags">${jabatan}</div>
              </div>
              <span class="student-card-arrow" aria-hidden="true">›</span>
            </div>
          </article>`;
      })
      .join("");
  },

  studentDetail(idx) {
    const root = document.getElementById("student-detail-root");
    if (!root) return;
    const s = this.data.siswa[idx];
    if (!s) {
      root.innerHTML = `<p class="text-muted">Data siswa tidak ditemukan.</p>`;
      return;
    }

    const foto = s.foto || "assets/foto-baru.jfif";
    const status = s.status || "hadir";
    const statusLabel = status === "hadir" ? "Hadir" : status === "izin" ? "Izin" : "Sakit";
    const badgeClass = status === "hadir" ? "badge-hadir" : status === "izin" ? "badge-izin" : "badge-sakit";
    const jkLabel = s.jk === "P" ? "Perempuan" : "Laki-laki";

    const photoInputValue = s.foto || "";
    const adminPhotoEditor = Auth.isAdmin()
      ? `
          <div class="student-detail-photo-edit">
            <label for="student-photo-url">URL Foto Siswa</label>
            <input id="student-photo-url" type="text" value="${photoInputValue}" placeholder="Masukkan URL foto siswa" />
            <div class="student-detail-photo-edit-actions">
              <button type="button" id="student-photo-save" class="btn btn-primary">Simpan Foto</button>
              <small>Biarkan kosong untuk menggunakan foto default.</small>
            </div>
          </div>`
      : "";

    root.innerHTML = `
      <button type="button" class="btn-back" data-page="students">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
        Kembali ke Data Siswa
      </button>
      <div class="student-detail-card card-base">
        <div class="student-detail-hero">
          <img class="student-detail-photo" src="${foto}" alt="Foto ${s.nama}" />
          <div class="student-detail-head">
            <span class="${badgeClass}">${statusLabel}</span>
            ${s.jabatan ? `<span class="badge-jabatan">${s.jabatan}</span>` : ""}
            <h2 class="student-detail-name">${s.nama}</h2>
            <p class="student-detail-sub">Kelas X PPLG · No. Absen ${s.noAbsen ?? idx + 1}</p>
          </div>
        </div>
        ${adminPhotoEditor}
        <div class="student-detail-grid">
          <div class="detail-item"><span class="detail-label">NIS</span><span class="detail-value">${s.nis || "—"}</span></div>
          <div class="detail-item"><span class="detail-label">No. Absen</span><span class="detail-value">${s.noAbsen ?? idx + 1}</span></div>
          <div class="detail-item"><span class="detail-label">Jenis Kelamin</span><span class="detail-value">${jkLabel}</span></div>
          <div class="detail-item"><span class="detail-label">Tempat, Tanggal Lahir</span><span class="detail-value">${s.ttl || "—"}</span></div>
          <div class="detail-item detail-item-wide"><span class="detail-label">Alamat</span><span class="detail-value">${s.alamat || "—"}</span></div>
          <div class="detail-item"><span class="detail-label">No. HP / WhatsApp</span><span class="detail-value">${s.noHp || "—"}</span></div>
          <div class="detail-item"><span class="detail-label">Email</span><span class="detail-value">${s.email || "—"}</span></div>
          <div class="detail-item"><span class="detail-label">Nama Orang Tua / Wali</span><span class="detail-value">${s.namaOrtu || "—"}</span></div>
        </div>
      </div>`;

    if (Auth.isAdmin()) this.bindStudentDetailActions(idx);
  },

  bindStudentDetailActions(idx) {
    const saveBtn = document.getElementById("student-photo-save");
    const photoInput = document.getElementById("student-photo-url");
    if (!saveBtn || !photoInput) return;

    saveBtn.addEventListener("click", () => {
      const url = photoInput.value.trim();
      const student = this.data.siswa[idx];
      if (!student) return;

      if (url) {
        student.foto = url;
      } else {
        delete student.foto;
      }

      Store.saveData(this.data);
      this.studentDetail(idx);
    });
  },

  absensi() {
    const grid = document.getElementById("absensi-grid");
    if (!grid) return;

    // If there is imported attendance data, render it as a table with dates as columns.
    const absensi = this.data.absensi || {};
    const dates = Object.keys(absensi).sort();
    if (dates.length === 0) {
      // No attendance imported yet — show a prompt to import via Admin
      grid.innerHTML = `
        <div class="card-base">
          <h3>Tidak ada data absensi</h3>
          <p class="text-muted">Belum ada data absensi yang diimpor. Gunakan menu <strong>Admin → Imor Absensi</strong> untuk mengunggah file Excel (.xlsx/.xls/.csv).</p>
        </div>`;
      return;
    }

    const isAdmin = document.body.classList.contains('is-admin');

    const monthDates = dates
      .map((d) => {
        const dt = new Date(d);
        return Number.isNaN(dt.getTime()) ? null : dt;
      })
      .filter(Boolean);
    const monthDate = monthDates[0] || new Date();
    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();
    const monthName = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ][month];
    const inSameMonth = monthDates.length > 0 && monthDates.every((dt) => dt.getMonth() === month && dt.getFullYear() === year);
    const displayDates = inSameMonth
      ? Array.from({ length: new Date(Date.UTC(year, month + 1, 0)).getUTCDate() }, (_, idx) => {
          const d = new Date(Date.UTC(year, month, idx + 1));
          return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
        })
      : dates;

    const headers = ['No', 'Nama Lengkap', ...displayDates.map((d) => {
      const parts = String(d).split('-');
      return parts.length === 3 ? String(Number(parts[2])) : d;
    }), 'H', 'S', 'I', 'A'];

    const rows = this.data.siswa.map((s, i) => {
      const nis = s.nis || `idx-${i}`;
      const no = s.noAbsen ?? i + 1;
      let hadir = 0;
      let sakit = 0;
      let izin = 0;
      let alpha = 0;

      const cells = displayDates
        .map((d) => {
          const status = (absensi[d] && absensi[d][nis]) || '';
          const normalized = status.toLowerCase();
          const label = normalized === 'hadir' ? 'H' : normalized === 'izin' ? 'I' : normalized === 'sakit' ? 'S' : normalized === 'alpha' ? 'A' : '';
          if (normalized === 'hadir') hadir += 1;
          else if (normalized === 'sakit') sakit += 1;
          else if (normalized === 'izin') izin += 1;
          else if (normalized === 'alpha') alpha += 1;
          const cls = label ? `att-${label.toLowerCase()}` : 'att-empty';
          const attr = isAdmin ? ` data-nis="${nis}" data-date="${d}" tabindex="0"` : '';
          return `<td class="attendance-cell ${cls}"${attr}>${this.esc(label)}</td>`;
        })
        .join('');

      return `
        <tr>
          <td>${no}</td>
          <td class="attendance-name-cell">${this.esc(s.nama)}</td>
          ${cells}
          <td class="att-hadir">${hadir || ''}</td>
          <td class="att-sakit">${sakit || ''}</td>
          <td class="att-izin">${izin || ''}</td>
          <td class="att-alpha">${alpha || ''}</td>
        </tr>`;
    });

    grid.innerHTML = `
      <div class="attendance-sheet-header">
        <h3>Daftar Hadir Siswa</h3>
        <p>BULAN: ${this.esc(monthName.toUpperCase())} ${year}</p>
      </div>
      <div class="attendance-table-wrap">
        <table class="attendance-table attendance-sheet">
          <thead>
            <tr>${headers.map((h) => `<th>${this.esc(h)}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.join('')}
          </tbody>
        </table>
        ${isAdmin ? '<p class="admin-hint">Klik sel untuk mengganti status (H/I/S/A/kosong).</p>' : ''}
      </div>`;
  },

  attendanceModal() {
    const body = document.getElementById('attendance-modal-body');
    if (!body) return;
    const data = this.data;
    const today = new Date().toISOString().split('T')[0];

    body.innerHTML = `
      <div class="attendance-modal-list">
        ${this.data.siswa
          .map((s, i) => {
            const nis = s.nis || `idx-${i}`;
            const noAbsen = s.noAbsen ?? i + 1;
            const currentStatus = Store.getAttendanceStatus(data, nis, today) || 'tidak';
            const isHadir = currentStatus === 'hadir';
            return `
              <div class="attendance-row">
                <div class="attendance-info">
                  <p class="attendance-name">${s.nama}</p>
                  <p class="attendance-sub">No. Absen: ${noAbsen}</p>
                </div>
                <div class="attendance-toggle">
                  <button type="button" class="toggle-btn ${isHadir ? 'active' : ''}" data-nis="${nis}" data-status="hadir">Hadir</button>
                  <button type="button" class="toggle-btn ${!isHadir ? 'active' : ''}" data-nis="${nis}" data-status="tidak">Tidak</button>
                </div>
              </div>`;
          })
          .join('')}
      </div>`;
  },

  ranking() {
    const tabsEl = document.getElementById("ranking-tabs");
    const contentEl = document.getElementById("ranking-content");
    if (!tabsEl || !contentEl) return;

    const keys = RANKING_PERIODS.filter((k) => this.data.ranking[k]);
    let activeKey = tabsEl.dataset.active;
    if (!activeKey || !keys.includes(activeKey)) activeKey = keys[0];

    tabsEl.innerHTML = keys
      .map(
        (k) =>
          `<button type="button" class="ranking-tab${k === activeKey ? " active" : ""}" data-key="${k}">${k}</button>`
      )
      .join("");

    const renderList = (key) => {
      const list = [...(this.data.ranking[key] || [])].sort((a, b) => b.nilai - a.nilai);
      contentEl.innerHTML = `
        <div class="ranking-list">
          ${list
            .map(
              (item, i) => `
            <div class="ranking-item">
              <span class="ranking-rank">${i + 1}</span>
              <div class="ranking-name center-name">${item.nama}</div>
            </div>`
            )
            .join("")}
        </div>`;
    };

    tabsEl.dataset.active = activeKey;
    renderList(activeKey);

    tabsEl.onclick = (e) => {
      const tab = e.target.closest(".ranking-tab");
      if (!tab) return;
      activeKey = tab.dataset.key;
      tabsEl.dataset.active = activeKey;
      tabsEl.querySelectorAll(".ranking-tab").forEach((t) =>
        t.classList.toggle("active", t.dataset.key === activeKey)
      );
      renderList(activeKey);
    };
  },

  account(user) {
    const name = document.getElementById("account-name");
    const userEl = document.getElementById("account-username");
    const role = document.getElementById("account-role");
    const avatar = document.getElementById("account-avatar");
    const headerName = document.getElementById("header-user-name");
    const headerRole = document.getElementById("header-user-role");
    const mini = document.getElementById("user-avatar-mini");

    if (name) name.textContent = user.displayName;
    if (userEl) userEl.textContent = user.username;
    if (role) role.textContent = user.role === "admin" ? "Admin" : "Member";
    if (avatar) avatar.textContent = user.displayName.charAt(0).toUpperCase();
    if (headerName) headerName.textContent = user.displayName;
    if (headerRole) headerRole.textContent = user.role === "admin" ? "Admin" : "Member";
    if (mini) mini.textContent = user.displayName.charAt(0).toUpperCase();
  },

  buildNav() {
    const desktop = document.getElementById("island-nav-desktop");
    const mobile = document.getElementById("mobile-nav-links");
    const linkHtml = (extraClass = "") =>
      NAV_ITEMS.map(
        (item) =>
          `<button type="button" class="nav-link ${extraClass}" data-page="${item.page}">${item.label}</button>`
      ).join("");

    if (desktop) desktop.innerHTML = linkHtml();
    if (mobile) mobile.innerHTML = linkHtml();
  }
};
