function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    // Toggle classes
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
}

window.onload = () => {
    document.documentElement.setAttribute('data-theme', 'dark');
};
