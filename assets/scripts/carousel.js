document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.client-logo');
    const dots = document.querySelectorAll('.carousel-dots button');
    const prevBtn = document.querySelector('.carousel-arrow.left-0');
    const nextBtn = document.querySelector('.carousel-arrow.right-0');
    
    // Use original slides without cloning
    const allSlides = document.querySelectorAll('.client-logo');
    const slideCount = allSlides.length;
    
    let currentIndex = 0; // Start at the first slide
    let isMobile = window.innerWidth <= 768;
    let activeSlideIndex = null;
    let isAnimating = false;
    const slideWidth = allSlides[0].offsetWidth + 32; // width + gap (2rem = 32px)
    
    // Set initial position to show the first real slide
    track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
    
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
        if (isAnimating) return;
        isAnimating = true;
        currentIndex++;
        updateCarousel();
    }
    
    function prevSlide() {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex--;
        updateCarousel();
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    function updateCarousel() {
        // Apply smooth transition for all slides
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        
        // Check if we need to loop around
        const isAtBoundary = currentIndex <= 0 || currentIndex >= slideCount;
        
        if (isAtBoundary) {
            track.addEventListener('transitionend', handleTransitionEnd, { once: true });
        } else {
            // Reset animation flag when not at boundary
            setTimeout(() => {
                isAnimating = false;
            }, 500); // Match this with the transition duration
        }
        
        updateDots();
    }
    
    function handleTransitionEnd() {
        // Disable transitions for the reset
        track.style.transition = 'none';
        
        if (currentIndex >= slideCount) {
            // Loop back to the first slide
            currentIndex = 0;
            track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        } else if (currentIndex < 0) {
            // Loop to the last slide
            currentIndex = slideCount - 1;
            track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        }
        
        // Force reflow to ensure the transform is applied
        track.offsetHeight;
        
        // Re-enable transitions
        track.style.transition = 'transform 0.5s ease-in-out';
        isAnimating = false;
    }
    
    function updateDots() {
        const actualIndex = currentIndex % (slides.length);
        
        // Update dots
        dots.forEach((dot, index) => {
            if (index === actualIndex) {
                dot.classList.add('bg-gold');
                dot.classList.remove('bg-gray-700');
            } else {
                dot.classList.remove('bg-gold');
                dot.classList.add('bg-gray-700');
            }
        });
        
        // Update active slide appearance
        const allSlides = document.querySelectorAll('.client-logo');
        allSlides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            const overlay = slide.querySelector('.client-overlay');
            
            if (index === currentIndex) {
                // Show details and color for active slide
                img.classList.remove('grayscale');
                if (overlay) overlay.classList.add('mobile-active');
            } else {
                // Hide details and grayscale for inactive slides
                img.classList.add('grayscale');
                if (overlay) overlay.classList.remove('mobile-active');
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
    
    // Make sure only arrows and dots are clickable for navigation
    const arrows = document.querySelectorAll('.carousel-arrow');
    arrows.forEach(arrow => {
        arrow.style.pointerEvents = 'auto';
    });
    
    // Handle dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(index);
        });
    });
    
    // Remove any existing click handlers from slides
    slides.forEach((slide) => {
        // Clone the slide to remove all event listeners
        const newSlide = slide.cloneNode(true);
        slide.parentNode.replaceChild(newSlide, slide);
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
