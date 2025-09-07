document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile slider if it exists
    const initMobileSlider = () => {
        const sliderTrack = document.querySelector('.slider-track');
        if (!sliderTrack) return;

        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.control-dot');
        let currentSlide = 0;
        const slideCount = slides.length;

        // Set initial slide positions
        function setSlidePosition() {
            slides.forEach((slide, index) => {
                slide.style.transform = `translateX(${index * 100}%)`;
            });
        }

        // Update active dot
        function updateActiveDot() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        // Go to slide
        function goToSlide(slideIndex) {
            if (slideIndex < 0) slideIndex = slideCount - 1;
            if (slideIndex >= slideCount) slideIndex = 0;
            
            currentSlide = slideIndex;
            sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            updateActiveDot();
        }

        // Dot click event
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });

        // Touch events for swipe
        let touchStartX = 0;
        let touchEndX = 0;

        sliderTrack.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        sliderTrack.addEventListener('touchmove', e => {
            touchEndX = e.touches[0].clientX;
        }, { passive: true });

        sliderTrack.addEventListener('touchend', () => {
            const difference = touchStartX - touchEndX;
            if (Math.abs(difference) > 50) { // Minimum swipe distance
                if (difference > 0) {
                    // Swipe left
                    goToSlide(currentSlide + 1);
                } else {
                    // Swipe right
                    goToSlide(currentSlide - 1);
                }
            }
        });

        // Initialize
        setSlidePosition();
        updateActiveDot();
    };

    // Initialize mobile menu toggle
    const initMobileMenu = () => {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const closeMenu = document.getElementById('close-menu');
        const menuOverlay = document.querySelector('.menu-overlay');

        if (!menuToggle || !mobileMenu) return;

        const toggleMenu = () => {
            mobileMenu.classList.toggle('active');
            menuOverlay.style.visibility = mobileMenu.classList.contains('active') ? 'visible' : 'hidden';
            menuOverlay.style.opacity = mobileMenu.classList.contains('active') ? '1' : '0';
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', toggleMenu);
        
        if (closeMenu) {
            closeMenu.addEventListener('click', toggleMenu);
        }

        if (menuOverlay) {
            menuOverlay.addEventListener('click', toggleMenu);
        }
    };

    // Initialize all mobile functionality
    const initMobile = () => {
        initMobileMenu();
        initMobileSlider();
        
        // Reinitialize feather icons after dynamic content loads
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    };

    // Check if mobile view
    const isMobileView = () => window.innerWidth <= 768;

    // Run initialization
    if (isMobileView()) {
        initMobile();
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (isMobileView()) {
                initMobile();
            }
        }, 250);
    });
});
