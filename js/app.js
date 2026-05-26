(function () {
  const loadingScreen = document.getElementById("loading-screen");
  const loginScreen = document.getElementById("login-screen");
  const app = document.getElementById("app");
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const siteHeader = document.getElementById("site-header");
  const themeToggle = document.getElementById("theme-toggle");
  const userMenuToggle = document.getElementById("user-menu-toggle");
  const userMenu = document.getElementById("user-menu");
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const logoutBtn = document.getElementById("logout-btn");
  const adminPanelBtn = document.getElementById("admin-panel-btn");

  let currentPage = "beranda";
  let navBound = false;
  let galleryBound = false;
  let piketBound = false;

const PAGE_IDS = [
  "beranda",
  "pengumuman",
  "gallery",
  "students",
  "absensi",
  "student-detail",
  "piket",
  "jadwal",
  "ranking",
  "org",
  "akun"
];

  function applyTheme() {
    Store.setTheme(Store.getTheme());
  }

  function hideLoading() {
    loadingScreen.hidden = true;
  }

  function showLogin() {
    hideLoading();
    loginScreen.hidden = false;
    app.hidden = true;
  }

  function navigateTo(page, save = true) {
    if (!PAGE_IDS.includes(page)) page = "beranda";
    currentPage = page;
    if (save) sessionStorage.setItem("syntaxia_page", page);

    document.querySelectorAll("section.page-view, div.page-view").forEach((el) => {
      const active =
      el.dataset.page === page;
      console.log(el.dataset.page, page);
      el.hidden = !active;
      el.classList.toggle("active", active);
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      const target = link.dataset.page;
      const active =
        target === page || (page === "student-detail" && target === "students");
      link.classList.toggle("active", active);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMenus();
  }

  function openStudentDetail(idx) {
    Render.studentDetail(idx);
    sessionStorage.setItem("syntaxia_student_idx", String(idx));
    navigateTo("student-detail");
  }

  function bindGallery() {
    if (galleryBound) return;
    galleryBound = true;
    const viewAll = document.getElementById("gallery-view-all");
    const modal = document.getElementById("gallery-modal");
    const closeBtn = document.getElementById("gallery-modal-close");

    viewAll?.addEventListener("click", () => {
      Render.galleryModalAll();
      modal?.showModal();
    });
    closeBtn?.addEventListener("click", () => modal?.close());
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) modal.close();
    });
  }

  function bindPiket() {
    if (piketBound) return;
    piketBound = true;
    const list = document.getElementById("piket-list");
    if (!list) return;

    list.addEventListener("click", (e) => {
      const btn = e.target.closest(".piket-btn");
      if (!btn || btn.disabled || !Auth.isAdmin()) return;

      const row = btn.closest(".piket-row");
      if (!row) return;
      const hari = row.dataset.hari;
      const nama = row.dataset.nama;
      const status = btn.dataset.status;
      const data = Render.data;
      const current = Store.getPiketStatus(data, hari, nama);

      let next = status;
      if (current === status) next = null;

      Store.setPiketStatus(data, hari, nama, next);
      Render.piket(hari);
    });
  }

  function bindAbsensi() {
    const editBtn = document.getElementById('absensi-edit-btn');
    const modal = document.getElementById('attendance-modal');
    const closeBtn = document.getElementById('attendance-modal-close');
    const cancelBtn = document.getElementById('attendance-modal-cancel');
    const saveBtn = document.getElementById('attendance-save-btn');
    const body = document.getElementById('attendance-modal-body');

    editBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      Render.attendanceModal();
      modal?.showModal();
    });

    closeBtn?.addEventListener('click', () => modal?.close());
    cancelBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      modal?.close();
    });

    saveBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const data = Store.getData();
      const today = new Date().toISOString().split('T')[0];
      body?.querySelectorAll('.toggle-btn.active').forEach(btn => {
        const nis = btn.dataset.nis;
        const status = btn.dataset.status;
        Store.setAttendanceForStudent(data, nis, status, today);
      });
      Render.absensi();
      modal?.close();
    });

    body?.addEventListener('click', (e) => {
      const btn = e.target.closest('.toggle-btn');
      if (!btn) return;
      e.preventDefault();
      const row = btn.closest('.attendance-row');
      if (!row) return;
      row.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  
    // Allow admin to click cells in the rendered attendance table to toggle status
    const absensiGrid = document.getElementById('absensi-grid');
    absensiGrid?.addEventListener('click', (e) => {
      const cell = e.target.closest('.attendance-cell');
      if (!cell) return;
      if (!Auth.isAdmin()) return;
      const nis = cell.dataset.nis;
      const date = cell.dataset.date;
      if (!nis || !date) return;

      // cycle statuses: '' -> hadir -> izin -> sakit -> ''
      const current = Store.getAttendanceStatus(Store.getData(), nis, date) || '';
      const order = ['', 'hadir', 'izin', 'sakit', 'alpha'];
      const idx = order.indexOf(current);
      const next = order[(idx + 1) % order.length];
      const data = Store.getData();
      if (next === '') {
        Store.setAttendanceForStudent(data, nis, null, date);
      } else {
        Store.setAttendanceForStudent(data, nis, next, date);
      }
      Render.absensi();
    });
  }

  function bindPageNav() {
    if (navBound) return;
    navBound = true;

    document.body.addEventListener("click", (e) => {
      const card = e.target.closest("[data-student-idx]");
      if (card && app.contains(card)) {
        e.preventDefault();
        openStudentDetail(parseInt(card.dataset.studentIdx, 10));
        return;
      }

      const trigger = e.target.closest("[data-page]");
      if (!trigger || !app.contains(trigger)) return;
      if (trigger.closest("#admin-modal")) return;
      e.preventDefault();
      navigateTo(trigger.dataset.page);
    });

    document.body.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const card = e.target.closest("[data-student-idx]");
      if (card && app.contains(card)) {
        e.preventDefault();
        openStudentDetail(parseInt(card.dataset.studentIdx, 10));
      }
    });
  }

  function bindHeaderScroll() {
    window.addEventListener(
      "scroll",
      () => {
        if (siteHeader) siteHeader.classList.toggle("scrolled", window.scrollY > 20);
      },
      { passive: true }
    );
  }

  function bindPengumuman() {

  document.addEventListener("click", (e) => {

    // TAMBAH PENGUMUMAN
    if (e.target.id === "tambah-pengumuman-btn") {

      const judul =
        prompt("Judul pengumuman");

      if (!judul) return;

      const isi =
        prompt("Isi pengumuman");

      if (!isi) return;

      const tanggal =
        new Date().toLocaleDateString("id-ID");

      const data = Store.getData();

      if (!data.pengumuman) {
        data.pengumuman = [];
      }

      data.pengumuman.unshift({
        judul,
        isi,
        tanggal
      });

      Store.saveData(data);

      Render.data = data;

      Render.pengumuman();
    }

    // EDIT PENGUMUMAN
if (
  e.target.classList.contains(
    "edit-pengumuman-btn"
  )
) {

  const index =
    Number(e.target.dataset.index);

  const data = Store.getData();

  const item =
    data.pengumuman[index];

  const judulBaru =
    prompt(
      "Edit judul",
      item.judul
    );

  if (!judulBaru) return;

  const isiBaru =
    prompt(
      "Edit isi",
      item.isi
    );

  if (!isiBaru) return;

  data.pengumuman[index] = {
    ...item,
    judul: judulBaru,
    isi: isiBaru
  };

  Store.saveData(data);

  Render.data = data;

  Render.pengumuman();
}

    // HAPUS PENGUMUMAN
    if (
      e.target.classList.contains(
        "hapus-pengumuman-btn"
      )
    ) {

      const index =
        Number(e.target.dataset.index);

      const data = Store.getData();

      data.pengumuman.splice(index, 1);

      Store.saveData(data);

      Render.data = data;

      Render.pengumuman();
    }

  });
}

  function showApp() {
    hideLoading();
    loginScreen.hidden = true;
    app.hidden = false;

    const user = Auth.getCurrentUser();
    document.body.classList.toggle("is-admin", user.role === "admin");
    Render.buildNav();
    Render.account(user);

    const data = Store.getData();
    if (!data.organisasi?.wali && data.organisasi?.branches) {
      data.organisasi = DEFAULT_DATA.organisasi;
      Store.saveData(data);
    }
    Render.init(data);
    bindPageNav();
    bindGallery();
    bindPiket();
    bindAbsensi();
    bindPengumuman();
    bindHeaderScroll();

    const saved = sessionStorage.getItem("syntaxia_page");
    if (saved === "student-detail") {
      const idx = parseInt(sessionStorage.getItem("syntaxia_student_idx"), 10);
      if (!Number.isNaN(idx)) {
        openStudentDetail(idx);
        return;
      }
    }
    navigateTo(PAGE_IDS.includes(saved) ? saved : "beranda", false);
  }

  function closeMenus() {
    if (userMenu) userMenu.hidden = true;
    if (userMenuToggle) userMenuToggle.setAttribute("aria-expanded", "false");
    if (mobileMenu) mobileMenu.hidden = true;
    if (mobileMenuToggle) mobileMenuToggle.setAttribute("aria-expanded", "false");
  }

  function initAuth() {
    setTimeout(() => {
      if (Auth.isLoggedIn()) showApp();
      else showLogin();
    }, 400);
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const session = Auth.login(username, password);

    if (!session) {
      loginError.textContent = "Username atau password salah.";
      loginError.hidden = false;
      return;
    }

    loginError.hidden = true;
    Store.setSession(session);
    showApp();
  });

  logoutBtn.addEventListener("click", () => {
    Auth.logout();
    sessionStorage.removeItem("syntaxia_page");
    sessionStorage.removeItem("syntaxia_student_idx");
    closeMenus();
    showLogin();
    loginForm.reset();
  });

  themeToggle?.addEventListener("click", () => {
    const next = Store.getTheme() === "light" ? "dark" : "light";
    Store.setTheme(next);
  });

  userMenuToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = userMenu.hidden;
    closeMenus();
    userMenu.hidden = !open;
    userMenuToggle.setAttribute("aria-expanded", String(open));
  });

  mobileMenuToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = mobileMenu.hidden;
    closeMenus();
    mobileMenu.hidden = !open;
    mobileMenuToggle.setAttribute("aria-expanded", String(open));
  });

  adminPanelBtn?.addEventListener("click", () => {
    if (!Auth.isAdmin()) return;
    navigateTo("students");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#user-menu") && !e.target.closest("#user-menu-toggle")) {
      if (userMenu) userMenu.hidden = true;
    }
    if (!e.target.closest("#mobile-menu") && !e.target.closest("#mobile-menu-toggle")) {
      if (mobileMenu) mobileMenu.hidden = true;
    }
  });

  applyTheme();
  Render.buildNav();
  Admin.init();
  initAuth();
})();


