// Rețetele mele - modal și afișare
function initReteteleMele() {
  const modal = document.getElementById("recipeModal");
  const modalBody = document.getElementById("modalBody");
  const modalTopbarTitle = document.getElementById("modalTopbarTitle");
  const modalBackBtn = document.getElementById("modalBackBtn");
  const recipeCards = document.querySelectorAll("#recipesGrid .recipe-card");

  // iOS scroll lock
  let _scrollY = 0;
  function lockScroll() {
    _scrollY = window.scrollY;
    document.body.style.cssText = `position:fixed;top:-${_scrollY}px;width:100%;overflow-y:scroll;`;
  }
  function unlockScroll() {
    document.body.style.cssText = "";
    window.scrollTo(0, _scrollY);
  }

  function openRecipe(recipeData) {
    if (modalTopbarTitle) modalTopbarTitle.textContent = recipeData.title;

    modalBody.innerHTML = `
      <div class="recipe-hero">
        <h2>${recipeData.title}</h2>
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
    modal.scrollTop = 0;
    lockScroll();
  }

  function closeModal() {
    modal.style.display = "none";
    unlockScroll();
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

  if (modalBackBtn) modalBackBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") closeModal();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReteteleMele);
} else {
  initReteteleMele();
}
