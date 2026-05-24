const Admin = {
  modal: null,
  form: null,
  body: null,
  currentEdit: null,
  mode: "form",
  photoChangeBound: false,

  init() {
    this.modal = document.getElementById("admin-modal");
    this.form = document.getElementById("admin-modal-form");
    this.body = document.getElementById("admin-modal-body");

    document.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => this.open(btn.dataset.edit));
    });

    document.getElementById("admin-modal-close")?.addEventListener("click", () => this.close());
    document.getElementById("admin-modal-cancel")?.addEventListener("click", () => this.close());

    this.form?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.save();
    });
  },

  open(type) {
    if (!Auth.isAdmin()) return;
    this.currentEdit = type;
    this.mode = type === "siswa" || type === "galeri" || type === "ranking" ? "form" : "json";

    const titles = {
      siswa: "Kelola Data Siswa",
      organisasi: "Edit Struktur Organisasi",
      jadwal: "Edit Jadwal Pelajaran",
      piket: "Edit Jadwal Piket",
      galeri: "Kelola Galeri Foto",
      ranking: "Edit Ranking Siswa"
    };
    document.getElementById("admin-modal-title").textContent = titles[type] || "Edit";
    this.modal.classList.toggle("admin-modal-wide", type === "siswa" || type === "galeri");

    if (type === "siswa") this.renderSiswaForm();
    else if (type === "galeri") this.renderGaleriForm();
    else if (type === "ranking") this.renderRankingForm();
    else this.renderJsonEditor(type);

    this.modal.showModal();
  },

  renderJsonEditor(type) {
    const data = Render.data;
    let payload;
    switch (type) {
      case "organisasi":
        payload = data.organisasi;
        break;
      case "jadwal":
        payload = data.jadwalPelajaran;
        break;
      case "piket":
        payload = data.jadwalPiket;
        break;
      case "ranking":
        payload = data.ranking;
        break;
      case "absensi":
        payload = data.absensi || {};
        break;
      default:
        payload = data;
    }
    if (type === "absensi") {
      this.body.innerHTML = `
        <p class="admin-hint">Impor data absensi dari file Excel (.xlsx/.xls) atau CSV.
        Format: kolom pertama = NIS, kolom kedua = Nama (opsional), kolom berikutnya = tanggal (YYYY-MM-DD atau teks tanggal).
        Isi sel dengan H (Hadir), I (Izin), S (Sakit) atau kosong untuk absen.</p>
        <input type="file" id="admin-absensi-file" accept=".xlsx,.xls,.csv" />
        <label><input type="checkbox" id="admin-absensi-overwrite" /> Timpa data absensi yang ada</label>
        <div id="admin-absensi-preview"></div>`;

      const fileInput = this.body.querySelector('#admin-absensi-file');
      const preview = this.body.querySelector('#admin-absensi-preview');
      const overwrite = this.body.querySelector('#admin-absensi-overwrite');
      this.pendingAbsensiImport = null;

      fileInput?.addEventListener('change', (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            let workbook;
            const dataBin = ev.target.result;
            if (typeof XLSX !== 'undefined') {
              // try binary read
              workbook = XLSX.read(dataBin, { type: 'binary' });
            } else {
              preview.textContent = 'Library XLSX tidak tersedia.';
              return;
            }
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            if (!rows || rows.length < 2) {
              preview.textContent = 'Spreadsheet kosong atau format tidak dikenali.';
              return;
            }
            const headers = rows[0];
            // assume first col = NIS, second col optional name, rest dates
            const dateCols = headers.slice(2);
            const parsed = {};
            for (let r = 1; r < rows.length; r++) {
              const row = rows[r];
              const nis = String(row[0] ?? '').trim();
              if (!nis) continue;
              for (let c = 2; c < headers.length; c++) {
                const rawDate = headers[c];
                if (!rawDate) continue;
                // try parse ISO-like
                let iso = String(rawDate).trim();
                // if looks like dd/mm/yyyy or mm/dd/yyyy, attempt Date
                const dt = new Date(iso);
                if (!Number.isNaN(dt.getTime())) {
                  iso = dt.toISOString().split('T')[0];
                }
                const cell = (row[c] ?? '').toString().trim();
                const status = (val => {
                  if (!val) return null;
                  const v = val.toString().trim().toLowerCase();
                  if (v === 'h' || v === 'hadir' || v === '✓' || v === 'v') return 'hadir';
                  if (v === 'i' || v === 'izin') return 'izin';
                  if (v === 's' || v === 'sakit') return 'sakit';
                  return null;
                })(cell);
                if (!parsed[iso]) parsed[iso] = {};
                if (status) parsed[iso][nis] = status;
              }
            }
            this.pendingAbsensiImport = parsed;
            // build names map from rows (col 0 = NIS, col1 = name)
            const namesByNis = {};
            for (let r = 1; r < rows.length; r++) {
              const row = rows[r];
              const nis = String(row[0] ?? '').trim();
              if (!nis) continue;
              const name = String(row[1] ?? '').trim();
              if (name) namesByNis[nis] = name;
            }
            this.pendingAbsensiNames = namesByNis;

            // show editable preview table
            const dates = Object.keys(parsed).sort();
            const nises = Object.keys(namesByNis).length ? Object.keys(namesByNis) : Object.keys(parsed[dates[0]] || {});
            let table = '<div class="admin-absensi-preview-wrap"><table class="admin-absensi-preview"><thead><tr><th>NIS</th><th>Nama</th>' + dates.map(d => `<th>${d}</th>`).join('') + '</tr></thead><tbody>';
            nises.forEach(nis => {
              const nama = this.pendingAbsensiNames[nis] || '';
              table += `<tr data-nis="${nis}"><td>${this.esc(nis)}</td><td>${this.esc(nama)}</td>`;
              dates.forEach(d => {
                const val = (parsed[d] && parsed[d][nis]) || '';
                table += `<td><select class="inp-absensi-cell" data-nis="${nis}" data-date="${d}">` +
                  `<option value=""> </option>` +
                  `<option value="hadir" ${val === 'hadir' ? 'selected' : ''}>Hadir</option>` +
                  `<option value="izin" ${val === 'izin' ? 'selected' : ''}>Izin</option>` +
                  `<option value="sakit" ${val === 'sakit' ? 'selected' : ''}>Sakit</option>` +
                  `</select></td>`;
              });
              table += '</tr>';
            });
            table += '</tbody></table></div>';
            preview.innerHTML = `<p>Impor siap: ${dates.length} tanggal, ${nises.length} baris. Edit nilai lalu klik Simpan.</p>` + table;

            // bind change events to update pendingAbsensiImport
            preview.querySelectorAll('.inp-absensi-cell').forEach(sel => {
              sel.addEventListener('change', (ev) => {
                const s = ev.target;
                const nis = s.dataset.nis;
                const date = s.dataset.date;
                const v = s.value || null;
                if (!this.pendingAbsensiImport[date]) this.pendingAbsensiImport[date] = {};
                if (v === null) delete this.pendingAbsensiImport[date][nis];
                else this.pendingAbsensiImport[date][nis] = v;
              });
            });
          } catch (err) {
            preview.textContent = 'Gagal membaca file: ' + err.message;
          }
        };
        // read as binary string for XLSX
        reader.readAsBinaryString(f);
      });

      this.mode = 'json';
      return;
    }

    this.body.innerHTML = `
      <p class="admin-hint">Edit data dalam format JSON. Periksa sintaks sebelum menyimpan.</p>
      <textarea id="admin-json-editor" class="admin-textarea admin-textarea-code" spellcheck="false">${JSON.stringify(payload, null, 2)}</textarea>`;
    this.mode = "json";
  },

  renderSiswaForm() {
    const d = Render.data;
    const rows = d.siswa.map((s, i) => this.siswaCardHtml(s, i)).join("");

    this.body.innerHTML = `
      <div class="admin-tabs">
        <button type="button" class="admin-tab active" data-tab="form">Form Siswa</button>
        <button type="button" class="admin-tab" data-tab="import">Impor Cepat</button>
        <button type="button" class="admin-tab" data-tab="json">JSON</button>
        <button type="button" class="admin-tab" data-tab="photo">Edit Foto</button>
      </div>
      <div id="admin-panel-form" class="admin-panel">
        <div class="admin-settings-grid">
          <label class="admin-field">Wali Kelas<input type="text" id="inp-wali" value="${this.esc(d.waliKelas)}" /></label>
          <label class="admin-field">Total Siswa<input type="number" id="inp-total" min="1" max="50" value="${d.totalSiswa ?? d.siswa.length}" /></label>
        </div>
        <div class="admin-student-list" id="siswa-rows">${rows}</div>
        <div class="admin-actions-row">
          <button type="button" class="btn btn-sm btn-ghost" id="btn-add-siswa">+ Tambah Siswa</button>
          <button type="button" class="btn btn-sm btn-ghost" id="btn-fill-27">Isi 27 Siswa</button>
        </div>
      </div>
      <div id="admin-panel-import" class="admin-panel" hidden>
        <p class="admin-hint">Satu baris = satu siswa. Format:</p>
        <ul class="admin-hint-list">
          <li><code>NoAbsen,Nama,L</code> atau <code>NoAbsen,NIS,Nama,P</code></li>
          <li><code>Nama Lengkap</code> (nomor absen otomatis)</li>
        </ul>
        <textarea id="import-siswa-text" class="admin-textarea" rows="10" placeholder="1,Ahmad Fauzi,L
2,2025002,Bella Safira,P"></textarea>
        <button type="button" class="btn btn-sm btn-primary" id="btn-apply-import">Terapkan ke Form</button>
      </div>
      <div id="admin-panel-json" class="admin-panel" hidden>
        <textarea id="admin-json-editor" class="admin-textarea admin-textarea-code" spellcheck="false">${JSON.stringify({ siswa: d.siswa, totalSiswa: d.totalSiswa, waliKelas: d.waliKelas }, null, 2)}</textarea>
      </div>
      <div id="admin-panel-photos" class="admin-panel" hidden>
        <p class="admin-hint">Pilih foto dari perangkat untuk absen 1 sampai 27. Foto akan disimpan ke lokal lewat data URL.</p>
        <div class="admin-photo-list" id="photo-rows">
          ${Array.from({ length: 27 }, (_, index) => {
            const no = index + 1;
            const student = d.siswa.find((s) => (s.noAbsen ?? index + 1) === no);
            const fotoUrl = student ? this.esc(student.foto) : "";
            const hasPhoto = Boolean(fotoUrl);
            return `
              <div class="admin-photo-row" data-absen="${no}">
                <span class="admin-photo-label">${no}</span>
                <div class="admin-photo-field-group">
                  <input type="file" class="inp-photo-file" accept="image/*" />
                  <input type="hidden" class="inp-photo-data" value="${fotoUrl}" />
                  <span class="admin-photo-name">${hasPhoto ? "Foto tersimpan" : "Belum pilih foto"}</span>
                </div>
              </div>`;
          }).join("")}
        </div>
      </div>`;

    this.bindSiswaEvents();
    this.mode = "form";
  },

  bindSiswaEvents() {
    const tbody = document.getElementById("siswa-rows");
    document.querySelectorAll(".admin-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const name = tab.dataset.tab;
        document.getElementById("admin-panel-form").hidden = name !== "form";
        document.getElementById("admin-panel-import").hidden = name !== "import";
        document.getElementById("admin-panel-json").hidden = name !== "json";
        document.getElementById("admin-panel-photos").hidden = name !== "photo";
        this.mode = name === "json" ? "json" : name === "photo" ? "photo" : "form";
      });
    });

    tbody?.addEventListener("click", (e) => {
      if (e.target.closest(".btn-del-row")) e.target.closest(".admin-student-card")?.remove();
    });

    document.getElementById("btn-add-siswa")?.addEventListener("click", () => {
      const n = tbody.querySelectorAll(".admin-student-card").length;
      const div = document.createElement("div");
      div.innerHTML = this.siswaCardHtml({ noAbsen: n + 1, nis: `2025${String(n + 1).padStart(3, "0")}`, nama: "", jk: "L" }, n);
      tbody.appendChild(div.firstElementChild);
    });

    document.getElementById("btn-fill-27")?.addEventListener("click", () => {
      tbody.innerHTML = "";
      for (let i = 1; i <= 27; i++) {
        const div = document.createElement("div");
        div.innerHTML = this.siswaCardHtml(
          { noAbsen: i, nis: `2025${String(i).padStart(3, "0")}`, nama: `Siswa ${i}`, jk: i % 2 ? "P" : "L" },
          i - 1
        );
        tbody.appendChild(div.firstElementChild);
      }
      document.getElementById("inp-total").value = 27;
    });

    document.getElementById("btn-apply-import")?.addEventListener("click", () => {
      const parsed = this.parseSiswaImport(document.getElementById("import-siswa-text").value);
      if (!parsed.length) {
        alert("Tidak ada data terbaca. Periksa format tempelan.");
        return;
      }
      tbody.innerHTML = parsed.map((s, i) => this.siswaCardHtml(s, i)).join("");
      document.getElementById("inp-total").value = parsed.length;
      document.querySelector('.admin-tab[data-tab="form"]')?.click();
      alert(`${parsed.length} siswa berhasil dimuat ke tabel. Klik Simpan untuk menyimpan.`);
    });

    if (!this.photoChangeBound) {
      this.body.addEventListener("change", (e) => {
        const fileInput = e.target.closest('input[type="file"]');
        if (!fileInput) return;
        const row = fileInput.closest('.admin-photo-row') || fileInput.closest('.admin-galeri-row');
        if (!row) return;
        const hidden = row.querySelector('.inp-photo-data') || row.querySelector('.inp-galeri-data');
        const name = row.querySelector('.admin-photo-name') || row.querySelector('.admin-galeri-name');
        const file = fileInput.files?.[0];
        if (!file || !hidden) return;
        const reader = new FileReader();
        reader.onload = () => {
          hidden.value = reader.result || "";
          if (name) name.textContent = file.name;
        };
        reader.readAsDataURL(file);
      });
      this.photoChangeBound = true;
    }
  },

  siswaCardHtml(s, i) {
    const no = s.noAbsen ?? i + 1;
    return `
      <div class="admin-student-card" data-idx="${i}">
        <div class="admin-student-card-top">
          <label class="admin-field admin-field-sm">No. Absen<input type="number" class="inp-no-absen" min="1" value="${no}" /></label>
          <label class="admin-field admin-field-grow">Nama Lengkap<input type="text" class="inp-nama" value="${this.esc(s.nama)}" placeholder="Nama siswa" /></label>
          <label class="admin-field admin-field-sm">JK
            <select class="inp-jk">
              <option value="L" ${s.jk === "L" ? "selected" : ""}>L</option>
              <option value="P" ${s.jk === "P" ? "selected" : ""}>P</option>
            </select>
          </label>
          <button type="button" class="btn-del-row" title="Hapus">×</button>
        </div>
        <div class="admin-student-card-grid">
          <label class="admin-field">NIS<input type="text" class="inp-nis" value="${this.esc(s.nis)}" /></label>
          <label class="admin-field">TTL<input type="text" class="inp-ttl" value="${this.esc(s.ttl)}" /></label>
          <label class="admin-field admin-field-wide">Alamat<input type="text" class="inp-alamat" value="${this.esc(s.alamat)}" /></label>
          <label class="admin-field">No. HP<input type="text" class="inp-hp" value="${this.esc(s.noHp)}" /></label>
          <label class="admin-field">Nama Ortu<input type="text" class="inp-ortu" value="${this.esc(s.namaOrtu)}" /></label>
        </div>
      </div>`;
  },

  parseSiswaImport(text) {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    return lines.map((line, i) => {
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      if (parts.length >= 4) {
        return normalizeStudent(
          { noAbsen: parseInt(parts[0], 10) || i + 1, nis: parts[1], nama: parts[2], jk: parts[3] },
          i
        );
      }
      if (parts.length === 3 && /^\d+$/.test(parts[0])) {
        return normalizeStudent(
          { noAbsen: parseInt(parts[0], 10), nama: parts[1], jk: parts[2] },
          i
        );
      }
      if (parts.length >= 3) {
        return normalizeStudent({ nis: parts[0], nama: parts[1], jk: parts[2] }, i);
      }
      if (parts.length === 2) {
        return normalizeStudent({ nama: parts[0], jk: parts[1] }, i);
      }
      return normalizeStudent({ nama: parts[0] }, i);
    });
  },

  collectSiswaFromForm() {
    const rows = document.querySelectorAll("#siswa-rows .admin-student-card");
    const siswa = [];
    rows.forEach((row, i) => {
      const nama = row.querySelector(".inp-nama")?.value.trim();
      if (!nama) return;
      siswa.push(
        normalizeStudent(
          {
            noAbsen: parseInt(row.querySelector(".inp-no-absen")?.value, 10) || i + 1,
            nis: row.querySelector(".inp-nis")?.value.trim(),
            nama,
            jk: row.querySelector(".inp-jk")?.value || "L",
            ttl: row.querySelector(".inp-ttl")?.value.trim(),
            alamat: row.querySelector(".inp-alamat")?.value.trim(),
            noHp: row.querySelector(".inp-hp")?.value.trim(),
            namaOrtu: row.querySelector(".inp-ortu")?.value.trim()
          },
          i
        )
      );
    });
    return {
      waliKelas: document.getElementById("inp-wali")?.value.trim() || Render.data.waliKelas,
      totalSiswa: parseInt(document.getElementById("inp-total")?.value, 10) || siswa.length,
      siswa
    };
  },

  collectSiswaPhotos() {
    const data = Render.data;
    const rows = document.querySelectorAll("#photo-rows .admin-photo-row");
    const photoByAbsen = {};
    rows.forEach((row) => {
      const no = parseInt(row.dataset.absen, 10);
      const value = row.querySelector(".inp-photo-data")?.value.trim();
      if (!Number.isNaN(no) && value) photoByAbsen[no] = value;
    });
    return data.siswa.map((s) => {
      const no = s.noAbsen ?? 0;
      const url = photoByAbsen[no];
      if (url) s.foto = url;
      else delete s.foto;
      return s;
    });
  },

  renderGaleriForm() {
    const items = Render.data.galeri
      .map(
        (g, i) => {
          const has = Boolean(g.url);
          const label = has ? "Foto tersimpan" : "Belum pilih foto";
          return `
      <div class="admin-galeri-row" data-idx="${i}">
        <input type="text" class="inp-judul admin-input" value="${this.esc(g.judul)}" placeholder="Judul foto" />
        <div class="admin-galeri-field-group">
          <input type="file" class="inp-galeri-file" accept="image/*" />
          <input type="hidden" class="inp-galeri-data" value="${this.esc(g.url)}" />
          <div class="admin-galeri-name">${label}</div>
        </div>
        <input type="color" class="inp-warna" value="${g.warna || "#3b82f6"}" title="Warna cadangan" />
        <button type="button" class="btn-del-galeri" title="Hapus">Hapus</button>
      </div>`;
        }
      )
      .join("");

    this.body.innerHTML = `
      <p class="admin-hint">Pilih foto dari perangkat. Foto akan disimpan sebagai data lokal.</p>
      <div class="admin-galeri-list" id="galeri-rows">${items}</div>
      <button type="button" class="btn btn-sm btn-ghost" id="btn-add-galeri">+ Tambah Foto</button>
      <details class="admin-json-details">
        <summary>Edit JSON lanjutan</summary>
        <textarea id="admin-json-editor" class="admin-textarea admin-textarea-code">${JSON.stringify(Render.data.galeri, null, 2)}</textarea>
      </details>`;

    document.getElementById("btn-add-galeri")?.addEventListener("click", () => {
      const row = document.createElement("div");
      row.className = "admin-galeri-row";
      row.innerHTML = `
        <input type="text" class="inp-judul admin-input" placeholder="Judul foto" />
        <div class="admin-galeri-field-group">
          <input type="file" class="inp-galeri-file" accept="image/*" />
          <input type="hidden" class="inp-galeri-data" value="" />
          <div class="admin-galeri-name">Belum pilih foto</div>
        </div>
        <input type="color" class="inp-warna" value="#3b82f6" />
        <button type="button" class="btn-del-galeri">Hapus</button>`;
      document.getElementById("galeri-rows").appendChild(row);
    });

    document.getElementById("galeri-rows")?.addEventListener("click", (e) => {
      if (e.target.closest(".btn-del-galeri")) {
        const row = e.target.closest(".admin-galeri-row");
        if (row && confirm("Hapus foto ini dari galeri?")) row.remove();
      }
    });

    this.mode = "form";
  },

  renderRankingForm() {
    const periods = RANKING_PERIODS;
    const blocks = periods
      .map((period) => {
        const rows = (Render.data.ranking[period] || [])
          .map(
            (item) => `
          <label class="admin-ranking-row">
            <span class="admin-ranking-name">${this.esc(item.nama)}</span>
            <input type="number" class="inp-ranking-nilai admin-input" step="0.1" min="0" max="100"
              data-period="${this.esc(period)}" data-nama="${this.esc(item.nama)}" value="${item.nilai}" />
          </label>`
          )
          .join("");
        return `
          <section class="admin-ranking-block" data-period="${this.esc(period)}">
            <h4 class="admin-ranking-period">${period}</h4>
            <div class="admin-ranking-grid">${rows}</div>
          </section>`;
      })
      .join("");

    this.body.innerHTML = `
      <p class="admin-hint">Atur nilai rata-rata per siswa untuk setiap periode. Semua siswa ditampilkan.</p>
      <div class="admin-ranking-wrap">${blocks}</div>`;
    this.mode = "form";
  },

  collectRankingFromForm() {
    const ranking = { ...Render.data.ranking };
    document.querySelectorAll(".inp-ranking-nilai").forEach((inp) => {
      const period = inp.dataset.period;
      const nama = inp.dataset.nama;
      const nilai = parseFloat(inp.value);
      if (!period || !nama || Number.isNaN(nilai)) return;
      if (!ranking[period]) ranking[period] = [];
      const row = ranking[period].find((r) => r.nama === nama);
      if (row) row.nilai = nilai;
      else ranking[period].push({ nama, nilai });
    });
    return mergeRankingWithStudents(Render.data.siswa, ranking);
  },

  collectGaleriFromForm() {
    const jsonTa = document.getElementById("admin-json-editor");
    if (jsonTa && document.querySelector(".admin-json-details[open]")) {
      try {
        return JSON.parse(jsonTa.value);
      } catch (_) {}
    }
    const rows = document.querySelectorAll(".admin-galeri-row");
    return Array.from(rows)
      .map((row) => ({
        judul: row.querySelector(".inp-judul")?.value.trim() || "Foto",
        url: row.querySelector(".inp-galeri-data")?.value.trim() || row.querySelector(".inp-url")?.value.trim() || "",
        warna: row.querySelector(".inp-warna")?.value || "#3b82f6"
      }))
      .filter((g) => g.judul);
  },

  esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  },

  close() {
    this.modal?.close();
    this.currentEdit = null;
  },

  save() {
    const data = Render.data;

    try {
      if (this.currentEdit === "siswa") {
        const activeJson = document.getElementById("admin-panel-json") && !document.getElementById("admin-panel-json").hidden;
        if (this.mode === "json" || activeJson) {
          const parsed = JSON.parse(document.getElementById("admin-json-editor").value);
          if (parsed.siswa) data.siswa = normalizeStudents(parsed.siswa);
          if (parsed.totalSiswa != null) data.totalSiswa = parsed.totalSiswa;
          if (parsed.waliKelas) data.waliKelas = parsed.waliKelas;
        } else if (this.mode === "photo") {
          data.siswa = this.collectSiswaPhotos();
        } else {
          const collected = this.collectSiswaFromForm();
          data.siswa = normalizeStudents(collected.siswa);
          data.totalSiswa = collected.totalSiswa;
          data.waliKelas = collected.waliKelas;
          this.syncPiketNames(data);
          data.ranking = mergeRankingWithStudents(data.siswa, data.ranking);
        }
      } else if (this.currentEdit === "galeri") {
        data.galeri = this.collectGaleriFromForm();
      } else if (this.currentEdit === "absensi") {
        // If admin imported attendance via Excel, apply it
        if (this.pendingAbsensiImport) {
          const overwrite = document.getElementById('admin-absensi-overwrite')?.checked;
          if (!data.absensi) data.absensi = {};
          if (overwrite) {
            data.absensi = this.pendingAbsensiImport;
          } else {
            // merge per-date
            Object.keys(this.pendingAbsensiImport).forEach((date) => {
              if (!data.absensi[date]) data.absensi[date] = {};
              Object.assign(data.absensi[date], this.pendingAbsensiImport[date]);
            });
          }
          this.pendingAbsensiImport = null;
        } else {
          // fallback: allow JSON edit
          const ta = document.getElementById('admin-json-editor');
          if (ta && !document.querySelector('.admin-json-details[open]')) {
            try {
              data.absensi = JSON.parse(ta.value);
            } catch (_) {}
          }
        }
      } else if (this.currentEdit === "ranking") {
        data.ranking = this.collectRankingFromForm();
      } else {
        const parsed = JSON.parse(document.getElementById("admin-json-editor").value);
        switch (this.currentEdit) {
          case "organisasi":
            data.organisasi = parsed;
            break;
          case "jadwal":
            data.jadwalPelajaran = parsed;
            break;
          case "piket":
            data.jadwalPiket = parsed;
            break;
          case "ranking":
            data.ranking = parsed;
            break;
        }
      }

      Store.saveData(data);
      Render.init(data);
      this.close();
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    }
  },

  syncPiketNames(data) {
    const names = data.siswa.map((s) => s.nama);
    if (!names.length) return;
    const defaultTugas = ["Sapu depan", "Buang sampah", "Pel lantai", "Lap jendela", "Rapikan meja"];
    HARI_PIKET.forEach((hari, idx) => {
      const chunk = 5;
      const start = (idx * chunk) % names.length;
      const picked = names.slice(start, start + chunk);
      while (picked.length < chunk) picked.push(names[picked.length % names.length]);
      const prev = data.jadwalPiket[hari] || [];
      data.jadwalPiket[hari] = picked.map((nama, j) => {
        const old = prev[j];
        const tugas =
          typeof old === "object" && old.tugas ? old.tugas : defaultTugas[j % defaultTugas.length];
        return { nama, tugas };
      });
    });
  }
};
