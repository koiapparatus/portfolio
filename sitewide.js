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
    fontBtn.title = label;
  };

  applySize(current);

  fontBtn.addEventListener("click", () => {
    const idx = sizes.indexOf(current);
    current = sizes[(idx + 1) % sizes.length];
    applySize(current);
    localStorage.setItem("fontSize", current);
  });
}
/* Navigation setup */
const siteNav = document.querySelector("nav");
const siteNavList = siteNav?.querySelector(":scope > ul");

if (siteNav && siteNavList) {
  const collapseId = "portfolio-navigation";
  const toggler = document.createElement("button");
  const collapse = document.createElement("div");
  const tools = document.createElement("div");
  const icon = document.createElement("span");
  const brand = document.createElement("a");

  siteNav.classList.add("navbar", "navbar-expand-lg");
  siteNav.classList.add("container-fluid");
  siteNavList.classList.add("navbar-nav");
  brand.className = "navbar-brand";
  brand.href = siteNavList.querySelector(":scope > li > a")?.getAttribute("href") || "index.html";
  brand.innerHTML = '<span class="brand-mark" aria-hidden="true">JJ</span><span>Justin Jackson</span>';
  toggler.type = "button";
  toggler.className = "navbar-toggler";
  toggler.setAttribute("data-bs-toggle", "collapse");
  toggler.setAttribute("data-bs-target", `#${collapseId}`);
  toggler.setAttribute("aria-controls", collapseId);
  toggler.setAttribute("aria-expanded", "false");
  toggler.setAttribute("aria-label", "Toggle navigation");
  icon.className = "navbar-toggler-icon";
  toggler.append(icon);

  collapse.id = collapseId;
  collapse.className = "collapse navbar-collapse";
  collapse.append(siteNavList);

  tools.className = "navbar-tools";
  if (button) {
    button.classList.add("btn", "btn-sm", "site-tool");
    tools.append(button);
  }
  if (fontBtn) {
    fontBtn.classList.add("btn", "btn-sm", "site-tool");
    tools.append(fontBtn);
  }

  siteNav.prepend(toggler);
  siteNav.prepend(brand);
  siteNav.append(collapse, tools);
}
