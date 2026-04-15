document.addEventListener("DOMContentLoaded", () => {
  const sidebarContainer = document.getElementById("sidebar-container");
  const topbarContainer = document.getElementById("topbar-container");

  if (sidebarContainer) {
    fetch("components/sidebar.html")
      .then((response) => response.text())
      .then((data) => {
        sidebarContainer.innerHTML = data;
      })
      .catch((error) => console.error("Error loading sidebar:", error));
  }

  if (topbarContainer) {
    fetch("components/topbar.html")
      .then((response) => response.text())
      .then((data) => {
        topbarContainer.innerHTML = data;
      })
      .catch((error) => console.error("Error loading topbar:", error));
  }
});
