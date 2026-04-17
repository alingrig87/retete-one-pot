const filterButtons = document.querySelectorAll(".filter-btn");
const recipeCards = document.querySelectorAll("#recipesGrid .recipe-card");
const searchInput = document.getElementById("searchInput");

// ===== iOS scroll lock =====
let _scrollY = 0;
function lockScroll() {
  _scrollY = window.scrollY;
  document.body.style.cssText = `position:fixed;top:-${_scrollY}px;width:100%;overflow-y:scroll;`;
}
function unlockScroll() {
  document.body.style.cssText = "";
  window.scrollTo(0, _scrollY);
}

// ===== Filter =====
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    recipeCards.forEach((card) => {
      card.style.display =
        category === "toate" || card.getAttribute("data-category") === category
          ? "block"
          : "none";
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
    const desc = fărăDiacritice(card.querySelector(".recipe-description")?.textContent || "");
    card.style.display =
      title.includes(searchTerm) || desc.includes(searchTerm) ? "block" : "none";
  });
  if (searchTerm) filterButtons.forEach((btn) => btn.classList.remove("active"));
  else filterButtons[0].classList.add("active");
});

// ===== Săratele Modal =====
const sarateleModal = document.getElementById("sarateleModal");
const cardSaratele = document.getElementById("cardSaratele");
const backSaratele = document.getElementById("backSaratele");

function openSarateleModal() {
  sarateleModal.style.display = "block";
  sarateleModal.scrollTop = 0;
  lockScroll();
  history.replaceState(null, "", "#saratele");
}

function closeSarateleModal() {
  sarateleModal.style.display = "none";
  unlockScroll();
  history.replaceState(null, "", window.location.pathname);
}

if (cardSaratele && sarateleModal) {
  cardSaratele.addEventListener("click", openSarateleModal);
  if (backSaratele) backSaratele.addEventListener("click", closeSarateleModal);
  sarateleModal.addEventListener("click", (e) => {
    if (e.target === sarateleModal) closeSarateleModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sarateleModal.style.display === "block") closeSarateleModal();
  });
}

// Share button
const shareSaratele = document.getElementById("shareSaratele");
if (shareSaratele) {
  shareSaratele.addEventListener("click", () => {
    const url = window.location.href.split("#")[0] + "#saratele";
    navigator.clipboard.writeText(url).then(() => {
      shareSaratele.textContent = "✓ Link copiat!";
      shareSaratele.classList.add("share-btn--copied");
      setTimeout(() => {
        shareSaratele.textContent = "🔗 Share";
        shareSaratele.classList.remove("share-btn--copied");
      }, 2000);
    });
  });
}

// Auto-open from hash
if (window.location.hash === "#saratele") openSarateleModal();

// ===== Recipe versions (per tavă) =====
const BUCATI_PER_TAVA = 25;

const VERSIUNI = {
  clasic: {
    unt: 75,
    laptGrams: 50,
    laptNume: "Smântână Napolact 25%",
    laptNote: "",
    desc: "Rețeta originală: unt Président + smântână Napolact 25% — textură clasică fragedă.",
    tipLaptat: "Smântâna Napolact 25% e perfectă — grăsimea ridicată ajută la textura fragedă. Nu folosi smântână de gătit (sub 20%).",
    step4Laptat: "smântâna Napolact 25%",
  },
  iaurt: {
    unt: 75,
    laptGrams: 50,
    laptNume: "Iaurt grecesc Kolio 10%",
    laptNote: "",
    desc: "Smântâna Napolact înlocuită cu iaurt grecesc Kolio 10% — mai puțin grăsime, textură aproape identică.",
    tipLaptat: "Iaurtul grecesc Kolio 10% e suficient de gros — nu trebuie scurs. Dacă e mai lichid dintr-un lot, scurge 10 min într-un tifon.",
    step4Laptat: "iaurtul grecesc Kolio 10%",
  },
  sanatos: {
    unt: 50,
    laptGrams: 75,
    laptNume: "Iaurt grecesc Kolio 10%",
    laptNote: "",
    desc: "Mai puțin unt Président, mai mult Kolio 10% — mai puțin caloric, totuși fraged.",
    tipLaptat: "Cu 50g unt per tavă aluatul e ușor mai puțin fraged — dar tot bun! Dacă se sfărâmă la întins, lasă-l 5 min la temperatura camerei.",
    step4Laptat: "iaurtul grecesc Kolio 10%",
  },
  extra: {
    unt: 30,
    laptGrams: 95,
    laptNume: "Iaurt grecesc Kolio 10%",
    laptNote: "",
    desc: "Minim unt Président, maxim Kolio 10% — cel mai sănătos, textura diferă ușor față de clasic.",
    tipLaptat: "Cu puțin unt și mult iaurt Kolio aluatul e mai moale și lipicios — răcește-l obligatoriu 45–60 min și lucrează rapid la întins.",
    step4Laptat: "iaurtul grecesc Kolio 10%",
  },
};

