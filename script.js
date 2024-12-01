// Usuários para login
const USERS = [
  { username: "admin", password: "1234" },
  { username: "copywriter", password: "5678" },
];

// Thumbnails padrão e do Local Storage
const savedThumbnails = JSON.parse(localStorage.getItem("thumbnails")) || [];
let thumbnails = [...savedThumbnails];

// Salvar thumbnails no Local Storage
function saveThumbnails() {
  localStorage.setItem("thumbnails", JSON.stringify(thumbnails));
}

// Função para exibir thumbnails
function displayThumbnails(filter = "") {
  const container = document.getElementById("thumbnail-container");
  container.innerHTML = "";

  thumbnails
    .filter((thumb) =>
      thumb.tags.some((tag) => tag.includes(filter.toLowerCase()))
    )
    .forEach((thumb, index) => {
      const thumbnailElement = document.createElement("div");
      thumbnailElement.classList.add("thumbnail");
      thumbnailElement.innerHTML = `
          <img src="${thumb.src}" alt="Thumbnail">
          <p>Tags: ${thumb.tags.join(", ")}</p>
          <button onclick="downloadImage('${thumb.src}', 'thumbnail-${
        index + 1
      }.jpg')">Download</button>
        `;
      container.appendChild(thumbnailElement);
    });

  if (container.innerHTML === "") {
    container.innerHTML = "<p>Nenhuma thumbnail encontrada.</p>";
  }
}

// Função para baixar imagens
function downloadImage(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Função para upload de múltiplas thumbnails
document.getElementById("upload-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const files = document.getElementById("thumbnail-upload").files;
  const tagsInput = document.getElementById("thumbnail-tags");
  const tags = tagsInput.value
    .split(",")
    .map((tag) => tag.trim().toLowerCase());

  if (files.length === 0 || tags.length === 0) {
    alert("Selecione ao menos uma imagem e adicione tags.");
    return;
  }

  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const newThumbnail = { src: reader.result, tags };
      thumbnails.push(newThumbnail);
      saveThumbnails();
      displayThumbnails();
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("thumbnail-upload").value = "";
  tagsInput.value = "";
});

// Login
document.getElementById("login-btn").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    localStorage.setItem("loggedIn", "true");
    document.getElementById("login-page").style.display = "none";
    document.getElementById("site-content").style.display = "block";
  } else {
    alert("Usuário ou senha inválidos.");
  }
});

// Verificar login
if (localStorage.getItem("loggedIn") === "true") {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("site-content").style.display = "block";
}

// Exibir thumbnails ao carregar
displayThumbnails();
