// Modal functionality
const modal = document.getElementById("recipeModal");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.querySelector(".close");

// Filter and search elements
const filterButtons = document.querySelectorAll(".filter-btn");
const recipeCards = document.querySelectorAll(".recipe-card");
const searchInput = document.getElementById("searchInput");

// Open modal when clicking on recipe card
recipeCards.forEach((card) => {
  card.addEventListener("click", () => {
    const recipeTitle = card.querySelector("h3").textContent.trim();

    // Caută rețeta după titlu în loc de număr (case-insensitive)
    let recipeData = null;
    for (const key in recipesData) {
      if (
        recipesData[key].title.trim().toLowerCase() ===
        recipeTitle.toLowerCase()
      ) {
        recipeData = recipesData[key];
        break;
      }
    }

    if (recipeData) {
      // Obține informații nutriționale (folosește primul număr găsit)
      const recipeNumber = Object.keys(recipesData).find(
        (key) =>
          recipesData[key].title.trim().toLowerCase() ===
          recipeTitle.toLowerCase(),
      );
      const nutrition = getNutrition(parseInt(recipeNumber));

      // Afișează rețeta completă
      modalBody.innerHTML = `
                <div class="recipe-hero">
                    <div class="modal-header-compact">
                        <h2>${recipeData.title}</h2>
                        <button class="print-btn-small" onclick="window.print()">🖨️</button>
                    </div>
                    <div class="recipe-meta-bar">
                        <span>⏱️ ${recipeData.time}</span>
                        <span>👥 ${recipeData.servings}</span>
                    </div>
                </div>
                <div class="recipe-content">
                    <div class="recipe-section">
                        <h3><span class="section-icon">🥕</span> Ingrediente</h3>
                        <ul class="ingredients-list">
                            ${recipeData.ingredients.map((ing) => `<li>${ing}</li>`).join("")}
                        </ul>
                    </div>
                    <div class="recipe-section">
                        <h3><span class="section-icon">👨‍🍳</span> Mod de preparare</h3>
                        <ol class="instructions-list">
                            ${recipeData.instructions.map((inst) => `<li>${inst}</li>`).join("")}
                        </ol>
                    </div>
                    <div class="recipe-section nutrition-section">
                        <h3><span class="section-icon">📊</span> Informații Nutriționale (per porție)</h3>
                        <div class="nutrition-grid">
                            <div class="nutrition-item">
                                <span>Calorii</span>
                                <span>${nutrition.calories}</span>
                            </div>
                            <div class="nutrition-item">
                                <span>Proteine</span>
                                <span>${nutrition.protein}</span>
                            </div>
                            <div class="nutrition-item">
                                <span>Carbohidrați</span>
                                <span>${nutrition.carbs}</span>
                            </div>
                            <div class="nutrition-item">
                                <span>Grăsimi</span>
                                <span>${nutrition.fat}</span>
                            </div>
                            <div class="nutrition-item">
                                <span>Fibre</span>
                                <span>${nutrition.fiber}</span>
                            </div>
                            <div class="nutrition-item">
                                <span>Sodiu</span>
                                <span>${nutrition.sodium}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    } else {
      // Afișează mesaj pentru rețete fără detalii complete
      const timeText = card.querySelector(".time").textContent;
      const servingsText = card.querySelector(".servings").textContent;

      modalBody.innerHTML = `
                <h2>${recipeTitle}</h2>
                <div class="recipe-info">
                    <span>${timeText}</span>
                    <span>${servingsText}</span>
                </div>
                <div class="recipe-section">
                    <p class="no-details">📖 Detaliile complete pentru această rețetă vor fi adăugate în curând.</p>
                    <p class="no-details">Consultați cartea de rețete PDF originală pentru ingrediente și mod de preparare complet.</p>
                    <p class="no-details" style="margin-top: 20px; font-size: 0.95em; color: #999;">
                        💡 <strong>Tip:</strong> Am inclus deja ${Object.keys(recipesData).length} rețete complete! 
                        Încearcă Piftie (#12), Gulaș de vită (#13), Varză călită (#17) sau Dulceață de piersici (#21).
                    </p>
                </div>
            `;
    }

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  });
});

// Close modal
closeBtn.onclick = () => {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
};

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
};

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.style.display === "block") {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

// Filter functionality
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");

    // Update active button
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Filter cards
    recipeCards.forEach((card) => {
      if (
        category === "toate" ||
        card.getAttribute("data-category") === category
      ) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// Search functionality
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();

  recipeCards.forEach((card) => {
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

  // Reset active filter when searching
  if (searchTerm) {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
  } else {
    // If search is cleared, reactivate "Toate" filter
    filterButtons[0].classList.add("active");
  }
});