let currentTavi = 2;
let currentVersiune = "clasic";

// ===== Tray Selector =====
document.querySelectorAll(".tavi-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tavi-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentTavi = parseInt(btn.getAttribute("data-tavi"));
    updateRecipe();
  });
});

// ===== Version Selector =====
document.querySelectorAll(".versiune-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".versiune-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentVersiune = btn.getAttribute("data-versiune");
    updateRecipe();
  });
});

function fmtG(n) { return n + "g"; }

function fmtOua(n) {
  return "= " + n + (n === 1 ? " ou" : " ouă");
}

function fmtSare(tavi) {
  const val = 0.75 * tavi;
  const map = { 0.75: "¾", 1.5: "1½", 2.25: "2¼", 3: "3" };
  return "= " + (map[val] || val.toFixed(2)) + " linguriță";
}

function fmtPraf(tavi) {
  const val = 0.5 * tavi;
  const map = { 0.5: "½", 1: "1", 1.5: "1½", 2: "2" };
  return "= " + (map[val] || val.toFixed(1)) + " linguriță";
}

function fmtOuUns(tavi) {
  const n = tavi <= 2 ? 1 : tavi <= 4 ? 1 : 2;
  return n + (n === 1 ? " ou" : " ouă");
}

function updateRecipe() {
  const v = VERSIUNI[currentVersiune];
  const t = currentTavi;

  document.getElementById("bucatiCount").textContent = t * BUCATI_PER_TAVA;

  document.querySelectorAll(".tavi-multiplier-badge").forEach((el) => {
    el.textContent = t;
  });

  document.querySelectorAll(".ing-grams").forEach((el) => {
    const perTava = parseInt(el.getAttribute("data-per-tava"));
    el.textContent = "= " + fmtG(perTava * t);
  });

  document.querySelectorAll(".ing-oua").forEach((el) => {
    el.textContent = fmtOua(parseInt(el.getAttribute("data-per-tava")) * t);
  });

  document.querySelector(".ing-sare").textContent = fmtSare(t);
  document.querySelector(".ing-praf").textContent = fmtPraf(t);
  document.querySelector(".ing-ou-uns").textContent = fmtOuUns(t);

  document.querySelector(".ing-per-unt").textContent = v.unt + "g/tavă ×";
  document.querySelector(".ing-grams-unt").textContent = "= " + fmtG(v.unt * t);

  document.querySelector(".ing-name-laptat").textContent = v.laptNume;
  document.querySelector(".ing-per-laptat").textContent = v.laptGrams + "g/tavă ×";
  document.querySelector(".ing-grams-laptat").textContent = "= " + fmtG(v.laptGrams * t);

  const noteEl = document.querySelector(".ing-row-laptat .ing-note");
  if (noteEl) noteEl.textContent = v.laptNote;
  else if (v.laptNote) {
    const strong = document.querySelector(".ing-grams-laptat");
    const note = document.createElement("em");
    note.className = "ing-note";
    note.textContent = v.laptNote;
    strong.after(note);
  }

  document.getElementById("versiuneDesc").textContent = v.desc;

  const tipEl = document.getElementById("tipLaptat");
  if (tipEl) tipEl.textContent = v.tipLaptat;

  const step4El = document.getElementById("step4Laptat");
  if (step4El) step4El.textContent = v.step4Laptat;
}

