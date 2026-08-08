/*light/dark theme listeners */
const button = document.getElementById("theme-toggle");

if (button) {
  const savedTheme = localStorage.getItem("theme");
  const setButtonState = (isDark) => {
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    button.setAttribute("aria-pressed", isDark ? "true" : "false");
  };

  const isDark = savedTheme === "dark";
  if (isDark) {
    document.body.classList.add("dark");
  }

  setButtonState(isDark);

  button.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");

    if (isDark) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.removeItem("theme");
    }

    setButtonState(isDark);
  });
}

/* Font size toggle functionality */
const fontBtn = document.getElementById("font-resize");
if (fontBtn) {
  const sizes = ["small", "medium", "large"];
  const saved = localStorage.getItem("fontSize");
  const legacy = localStorage.getItem("largeFont");
  let current = sizes.includes(saved) ? saved : (legacy === "true" ? "large" : "medium");
  if (legacy !== null) localStorage.removeItem("largeFont");

  const applySize = (size) => {
    document.body.classList.remove("font-size-small", "font-size-medium", "font-size-large");
    document.body.classList.add(`font-size-${size}`);
    const label = `Font size: ${size.charAt(0).toUpperCase() + size.slice(1)}`;
    fontBtn.setAttribute("aria-label", label);
  };

  applySize(current);

  fontBtn.addEventListener("click", () => {
    const idx = sizes.indexOf(current);
    current = sizes[(idx + 1) % sizes.length];
    applySize(current);
    localStorage.setItem("fontSize", current);
  });
}
