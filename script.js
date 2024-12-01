// Recuperar thumbnails do Local Storage
const savedThumbnails = JSON.parse(localStorage.getItem("thumbnails")) || [];

// Mesclar thumbnails padrão e as carregadas
let thumbnails = [
  ...savedThumbnails,
  { src: "thumbnails/thumb1.jpg", tags: ["tutorial", "javascript"] },
  { src: "thumbnails/thumb2.jpg", tags: ["html", "css"] },
  { src: "thumbnails/thumb3.jpg", tags: ["programação", "design"] },
];

// Atualizar Local Storage com os thumbnails
function saveThumbnails() {
  localStorage.setItem("thumbnails", JSON.stringify(thumbnails));
}

// Função para exibir as thumbnails
function displayThumbnails(filter = "") {
  const container = document.getElementById("thumbnail-container");
  container.innerHTML = ""; // Limpar o container

  thumbnails
    .filter((thumb) =>
      thumb.tags.some((tag) => tag.includes(filter.toLowerCase()))
    )
    .forEach((thumb) => {
      const thumbnailElement = document.createElement("div");
      thumbnailElement.classList.add("thumbnail");
      thumbnailElement.innerHTML = `
        <img src="${thumb.src}" alt="Thumbnail">
        <p>Tags: ${thumb.tags.join(", ")}</p>
      `;
      container.appendChild(thumbnailElement);
    });

  if (container.innerHTML === "") {
    container.innerHTML = "<p>Nenhuma thumbnail encontrada.</p>";
  }
}

// Adicionar evento ao campo de busca
document.getElementById("search").addEventListener("input", (e) => {
  displayThumbnails(e.target.value);
});

// Adicionar evento ao formulário de upload
document.getElementById("upload-form").addEventListener("submit", (e) => {
  e.preventDefault();

  // Obter o arquivo e as tags
  const fileInput = document.getElementById("thumbnail-upload");
  const tagsInput = document.getElementById("thumbnail-tags");
  const file = fileInput.files[0];
  const tags = tagsInput.value
    .split(",")
    .map((tag) => tag.trim().toLowerCase());

  if (!file || tags.length === 0) {
    alert("Por favor, selecione uma imagem e adicione ao menos uma tag.");
    return;
  }

  // Criar URL temporária para o arquivo (usada como `src`)
  const reader = new FileReader();
  reader.onload = () => {
    const newThumbnail = { src: reader.result, tags };
    thumbnails.push(newThumbnail);
    saveThumbnails(); // Salvar no Local Storage
    displayThumbnails(); // Atualizar interface

    // Limpar inputs
    fileInput.value = "";
    tagsInput.value = "";
  };
  reader.readAsDataURL(file);
});

// Exibir todas as thumbnails ao carregar a página
displayThumbnails();