// Gallery zoom feature
document.addEventListener("click", (e) => {
  const img = e.target.closest(".gallery-item img");
  if (!img) return;

  const modal = document.getElementById("gallery-zoom-modal");
  const zoomImg = document.getElementById("gallery-zoom-image");

  if (modal && zoomImg) {
    zoomImg.src = img.src;
    modal.showModal();
  }
});

const galleryZoomClose = document.getElementById("gallery-zoom-close");
const galleryZoomModal = document.getElementById("gallery-zoom-modal");

if (galleryZoomClose && galleryZoomModal) {
  galleryZoomClose.addEventListener("click", () => {
    galleryZoomModal.close();
  });

  galleryZoomModal.addEventListener("click", (e) => {
    if (e.target === galleryZoomModal) {
      galleryZoomModal.close();
    }
  });
}
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader")
      .classList.add("hide");
  }, 1500);
});
const cursor =
  document.querySelector(".cursor-glow");

if (cursor) {

  document.addEventListener("mousemove", (e) => {

    cursor.style.left = e.clientX + "px";

    cursor.style.top = e.clientY + "px";

  });

}
if (typeof tsParticles !== "undefined") {

  tsParticles.load("particles-js", {

    particles: {
      number: {
        value: 80
      },

      color: {
        value: "#00ffff"
      },

      links: {
        enable: true,
        color: "#00ffff"
      },

      move: {
        enable: true,
        speed: 2
      }
    }

  });

}
function updateClock() {
  const now = new Date();

  const time =
    now.toLocaleTimeString();

const clock =
  document.getElementById("clock");

if (clock) {
  clock.innerHTML = time;
}
}

