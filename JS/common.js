function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    // Toggle classes
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
}

function toggleTheme() {
    const html = document.documentElement;
    const checkbox = document.getElementById('checkbox');
    const label = document.querySelector('.theme-label');

    if (checkbox.checked) {
        html.setAttribute('data-theme', 'dark');
        if (label) label.innerText = 'Dark Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        if (label) label.innerText = 'Light Mode';
        localStorage.setItem('theme', 'light');
    }
}

window.onload = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const checkbox = document.getElementById('checkbox');
    const label = document.querySelector('.theme-label');
    
    if (savedTheme === 'dark') {
        if (checkbox) checkbox.checked = true;
        if (label) label.innerText = 'Dark Mode';
    }
};
