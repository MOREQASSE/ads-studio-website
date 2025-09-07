class OptimizedCarousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.items = Array.from(container.querySelectorAll('.client-logo'));
        this.dots = Array.from(container.querySelectorAll('.carousel-dots button'));
        this.prevBtn = container.querySelector('.carousel-arrow.left-0');
        this.nextBtn = container.querySelector('.carousel-arrow.right-0');
        
        this.currentIndex = 0;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 2500; // 2.5 seconds
        
        this.init();
    }
    
    init() {
        // Set initial active state
        this.updateActiveState();
        
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });
        
        // Touch events
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Start autoplay
        this.startAutoPlay();
        
        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize(), { passive: true });
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }
    
    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }
    
    handleResize() {
        // Force reflow and update positions
        this.track.style.transition = 'none';
        this.updateTrackPosition();
        this.track.offsetHeight; // Force reflow
        this.track.style.transition = '';
    }
    
    updateTrackPosition() {
        const itemWidth = this.items[0].offsetWidth + 32; // width + gap
        this.track.style.transform = `translateX(${-this.currentIndex * itemWidth}px)`;
    }
    
    updateActiveState() {
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('bg-gold', index === this.currentIndex);
            dot.classList.toggle('bg-gray-700', index !== this.currentIndex);
        });
        
        // Update items
        this.items.forEach((item, index) => {
            const img = item.querySelector('img');
            const overlay = item.querySelector('.client-overlay');
            
            if (index === this.currentIndex) {
                img.classList.remove('grayscale');
                if (overlay) overlay.classList.add('mobile-active');
                // Preload next image
                this.preloadAdjacentImages();
            } else {
                img.classList.add('grayscale');
                if (overlay) overlay.classList.remove('mobile-active');
            }
        });
    }
    
    preloadAdjacentImages() {
        const nextIndex = (this.currentIndex + 1) % this.items.length;
        const prevIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        
        [nextIndex, prevIndex].forEach(index => {
            const img = this.items[index].querySelector('img');
            if (img && !img.complete) {
                const src = img.getAttribute('src');
                if (src) new Image().src = src;
            }
        });
    }
    
    goTo(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.currentIndex = index;
        this.animateTransition();
    }
    
    next() {
        if (this.isAnimating) return;
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.animateTransition();
    }
    
    prev() {
        if (this.isAnimating) return;
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.animateTransition();
    }
    
    animateTransition() {
        this.isAnimating = true;
        this.updateActiveState();
        
        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
            this.track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            this.updateTrackPosition();
            
            // Reset animation state after transition
            this.track.addEventListener('transitionend', () => {
                this.isAnimating = false;
            }, { once: true });
        });
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.next(), this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector('.carousel-container').closest('.relative');
    if (carouselContainer) {
        new OptimizedCarousel(carouselContainer);
    }
});
