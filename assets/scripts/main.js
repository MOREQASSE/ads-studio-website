// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Initialize Feather Icons
feather.replace();

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const closeMenu = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');
const body = document.body;

// Function to toggle menu
function toggleMenu(show) {
    const isOpen = mobileMenu.classList.toggle('active', show);
    menuToggle.setAttribute('aria-expanded', isOpen);
    body.classList.toggle('menu-open', isOpen);
    
    // Toggle between menu and close icon
    const menuIcon = menuToggle.querySelector('i');
    if (menuIcon) {
        menuIcon.setAttribute('data-feather', isOpen ? 'x' : 'menu');
        feather.replace();
    }
}

// Toggle menu when clicking the menu button
if (menuToggle && mobileMenu) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    
    menuToggle.addEventListener('click', function() {
        const isOpen = mobileMenu.classList.contains('active');
        toggleMenu(!isOpen);
    });
    
    // Close menu when clicking on a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(false);
        });
    });
}

// Close menu when clicking the close button or overlay
if (closeMenu) {
    closeMenu.addEventListener('click', () => toggleMenu(false));
}

// Close menu when clicking outside
const menuOverlay = document.querySelector('.menu-overlay');
if (menuOverlay) {
    menuOverlay.addEventListener('click', () => toggleMenu(false));
}

// Close menu when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        toggleMenu(false);
    }
});

// Update active link based on current page
function updateActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('#mobile-menu a');
    
    links.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// Update active link on page load and when the menu is opened
document.addEventListener('DOMContentLoaded', updateActiveLink);
if (mobileMenu) {
    mobileMenu.addEventListener('transitionend', updateActiveLink);
}
