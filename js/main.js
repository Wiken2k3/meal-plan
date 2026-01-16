// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const appContainer = document.querySelector('.app-container'); // Keep this for theme

// Function to set the theme
function setTheme(theme) {
    if (theme === 'dark') {
        appContainer.setAttribute('data-theme', 'dark');
        darkModeToggle.classList.remove('off');
        localStorage.setItem('theme', 'dark');
    } else {
        appContainer.removeAttribute('data-theme');
        darkModeToggle.classList.add('off');
        localStorage.setItem('theme', 'light');
    }
}

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme') || 'light';
setTheme(currentTheme);

darkModeToggle.addEventListener('click', function() {
    const newTheme = appContainer.hasAttribute('data-theme') ? 'light' : 'dark';
    setTheme(newTheme);
});

// Bottom Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor behavior
        // Remove 'active' class from all nav items
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        // Add 'active' class to the clicked item
        this.classList.add('active');
        console.log('Navigated to:', this.querySelector('span').textContent);
    });
});

// --- NEW CONTEXT MENU & INTERACTIONS LOGIC ---

const contextMenu = document.getElementById('context-menu');

// --- Toast Notification ---
const toast = document.getElementById('toast');
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000); // Toast disappears after 2 seconds
}

// --- Event Delegation for all interactions ---

document.addEventListener('click', (e) => {
    // --- Handle Main Context Menu ---
    const mainMenuButton = e.target.closest('#main-menu-btn');
    if (mainMenuButton) {
        e.preventDefault();
        e.stopPropagation();

        // Position and show menu
        const rect = mainMenuButton.getBoundingClientRect();
        contextMenu.style.top = `${rect.bottom + window.scrollY}px`;
        contextMenu.style.left = `${rect.right - contextMenu.offsetWidth}px`;
        contextMenu.classList.add('show');
        return; // Stop further processing
    }

    // --- Handle Main Menu Item Clicks ---
    const menuItem = e.target.closest('.menu-item');
    if (menuItem && e.target.closest('#context-menu')) {
        const action = menuItem.dataset.action;

        switch (action) {
            case 'add-groceries': showToast('Adding all meals to groceries'); break;
            case 'generate-plan': showToast('Generating new plan for the week...'); break;
            case 'show-weather': showToast('Showing weather forecast'); break;
            case 'clear-week':
                if (confirm('Are you sure you want to clear all meals for the week? This cannot be undone.')) {
                    document.querySelectorAll('.meal-list').forEach(list => list.innerHTML = '');
                    showToast('Current week cleared');
                }
                break;
        }
        contextMenu.classList.remove('show'); // Hide menu after action
        return;
    }

    // --- Handle Meal Item Selection ---
    const mealItem = e.target.closest('.meal-item');
    if (mealItem) {
        mealItem.classList.toggle('selected');
    }

    // --- Hide menu if clicking outside ---
    if (contextMenu.classList.contains('show') && !e.target.closest('#context-menu')) {
        contextMenu.classList.remove('show');
    }
});
