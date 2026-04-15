document.addEventListener("DOMContentLoaded", () => {
    const sidebarContainer = document.getElementById("sidebar-container");
    const topbarContainer = document.getElementById("topbar-container");

    if (sidebarContainer) {
        fetch("components/sidebar.html")
            .then((response) => response.text())
            .then((data) => {
                sidebarContainer.innerHTML = data;
            });
    }

    if (topbarContainer) {
        fetch("components/topbar.html")
            .then((response) => response.text())
            .then((data) => {
                topbarContainer.innerHTML = data;
            });
    }

    document.addEventListener("click", (event) => {
        const clickedButton = event.target.closest(".update-btn");
        const clickedMenu = event.target.closest(".dropdown-menu");
        const allMenus = document.querySelectorAll(".dropdown-menu");

        if (clickedButton) {
            const actionCell = clickedButton.closest("td");
            const currentMenu = actionCell ? actionCell.querySelector(".dropdown-menu") : null;

            if (!currentMenu) return;

            allMenus.forEach((menu) => {
                if (menu !== currentMenu) {
                    menu.classList.add("hidden");
                }
            });
            currentMenu.classList.toggle("hidden");
            return;
        }

        if (!clickedMenu) {
            allMenus.forEach((menu) => menu.classList.add("hidden"));
        }
    });
});
