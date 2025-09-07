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

    // Initialize mobile menu functionality
    const initMobileMenu = () => {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const closeMenu = document.getElementById('close-menu');
        const menuOverlay = document.querySelector('.mobile-menu-overlay');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        if (!menuToggle || !mobileMenu) return;

        // Toggle menu function
        const toggleMenu = (open = null) => {
            const isOpening = open !== null ? open : !mobileMenu.classList.contains('active');
            
            if (isOpening) {
                // Open menu
                document.body.style.overflow = 'hidden';
                menuOverlay.classList.add('active');
                mobileMenu.classList.add('active');
            } else {
                // Close menu
                document.body.style.overflow = '';
                menuOverlay.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        };

        // Toggle menu on button click
        menuToggle.addEventListener('click', () => toggleMenu(true));
        
        // Close menu on close button click
        if (closeMenu) {
            closeMenu.addEventListener('click', () => toggleMenu(false));
        }

        // Close menu on overlay click
        if (menuOverlay) {
            menuOverlay.addEventListener('click', () => toggleMenu(false));
        }

        // Close menu when clicking on a nav link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Only close if it's not a dropdown toggle
                if (!e.currentTarget.classList.contains('has-submenu')) {
                    toggleMenu(false);
                }
            });
        });

        // Close menu when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        });
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
    } else {
        // Make sure menu is closed on desktop
        const mobileMenu = document.getElementById('mobile-menu');
        const menuOverlay = document.querySelector('.mobile-menu-overlay');
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Reinitialize on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (isMobileView()) {
                initMobile();
            } else {
                // Make sure menu is closed on desktop
                const mobileMenu = document.getElementById('mobile-menu');
                const menuOverlay = document.querySelector('.mobile-menu-overlay');
                if (mobileMenu) mobileMenu.classList.remove('active');
                if (menuOverlay) menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuToggle = document.getElementById('menu-toggle');
        
        if (mobileMenu && mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            mobileMenu.classList.remove('active');
            document.querySelector('.mobile-menu-overlay').classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});
