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
    this.pengumuman();
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
    const titleArea = document.querySelector("#page-piket .section-title-wrap");

if(titleArea && !document.getElementById("piket-edit-center")){

  const btn = document.createElement("button");

  btn.id = "piket-edit-center";
  btn.innerText = "Edit";

  btn.style.marginTop = "14px";
  btn.style.display = "block";
  btn.style.marginLeft = "auto";
  btn.style.marginRight = "auto";
  btn.style.padding = "10px 26px";
  btn.style.border = "none";
  btn.style.borderRadius = "999px";
  btn.style.background = "#3b82f6";
  btn.style.color = "white";
  btn.style.fontWeight = "600";
  btn.style.cursor = "pointer";

  titleArea.appendChild(btn);
}
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

pengumuman() {

  const list =
    document.getElementById("pengumuman-list");

  if (!list) return;

  const data =
    this.data.pengumuman || [];

  if (data.length === 0) {

    list.innerHTML =
      `<p>Belum ada pengumuman.</p>`;

    return;
  }

  list.innerHTML = data.map((item, index) => `
    
    <div class="pengumuman-card">

      <div class="pengumuman-date">
        ${item.tanggal}
      </div>

      <h3>
        ${item.judul}
      </h3>

      <p>
        ${item.isi}
      </p>

      ${
        Auth.isAdmin()
        ?
        `
        <div class="pengumuman-actions">

          <button
            class="edit-pengumuman-btn"
            data-index="${index}"
          >
            Edit
          </button>

          <button
            class="hapus-pengumuman-btn"
            data-index="${index}"
          >
            Hapus
          </button>

        </div>
        `
        :
        ""
      }

    </div>

  `).join("");

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

  const siswa = this.data.siswa || [];
  const isAdmin = Auth.isAdmin();

  const bulan = "JULI";
  const tahun = "2026";

  let headerTanggal = "";
  for (let i = 1; i <= 31; i++) {
    headerTanggal += `<th class="tgl-head">${i}</th>`;
  }

  const statusList = ["H", "S", "I", "A", ""];

  let rows = siswa.map((s, index) => {

    let cells = "";
    let totalH = 0;
    let totalS = 0;
    let totalI = 0;
    let totalA = 0;

    for (let i = 1; i <= 31; i++) {

      const key = `tgl_${i}`;

      if (!s.absensi) s.absensi = {};

      const status = s.absensi[key] || "";

      if (status === "H") totalH++;
      if (status === "S") totalS++;
      if (status === "I") totalI++;
      if (status === "A") totalA++;

      cells += `
        <td 
          class="absen-cell editable-cell"
          data-siswa="${index}"
          data-tanggal="${i}"
        >
          ${status}
        </td>
      `;
    }

    return `
      <tr>
        <td class="no-col">${s.noAbsen ?? index + 1}</td>

        <td class="nama-col">
          ${s.nama}
        </td>

        ${cells}

        <td class="rekap-col">${totalH}</td>
        <td class="rekap-col">${totalS}</td>
        <td class="rekap-col">${totalI}</td>
        <td class="rekap-col">${totalA}</td>
      </tr>
    `;
  }).join("");

  grid.innerHTML = `
    <div class="absensi-wrapper" style="width:100%; overflow-x:auto;">

      <table class="absensi-table" style="width:100%; min-width:2200px;">
        <thead>

          <tr>
            <th colspan="37" class="title-head">
              DAFTAR HADIR SISWA KELAS XI PPLG

              <div class="bulan-text">
                BULAN: ${bulan} ${tahun}
              </div>
            </th>
          </tr>

          <tr>
            <th rowspan="2" class="no-col">No</th>
            <th rowspan="2" class="nama-col">Nama Lengkap</th>

            <th colspan="31">
              Tanggal
            </th>

            <th colspan="4">
              Rekap
            </th>
          </tr>

          <tr>
            ${headerTanggal}

            <th class="rekap-col">H</th>
            <th class="rekap-col">S</th>
            <th class="rekap-col">I</th>
            <th class="rekap-col">A</th>
          </tr>

        </thead>

        <tbody>
          ${rows}
        </tbody>
      </table>

    </div>
  `;

  if (isAdmin) {

    document.querySelectorAll(".editable-cell").forEach((cell) => {

      cell.addEventListener("click", () => {

        const siswaIndex = Number(cell.dataset.siswa);
        const tanggal = Number(cell.dataset.tanggal);

        const siswa = this.data.siswa[siswaIndex];

        if (!siswa.absensi) siswa.absensi = {};

        const key = `tgl_${tanggal}`;

        const current = siswa.absensi[key] || "";

        const currentIndex = statusList.indexOf(current);

        const nextStatus =
          statusList[(currentIndex + 1) % statusList.length];

        siswa.absensi[key] = nextStatus;

        Store.saveData(this.data);

        const scrollX = grid.querySelector(".absensi-wrapper").scrollLeft;

this.absensi();

requestAnimationFrame(() => {
  const wrapper = grid.querySelector(".absensi-wrapper");
  if(wrapper){
    wrapper.scrollLeft = scrollX;
  }
});
      });
    });
  }
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