setInterval(updateClock, 1000);
const quotes = [
  "Code your future.",
  "Dream big, build bigger.",
  "Future programmer loading...",
  "Syntaxia never stops learning."
];

const random =
  quotes[Math.floor(Math.random() * quotes.length)];

const quote =
  document.getElementById("quote");

if (quote) {
  quote.innerHTML = random;
}
  const music =
  document.getElementById("bgMusic");

const btn =
  document.getElementById("musicBtn");

if (btn && music) {

  btn.onclick = () => {

    music.play();

  };

}
function reveal() {
  const reveals =
    document.querySelectorAll(".reveal");

  reveals.forEach((item) => {
    const top =
      item.getBoundingClientRect().top;

    if (top < window.innerHeight - 100) {
      item.classList.add("active");
    }
  });
}

window.addEventListener("scroll", reveal);
// MUSIC PLAYER

window.addEventListener("DOMContentLoaded", () => {

  const songs = [
    {
      title: "Laskar Pelangi",
      src: "music/laskar-pelangi.mp3"
    },

    {
      title: "Jendela Kelas 1",
      src: "music/jendela-kelas-1.mp3"
    }
  ];

  const player =
    document.getElementById("musicPlayer");

  const playBtn =
    document.getElementById("playAllBtn");

  const nowPlaying =
    document.getElementById("nowPlaying");

  const songButtons =
    document.querySelectorAll(".song-btn");

  let currentSong = 0;

  function playSong(index) {

    player.pause();

    player.src = songs[index].src;

    player.load();

    player.play();

    nowPlaying.innerHTML =
      "🎵 Sedang diputar: " +
      songs[index].title;
  }

  // tombol playlist
  playBtn.addEventListener("click", () => {

    currentSong = 0;

    playSong(currentSong);

  });

  // tombol lagu
  songButtons.forEach((btn) => {

    btn.addEventListener("click", () => {

      currentSong =
        Number(btn.dataset.song);

      playSong(currentSong);

    });

  });

  // auto next
  player.addEventListener("ended", () => {

    currentSong++;

    if (currentSong < songs.length) {

      playSong(currentSong);

    } else {

      currentSong = 0;

      nowPlaying.innerHTML =
        "Playlist selesai";
    }

  });

});