updateRecipe();

// ===== Biscuiți Modal =====
const biscuitiModal = document.getElementById("biscuitiModal");
const cardBiscuiti = document.getElementById("cardBiscuiti");
const backBiscuiti = document.getElementById("backBiscuiti");

const VERSIUNI_B = {
  banane: {
    fructNume: "Banane coapte",
    fructPer: "1 banană/tavă ×",
    fructTotal: (t) => `= ${t} ${t === 1 ? "banană" : "banane"}`,
    fructNote: "(~100g piure per banană)",
    grasimeNume: "Unt Président (topit, răcit)",
    grasimePer: "30g/tavă ×",
    grasimePerTava: 30,
    desc: "Rețeta clasică cu banane coapte — cu cât banana e mai coaptă (pete negre), cu atât mai dulce natural.",
    step1Extra: "Zdrobește bananele cu o furculiță într-un bol separat până obții un piure omogen — cu cât sunt mai coapte (cu pete negre), cu atât mai bine.",
    step3Fruct: "piureul de banane",
    tipFruct: "Dacă banana e prea mare, folosește 1 și jumătate la 2 tăvi — consistența trebuie să fie lipicioasă, nu curgătoare.",
  },
  mere: {
    fructNume: "Mere rase (cu tot cu coajă)",
    fructPer: "1 măr mic/tavă ×",
    fructTotal: (t) => `= ${t} ${t === 1 ? "măr" : "mere"} (~100g rase)`,
    fructNote: "(stoarce excesul de zeamă)",
    grasimeNume: "Unt Président (topit, răcit)",
    grasimePer: "30g/tavă ×",
    grasimePerTava: 30,
    desc: "Cu mere rase în loc de banane — mai puțin dulce, ușor acrișor. Stoacă bine merele rase înainte să le adaugi.",
    step1Extra: "Rade merele (cu tot cu coajă pentru fibre) și stoarce bine excesul de zeamă cu mâna sau într-un tifon — altfel aluatul e prea umed.",
    step3Fruct: "merele rase și stoarse",
    tipFruct: "Merele rase dau mai multă umiditate decât bananele — dacă compoziția e prea moale, adaugă 1–2 linguri de fulgi de ovăz în plus.",
  },
  "fara-lactoza": {
    fructNume: "Banane coapte",
    fructPer: "1 banană/tavă ×",
    fructTotal: (t) => `= ${t} ${t === 1 ? "banană" : "banane"}`,
    fructNote: "(~100g piure per banană)",
    grasimeNume: "Ulei de cocos (topit)",
    grasimePer: "25g/tavă ×",
    grasimePerTava: 25,
    desc: "Fără lactoză — untul înlocuit cu ulei de cocos. Dă o aromă ușoară de cocos care merge perfect cu bananele.",
    step1Extra: "Zdrobește bananele cu o furculiță. Topește uleiul de cocos la temperatura camerei sau 10 sec la microunde — nu trebuie să fie fierbinte, doar lichid.",
    step3Fruct: "piureul de banane",
    tipFruct: "Uleiul de cocos se solidifică la rece — dacă vrei să păstrezi biscuiții la frigider, scoate-i cu 10 min înainte.",
  },
};

const BUCATI_PER_TAVA_B = 17;
let currentTaviB = 2;
let currentVerB = "banane";

function fmtScortisoara(t) {
  const map = { 1: "½ linguriță", 2: "1 linguriță", 3: "1½ linguriță", 4: "2 lingurițe" };
  return "= " + (map[t] || t * 0.5 + " linguriță");
}
function fmtVanilie(t) {
  const map = { 1: "¼ linguriță", 2: "½ linguriță", 3: "¾ linguriță", 4: "1 linguriță" };
  return "= " + (map[t] || t * 0.25 + " linguriță");
}
function fmtOuaB(t) {
  const n = Math.ceil(t / 2);
  return "= " + n + (n === 1 ? " ou" : " ouă");
}
function fmtOptional(t) {
  return "= " + (t * 25) + "g";
}

