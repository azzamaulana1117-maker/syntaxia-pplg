import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const siswa = [
  "Ahmad",
  "Budi",
  "Cahyo",
  "Dimas",
  "Eko",
  "Fajar",
  "Galih",
  "Hendra",
  "Indra",
  "Joko"
];

const listSiswa = document.getElementById("listSiswa");
const riwayatAbsensi = document.getElementById("riwayatAbsensi");

siswa.forEach((nama) => {
  const div = document.createElement("div");

  div.innerHTML = `
    <p>${nama}</p>

    <button onclick="kirimAbsensi('${nama}','Hadir')">Hadir</button>

    <button onclick="kirimAbsensi('${nama}','Izin')">Izin</button>

    <button onclick="kirimAbsensi('${nama}','Sakit')">Sakit</button>

    <button onclick="kirimAbsensi('${nama}','Alpa')">Alpa</button>
  `;

  listSiswa.appendChild(div);
});

window.kirimAbsensi = async (nama, status) => {
  await addDoc(collection(db, "absensi"), {
    nama,
    status,
    waktu: serverTimestamp(),
  });
};

onSnapshot(collection(db, "absensi"), (snapshot) => {
  riwayatAbsensi.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();

    riwayatAbsensi.innerHTML += `
      <div>
        ${data.nama} - ${data.status}
      </div>
    `;
  });
});