// Modal functionality
const modal = document.getElementById("recipeModal");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.querySelector(".close");

// Filter and search elements
const filterButtons = document.querySelectorAll(".filter-btn");
const recipeCards = document.querySelectorAll("#recipesGrid .recipe-card");
const searchInput = document.getElementById("searchInput");

// ===== Share helpers =====
function slugify(str) {
  return str
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function copyShareLink(slug) {
  const url = window.location.href.split("#")[0] + "#" + slug;
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById("shareBtn");
    if (btn) {
      btn.textContent = "✓ Link copiat!";
      btn.classList.add("share-btn--copied");
      setTimeout(() => {
        btn.textContent = "🔗 Share";
        btn.classList.remove("share-btn--copied");
      }, 2000);
    }
  });
}

// ===== Open modal =====
function openRecipeByCard(card) {
  const recipeTitle = card.querySelector("h3").textContent.trim();
  const slug = "reteta-" + slugify(recipeTitle);

  let recipeData = null;
  for (const key in recipesData) {
    if (recipesData[key].title.trim().toLowerCase() === recipeTitle.toLowerCase()) {
      recipeData = recipesData[key];
      break;
    }
  }

  if (recipeData) {
    const recipeNumber = Object.keys(recipesData).find(
      (key) => recipesData[key].title.trim().toLowerCase() === recipeTitle.toLowerCase(),
    );
    const nutrition = getNutrition(parseInt(recipeNumber));

    modalBody.innerHTML = `
      <div class="recipe-hero">
        <div class="modal-header-compact">
          <h2>${recipeData.title}</h2>
          <div class="modal-actions">
            <button class="share-btn" id="shareBtn" onclick="copyShareLink('${slug}')">🔗 Share</button>
            <button class="print-btn-small" onclick="window.print()">🖨️</button>
          </div>
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
            <div class="nutrition-item"><span>Calorii</span><span>${nutrition.calories}</span></div>
            <div class="nutrition-item"><span>Proteine</span><span>${nutrition.protein}</span></div>
            <div class="nutrition-item"><span>Carbohidrați</span><span>${nutrition.carbs}</span></div>
            <div class="nutrition-item"><span>Grăsimi</span><span>${nutrition.fat}</span></div>
            <div class="nutrition-item"><span>Fibre</span><span>${nutrition.fiber}</span></div>
            <div class="nutrition-item"><span>Sodiu</span><span>${nutrition.sodium}</span></div>
          </div>
        </div>
      </div>
    `;
  } else {
    const timeText = card.querySelector(".time").textContent;
    const servingsText = card.querySelector(".servings").textContent;

    modalBody.innerHTML = `
      <div class="recipe-hero">
        <div class="modal-header-compact">
          <h2>${recipeTitle}</h2>
          <div class="modal-actions">
            <button class="share-btn" id="shareBtn" onclick="copyShareLink('${slug}')">🔗 Share</button>
          </div>
        </div>
        <div class="recipe-meta-bar">
          <span>${timeText}</span>
          <span>${servingsText}</span>
        </div>
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

  history.replaceState(null, "", "#" + slug);
  modal.style.display = "block";
  document.documentElement.style.overflow = "hidden";
}

recipeCards.forEach((card) => {
  card.addEventListener("click", () => openRecipeByCard(card));
});

// ===== Close modal =====
function closeModal() {
  modal.style.display = "none";
  document.documentElement.style.overflow = "";
  history.replaceState(null, "", window.location.pathname);
}

closeBtn.onclick = closeModal;
window.onclick = (e) => { if (e.target === modal) closeModal(); };
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.style.display === "block") closeModal();
});

// ===== Auto-open from URL hash =====
function openFromHash() {
  const hash = window.location.hash.slice(1);
  if (!hash.startsWith("reteta-")) return;
  const slug = hash.slice("reteta-".length);
  for (const card of recipeCards) {
    const title = card.querySelector("h3").textContent.trim();
    if (slugify(title) === slug) {
      openRecipeByCard(card);
      break;
    }
  }
}

openFromHash();

// ===== Filter =====
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    recipeCards.forEach((card) => {
      card.style.display =
        category === "toate" || card.getAttribute("data-category") === category
          ? "block" : "none";
    });
  });
});

// ===== Search =====
function fărăDiacritice(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

searchInput.addEventListener("input", (e) => {
  const searchTerm = fărăDiacritice(e.target.value);
  recipeCards.forEach((card) => {
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
  if (searchTerm) filterButtons.forEach((btn) => btn.classList.remove("active"));
  else filterButtons[0].classList.add("active");
});
