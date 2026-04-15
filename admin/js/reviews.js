document.addEventListener("DOMContentLoaded", () => {
  const sidebarContainer = document.getElementById("sidebar-container");
  const topbarContainer = document.getElementById("topbar-container");

  const loadComponent = (container, path, errorLabel) => {
    if (!container) return Promise.resolve();

    return fetch(path)
      .then((response) => response.text())
      .then((html) => {
        container.innerHTML = html;
      })
      .catch((error) => {
        console.error(`Error loading ${errorLabel}:`, error);
      });
  };

  const setActiveSidebarLink = (targetHref) => {
    const sidebar = document.querySelector("#sidebar-container aside");
    if (!sidebar) return;

    const navLinks = sidebar.querySelectorAll('nav a[href$=".html"]');
    const inactiveClasses =
      "text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg mx-2 my-1 px-4 py-2 flex items-center gap-3 transition-colors";
    const activeClasses =
      "bg-primary text-on-primary rounded-lg mx-2 my-1 px-4 py-2 flex items-center gap-3 scale-95 active:scale-90 transition-transform";

    navLinks.forEach((link) => {
      link.className = inactiveClasses;
    });

    const activeLink = sidebar.querySelector(`nav a[href="${targetHref}"]`);
    if (activeLink) {
      activeLink.className = activeClasses;
    }
  };

  Promise.all([
    loadComponent(sidebarContainer, "components/sidebar.html", "sidebar"),
    loadComponent(topbarContainer, "components/topbar.html", "topbar"),
  ]).then(() => {
    setActiveSidebarLink("reviews.html");
  });
});