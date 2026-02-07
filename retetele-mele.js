// Rețetele mele - modal și afișare (același format ca celelalte)
function initReteteleMele() {
  const modal = document.getElementById("recipeModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.querySelector(".close");
  const recipeCards = document.querySelectorAll("#recipesGrid .recipe-card");

  function openRecipe(recipeData) {
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
      </div>
    `;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  recipeCards.forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const recipeTitle = card.querySelector("h3").textContent.trim();
      let recipeData = null;
      for (const key in reteteleMeleData) {
        if (
          reteteleMeleData[key].title.trim().toLowerCase() ===
          recipeTitle.toLowerCase()
        ) {
          recipeData = reteteleMeleData[key];
          break;
        }
      }
      if (recipeData) openRecipe(recipeData);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReteteleMele);
} else {
  initReteteleMele();
}