function updateBiscuiti() {
  const v = VERSIUNI_B[currentVerB];
  const t = currentTaviB;

  document.getElementById("bucatiBiscuiti").textContent = t * BUCATI_PER_TAVA_B;

  document.querySelectorAll(".tavi-multiplier-badge--b").forEach((el) => {
    el.textContent = t;
  });

  document.querySelectorAll(".ing-b-grams").forEach((el) => {
    const perTava = parseInt(el.getAttribute("data-per-tava"));
    el.textContent = "= " + (perTava * t) + "g";
  });

  document.querySelector(".ing-name-fruct").textContent = v.fructNume;
  document.querySelector(".ing-per-fruct").textContent = v.fructPer;
  document.querySelector(".ing-b-banane").textContent = v.fructTotal(t);
  document.querySelector(".ing-note-fruct").textContent = v.fructNote;

  document.querySelector(".ing-name-grasime").textContent = v.grasimeNume;
  document.querySelector(".ing-per-grasime").textContent = v.grasimePer + " ×";
  document.querySelector(".ing-b-grasime").textContent = "= " + (v.grasimePerTava * t) + "g";

  document.querySelector(".ing-b-oua").textContent = fmtOuaB(t);
  document.querySelector(".ing-b-scortisoara").textContent = fmtScortisoara(t);
  document.querySelector(".ing-b-vanilie").textContent = fmtVanilie(t);
  document.querySelector(".ing-b-optional").textContent = fmtOptional(t);

  document.getElementById("versiuneDescB").textContent = v.desc;

  const step1Extra = document.getElementById("bStep1Extra");
  if (step1Extra) step1Extra.textContent = v.step1Extra;
  const step3Fruct = document.getElementById("bStep3Fruct");
  if (step3Fruct) step3Fruct.textContent = v.step3Fruct;
  const tipFruct = document.getElementById("bTipFruct");
  if (tipFruct) tipFruct.textContent = v.tipFruct;
}

// Tray buttons
document.querySelectorAll(".tavi-btn-b").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tavi-btn-b").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentTaviB = parseInt(btn.getAttribute("data-tavi"));
    updateBiscuiti();
  });
});

// Version buttons
document.querySelectorAll(".versiune-btn-b").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".versiune-btn-b").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentVerB = btn.getAttribute("data-ver");
    updateBiscuiti();
  });
});

function openBiscuitiModal() {
  biscuitiModal.style.display = "block";
  biscuitiModal.scrollTop = 0;
  lockScroll();
  history.replaceState(null, "", "#biskids");
}

function closeBiscuitiModal() {
  biscuitiModal.style.display = "none";
  unlockScroll();
  history.replaceState(null, "", window.location.pathname);
}

if (cardBiscuiti && biscuitiModal) {
  cardBiscuiti.addEventListener("click", openBiscuitiModal);
  if (backBiscuiti) backBiscuiti.addEventListener("click", closeBiscuitiModal);
  biscuitiModal.addEventListener("click", (e) => {
    if (e.target === biscuitiModal) closeBiscuitiModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && biscuitiModal.style.display === "block") closeBiscuitiModal();
  });
}

// Share
const shareBiscuiti = document.getElementById("shareBiscuiti");
if (shareBiscuiti) {
  shareBiscuiti.addEventListener("click", () => {
    const url = window.location.href.split("#")[0] + "#biskids";
    navigator.clipboard.writeText(url).then(() => {
      shareBiscuiti.textContent = "✓ Link copiat!";
      shareBiscuiti.classList.add("share-btn--copied");
      setTimeout(() => {
        shareBiscuiti.textContent = "🔗 Share";
        shareBiscuiti.classList.remove("share-btn--copied");
      }, 2000);
    });
  });
}

// Auto-open from hash
if (window.location.hash === "#biskids") openBiscuitiModal();

updateBiscuiti();
