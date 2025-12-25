// ==========================
// Firebase Config
// ==========================
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT.firebaseapp.com",
  projectId: "PROJECT",
  storageBucket: "PROJECT.appspot.com",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const storage = firebase.storage();
const db = firebase.firestore();

// ==========================
// LOGIN GOOGLE
// ==========================
function loginGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
      .then(() => window.location = "dashboard.html")
      .catch(err => alert(err.message));
}

// ==========================
// UPLOAD FILE + TEKS
// ==========================
function uploadFile() {
  const file = document.getElementById("file").files[0];
  const text = document.getElementById("text").value;

  if (!file) return alert("Pilih file terlebih dahulu!");

  const ref = storage.ref("files/" + Date.now() + "_" + file.name);

  ref.put(file).then(snapshot => {
    snapshot.ref.getDownloadURL().then(url => {
      db.collection("timeline").add({
        uid: auth.currentUser.uid,
        nickname: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        fileName: file.name,
        fileURL: url,
        text: text,
        timestamp: Date.now()
      });
      document.getElementById("file").value = "";
      document.getElementById("text").value = "";
    });
  }).catch(err => alert(err.message));
}

// ==========================
// LOAD TIMELINE (REALTIME)
// ==========================
function loadTimeline() {
  db.collection("timeline").orderBy("timestamp", "desc")
    .onSnapshot(snap => {
      const timeline = document.getElementById("timeline");
      if(!timeline) return; // jika bukan halaman dashboard
      timeline.innerHTML = "";
      snap.forEach(doc => {
        const data = doc.data();
        timeline.innerHTML += `
          <div class="post">
            <img src="${data.photoURL}" class="avatar">
            <strong>${data.nickname}</strong>
            <p>${data.text || ''}</p>
            <p>
              <a href="${data.fileURL}" target="_blank">${data.fileName}</a>
              <a href="${data.fileURL}" download>Download</a>
            </p>
          </div>
        `;
      });
    });
}

// ==========================
// DARK / LIGHT THEME TOGGLE
// ==========================
function toggleTheme() {
  const body = document.body;
  body.classList.toggle("dark");
  body.classList.toggle("light");
}

// ==========================
// PROFILE NICKNAME UPDATE
// ==========================
function updateNick() {
  const nickInput = document.getElementById("nick");
  if (!nickInput) return;
  const nick = nickInput.value.trim();
  if (nick === "") return alert("Nickname tidak boleh kosong");
  auth.currentUser.updateProfile({ displayName: nick })
    .then(() => alert("Nickname berhasil diupdate!"))
    .catch(err => alert(err.message));
}

// ==========================
// AUTOSAVE / LOAD DATA
// ==========================
auth.onAuthStateChanged(user => {
  // Redirect ke login jika belum login
  if (!user && window.location.pathname !== "/index.html") {
    window.location = "index.html";
  }

  // Jika profile.html
  if (user && document.getElementById("photo")) {
    document.getElementById("photo").src = user.photoURL;
    document.getElementById("email").innerText = user.email;
    document.getElementById("nick").value = user.displayName || "";
  }

  // Jika dashboard.html
  if (user && document.getElementById("timeline")) {
    loadTimeline();
  }
});
