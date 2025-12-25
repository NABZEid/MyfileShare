// ==========================
// Konfigurasi Supabase
// ==========================
const SUPABASE_URL = "https://qmxdroxhlvqkduyxpnwt.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY_HERE";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================
// LOGIN DUMMY (ganti kalau pakai OAuth)
// ==========================
async function loginDummy(email) {
  const { data, error } = await supabase.auth.signInWithOtp({ email });
  if (error) return alert(error.message);
  alert("Cek email untuk login link!");
}

// ==========================
// UPLOAD FILE KE STORAGE
// ==========================
async function uploadFile() {
  const file = document.getElementById("file").files[0];
  const text = document.getElementById("text").value;

  if (!file) return alert("Pilih file terlebih dahulu!");

  const filePath = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("files")
    .upload(filePath, file);

  if (error) return alert(error.message);

  const { publicUrl } = supabase.storage.from("files").getPublicUrl(filePath);

  // Simpan ke table timeline
  const { error: insertError } = await supabase
    .from("timeline")
    .insert([{
      uid: supabase.auth.user().id,
      nickname: supabase.auth.user().user_metadata.full_name || "Guest",
      photoURL: supabase.auth.user().user_metadata.avatar_url || "",
      fileName: file.name,
      fileURL: publicUrl,
      text: text,
      timestamp: Date.now(),
      isPublic: true
    }]);
    
  if (insertError) return alert(insertError.message);
  alert("File berhasil diupload!");
  loadTimeline();
}

// ==========================
// LOAD TIMELINE
// ==========================
async function loadTimeline() {
  const { data, error } = await supabase
    .from("timeline")
    .select("*")
    .order("timestamp", { ascending: false });
  
  if (error) return alert(error.message);
  
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";
  data.forEach(post => {
    timeline.innerHTML += `
      <div class="post">
        <img src="${post.photoURL}" class="avatar">
        <strong>${post.nickname}</strong>
        <p>${post.text || ''}</p>
        <p>
          <a href="${post.fileURL}" target="_blank">${post.fileName}</a>
          <a href="${post.fileURL}" download>Download</a>
        </p>
      </div>
    `;
  });
}

// ==========================
// PROFILE UPDATE
// ==========================
async function updateNick() {
  const nick = document.getElementById("nick").value.trim();
  if(!nick) return alert("Nickname tidak boleh kosong");

  const user = supabase.auth.user();
  const { error } = await supabase
    .from("users")
    .update({ nickname: nick })
    .eq("uid", user.id);
    
  if(error) return alert(error.message);
  alert("Nickname berhasil diupdate!");
}

// ==========================
// THEME TOGGLE
// ==========================
function toggleTheme() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
}
