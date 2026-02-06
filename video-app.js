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

searchBox.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();

  videoCards.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const description = card
      .querySelector(".recipe-description")
      .textContent.toLowerCase();

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
