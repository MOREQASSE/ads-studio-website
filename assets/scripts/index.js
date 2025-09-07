// Loader
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
});

// Vanta.js Net Background
if (document.getElementById('vanta')) {
    const isMobile = window.innerWidth <= 768; // Check if mobile device
    
    const vantaEffect = VANTA.NET({
        el: "#vanta",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: isMobile ? 100.00 : 200.00,
        minWidth: isMobile ? 100.00 : 200.00,
        scale: isMobile ? 0.8 : 1.00,
        scaleMobile: isMobile ? 0.8 : 1.00,
        color: 0xd4af37,
        backgroundColor: 0x0,
        points: isMobile ? 8.00 : 12.00,
        maxDistance: isMobile ? 20.00 : 25.00,
        spacing: isMobile ? 15.00 : 18.00,
        color2: 0x00b4d8,
        backgroundColor: 0x0a0a0a
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const newIsMobile = window.innerWidth <= 768;
            if (vantaEffect) {
                vantaEffect.setOptions({
                    minHeight: newIsMobile ? 100.00 : 200.00,
                    minWidth: newIsMobile ? 100.00 : 200.00,
                    scale: newIsMobile ? 0.8 : 1.00,
                    scaleMobile: newIsMobile ? 0.8 : 1.00,
                    points: newIsMobile ? 8.00 : 12.00,
                    maxDistance: newIsMobile ? 20.00 : 25.00,
                    spacing: newIsMobile ? 15.00 : 18.00
                });
            }
        }, 250);
    });
}

// Comparison Table Interaction
document.addEventListener('DOMContentLoaded', function() {
    // Feature Rows Click Handler
    const featureRows = document.querySelectorAll('.feature-row');
    const featureDescription = document.getElementById('feature-description');
    
    featureRows.forEach(row => {
        row.addEventListener('click', function() {
            // Remove active class from all rows
            featureRows.forEach(r => r.classList.remove('active'));
            
            // Add active class to clicked row
            this.classList.add('active');
            
            // Update description
            const description = this.getAttribute('data-desc');
            featureDescription.innerHTML = `<p class="text-center">${description}</p>`;
            
            // Add animation class
            featureDescription.style.animation = 'none';
            void featureDescription.offsetWidth; // Trigger reflow
            featureDescription.style.animation = 'fadeIn 0.3s ease-out';
        });
    });
    
    // Animated Counter
    function animateCounter() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // The lower the faster
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounter, 1);
            } else {
                counter.innerText = target;
            }
        });
    }
    
    // Initialize counter when scrolled to section
    const statSection = document.querySelector('.stat-card');
    if (statSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statSection);
    }
});

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 800,
        easing: 'ease-in-out-cubic',
        once: true,
        mirror: false
    });

    // Add smooth scroll to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize tooltips for expertise cards
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    tooltipTriggers.forEach(trigger => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = trigger.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);

        const updateTooltip = (e) => {
            const rect = trigger.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2)}px`;
            tooltip.style.top = `${rect.top + window.scrollY - 40}px`;
            tooltip.style.transform = 'translateX(-50%)';
        };

        trigger.addEventListener('mouseenter', () => {
            tooltip.classList.add('active');
            updateTooltip();
        });

        trigger.addEventListener('mouseleave', () => {
            tooltip.classList.remove('active');
        });

        trigger.addEventListener('mousemove', updateTooltip);
    });

    // Add parallax effect to expertise section
    const expertiseSection = document.querySelector('.expertise-section');
    if (expertiseSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const expertiseOffset = expertiseSection.offsetTop;
            const expertiseHeight = expertiseSection.offsetHeight;
            
            if (scrollPosition > expertiseOffset - window.innerHeight && 
                scrollPosition < expertiseOffset + expertiseHeight) {
                const yPos = (scrollPosition - expertiseOffset) * 0.1;
                expertiseSection.style.backgroundPositionY = `${yPos}px`;
            }
        });
    }

    // Add click effect to flip expertise cards
    const expertiseCards = document.querySelectorAll('.expertise-card');
    expertiseCards.forEach(card => {
        const inner = card.querySelector('.expertise-card-inner');
        
        // Add click event listener to flip the card
        card.addEventListener('click', (e) => {
            // Don't flip if clicking on a link or button inside the card
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a, button')) {
                return;
            }
            
            // Toggle the 'flipped' class on the inner element
            inner.classList.toggle('flipped');
        });
    });

    // Close all cards when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.expertise-card')) {
            document.querySelectorAll('.expertise-card-inner.flipped').forEach(flippedCard => {
                flippedCard.classList.remove('flipped');
            });
        }
    });

    // Add scroll-triggered animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.expertise-card, .cta-card');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('aos-animate');
            }
        });
    };

    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
    
    // Initial check in case elements are already in view
    animateOnScroll();
});

// Orbiting Features Animation Pause
const orbitContainer = document.querySelector('.orbit-container');
if (orbitContainer) {
    const orbitItems = orbitContainer.querySelectorAll('.orbit-item');
    orbitContainer.addEventListener('mouseenter', () => {
        orbitItems.forEach(item => {
            item.style.animationPlayState = 'paused';
        });
    });
    orbitContainer.addEventListener('mouseleave', () => {
        orbitItems.forEach(item => {
            item.style.animationPlayState = 'running';
        });
    });
}