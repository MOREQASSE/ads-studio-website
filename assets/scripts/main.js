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

if (menuToggle && closeMenu && mobileMenu) {
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.remove('hidden');
    });
    
    closeMenu.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
    });
}
