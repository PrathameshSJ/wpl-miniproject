document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch sidebar
    fetch('components/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
        })
        .catch(err => console.error('Error loading sidebar:', err));
});
