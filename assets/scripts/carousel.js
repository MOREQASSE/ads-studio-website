document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.client-logo');
    const dots = document.querySelectorAll('.carousel-dots button');
    const prevBtn = document.querySelector('.carousel-arrow.left-0');
    const nextBtn = document.querySelector('.carousel-arrow.right-0');
    
    let currentIndex = 0;
    let isMobile = window.innerWidth <= 768; // Check if mobile device
    let activeSlideIndex = null; // Track which slide is currently active on mobile
    const slideCount = slides.length - 1; // Account for duplicate slide
    const slideWidth = slides[0].offsetWidth + 32; // width + gap (2rem = 32px)
    
    // Set initial position
    updateCarousel();
    
    // Auto-rotate carousel
    let autoSlide = setInterval(() => {
        nextSlide();
    }, 2000);
    
    // Pause auto-rotate on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            nextSlide();
        }, 2000);
    });
    
    // Navigation functions
    function nextSlide() {
        currentIndex++;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex--;
        updateCarousel();
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    function updateCarousel() {
        const actualSlideCount = slideCount / 2; // Since we duplicate the slides for infinite effect
        
        // If we're at the last slide (which is a duplicate of the first), reset without animation
        if (currentIndex >= slideCount) {
            currentIndex = 0;
            track.style.transition = 'none';
            track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
            // Force reflow
            track.offsetHeight;
        }
        // If we're at the first slide and going backwards, jump to the duplicate at the end
        else if (currentIndex < 0) {
            currentIndex = slideCount - 1;
            track.style.transition = 'none';
            track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
            // Force reflow
            track.offsetHeight;
        }
        
        // Apply the transition and move to the current slide
        track.style.transition = currentIndex === 0 || currentIndex >= slideCount - 1 ? 'none' : 'transform 0.5s ease';
        track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        
        // Update active dot - use modulo to get the correct dot index
        updateDots();
    }
    
    function updateDots() {
        const actualIndex = currentIndex % (dots.length);
        dots.forEach((dot, index) => {
            if (index === actualIndex) {
                dot.classList.add('bg-gold');
                dot.classList.remove('bg-gray-700');
            } else {
                dot.classList.remove('bg-gold');
                dot.classList.add('bg-gray-700');
            }
        });
    }
    
    // Toggle slide details on mobile
    function toggleSlideDetails(index) {
        const slide = slides[index];
        const overlay = slide.querySelector('.client-overlay');
        
        if (activeSlideIndex === index) {
            // Clicking the active slide again hides the overlay
            overlay.classList.remove('mobile-active');
            activeSlideIndex = null;
        } else {
            // Hide any other active slide
            if (activeSlideIndex !== null) {
                const activeOverlay = slides[activeSlideIndex].querySelector('.client-overlay');
                activeOverlay.classList.remove('mobile-active');
            }
            // Show clicked slide's overlay
            overlay.classList.add('mobile-active');
            activeSlideIndex = index;
        }
    }

    // Close overlay when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.client-logo') && activeSlideIndex !== null) {
            const activeOverlay = slides[activeSlideIndex].querySelector('.client-overlay');
            activeOverlay.classList.remove('mobile-active');
            activeSlideIndex = null;
        }
    });

    // Event listeners for navigation
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
        // Close any open overlays when navigating
        if (activeSlideIndex !== null) {
            const activeOverlay = slides[activeSlideIndex].querySelector('.client-overlay');
            activeOverlay.classList.remove('mobile-active');
            activeSlideIndex = null;
        }
    });
    
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
        // Close any open overlays when navigating
        if (activeSlideIndex !== null) {
            const activeOverlay = slides[activeSlideIndex].querySelector('.client-overlay');
            activeOverlay.classList.remove('mobile-active');
            activeSlideIndex = null;
        }
    });
    
    // Add click handler to each slide for mobile
    slides.forEach((slide, index) => {
        slide.addEventListener('click', (e) => {
            if (isMobile) {
                e.preventDefault();
                e.stopPropagation();
                toggleSlideDetails(index);
            }
        });
        
        // Prevent click on the slide from propagating to parent elements
        slide.addEventListener('mousedown', (e) => {
            if (isMobile) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            slideWidth = slides[0].offsetWidth + 32;
            updateCarousel();
        }, 250);
    });
    
    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    track.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    }, { passive: true });
    
    track.addEventListener('touchend', () => {
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for a swipe to trigger slide change
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) < swipeThreshold) return;
        
        if (swipeDistance > 0) {
            // Swipe right - go to previous slide
            prevSlide();
        } else {
            // Swipe left - go to next slide
            nextSlide();
        }
    }
});
