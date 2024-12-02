// Usuários para login
const USERS = [
  { username: "admin", password: "1234" },
  { username: "copywriter", password: "5678" },
];

// Thumbnails padrão e do Local Storage
const savedThumbnails = JSON.parse(localStorage.getItem("thumbnails")) || [];
let thumbnails = [
  ...savedThumbnails,
  { src: "thumbnails/thumb1.jpg", tags: ["rich vs poor", "funny"], ctr: 5.2 },
  { src: "thumbnails/thumb2.jpg", tags: ["weddings", "romantic"], ctr: 7.4 },
  { src: "thumbnails/thumb3.jpg", tags: ["Mario", "gaming"], ctr: 8.1 },
];

// Example YouTube data for titles
const youtubeData = [
  { title: "Rich vs Poor: Epic Battle!", ctr: 6.8 },
  { title: "Wedding Disaster 101", ctr: 7.5 },
  { title: "Mario’s Crazy Adventure", ctr: 9.1 },
  { title: "Rich People Problems", ctr: 5.9 },
];

// Salvar thumbnails no Local Storage
function saveThumbnails() {
  localStorage.setItem("thumbnails", JSON.stringify(thumbnails));
}

// Função para exibir thumbnails
function displayThumbnails(filteredThumbnails = thumbnails) {
  const container = document.getElementById("thumbnail-container");
  container.innerHTML = "";

  filteredThumbnails.forEach((thumb, index) => {
    const thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("thumbnail");
    thumbnailElement.innerHTML = `
            <img src="${thumb.src}" alt="Thumbnail">
            <p>Tags: ${thumb.tags.join(", ")}</p>
            <p>CTR: ${thumb.ctr}%</p>
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

// Filtrar thumbnails por tag
function filterByTag(tag) {
  const filteredThumbnails = thumbnails.filter((thumb) =>
    thumb.tags.includes(tag)
  );
  displayThumbnails(filteredThumbnails);

  // Exibir os Top 3 Titles para a tag selecionada
  displayTopTitles(tag);
}

// Exibir as tags únicas disponíveis
function displayTags() {
  const tagsContainer = document.getElementById("tags-container");
  const uniqueTags = [...new Set(thumbnails.flatMap((thumb) => thumb.tags))];

  tagsContainer.innerHTML = "";
  uniqueTags.forEach((tag) => {
    const button = document.createElement("button");
    button.textContent = tag;
    button.addEventListener("click", () => filterByTag(tag));
    tagsContainer.appendChild(button);
  });
}

// Exibir os Top 3 Titles para uma tag
function displayTopTitles(tag) {
  const relevantTitles = youtubeData
    .filter((data) => data.title.toLowerCase().includes(tag.toLowerCase()))
    .sort((a, b) => b.ctr - a.ctr)
    .slice(0, 3);

  const titleList = document.getElementById("title-list");
  titleList.innerHTML = "";

  if (relevantTitles.length > 0) {
    relevantTitles.forEach((data) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${data.title} (CTR: ${data.ctr}%)`;
      titleList.appendChild(listItem);
    });
  } else {
    titleList.innerHTML = "<li>No titles available for this tag.</li>";
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
// Função para excluir uma thumbnail
function deleteThumbnail(index) {
  const confirmDelete = confirm(
    "Você tem certeza que quer excluir esta thumbnail?"
  );
  if (confirmDelete) {
    thumbnails.splice(index, 1); // Remove a thumbnail da lista
    saveThumbnails(); // Atualiza o Local Storage
    displayThumbnails(); // Atualiza a exibição das thumbnails
    displayTags(); // Atualiza as tags disponíveis
  }
}
function displayThumbnails(filteredThumbnails = thumbnails) {
  const container = document.getElementById("thumbnail-container");
  container.innerHTML = "";

  filteredThumbnails.forEach((thumb, index) => {
    const thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("thumbnail");
    thumbnailElement.innerHTML = `
        <div class="thumbnail-actions">
          <span class="delete-icon" onclick="deleteThumbnail(${index})">&times;</span>
        </div>
        <img src="${thumb.src}" alt="Thumbnail">
        <p>Tags: ${thumb.tags.join(", ")}</p>
        <p>CTR: ${thumb.ctr}%</p>
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
      displayTags(); // Atualizar tags
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

// Exibir thumbnails e tags ao carregar
displayThumbnails();
displayTags();
