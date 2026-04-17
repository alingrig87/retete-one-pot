// Dropdown toggle for nav
document.querySelectorAll(".nav-dropdown-toggle").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const dropdown = btn.closest(".nav-dropdown");
    dropdown.classList.toggle("open");
  });
});

// Close dropdown when clicking outside
document.addEventListener("click", () => {
  document.querySelectorAll(".nav-dropdown.open").forEach((d) => {
    d.classList.remove("open");
  });
});
