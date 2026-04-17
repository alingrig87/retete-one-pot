// Video Recipes App - JavaScript pentru filtrare și căutare

// Filtrare după categorie
const filterButtons = document.querySelectorAll(".filter-btn");
const videoCards = document.querySelectorAll(".recipe-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Actualizare active state
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const category = button.dataset.category;

    // Filtrare carduri
    videoCards.forEach((card) => {
      if (category === "all" || card.dataset.category === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// Căutare rețete
const searchBox = document.getElementById("searchBox");

function fărăDiacritice(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

searchBox.addEventListener("input", (e) => {
  const searchTerm = fărăDiacritice(e.target.value);

  videoCards.forEach((card) => {
    const title = fărăDiacritice(card.querySelector("h3").textContent);
    const description = fărăDiacritice(
      card.querySelector(".recipe-description").textContent,
    );

    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });

  // Dacă se caută, reseteazăfiltrele
  if (searchTerm) {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
  }
});
