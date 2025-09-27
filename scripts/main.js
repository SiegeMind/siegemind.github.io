
// Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        function toggleMenu(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Nav toggle activated!'); // Debug log
            navMenu.classList.toggle('active');
        }

        navToggle.addEventListener('click', toggleMenu);
        navToggle.addEventListener('touchend', toggleMenu);

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu after click
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Enhanced scroll animations with different effects
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Different animation types based on element
                if (entry.target.classList.contains('step-card')) {
                    entry.target.classList.add('fade-in-up');
                } else if (entry.target.classList.contains('testimonial-card')) {
                    entry.target.classList.add('fade-in-left');
                } else if (entry.target.classList.contains('roadmap-card')) {
                    entry.target.classList.add('fade-in-right');
                } else if (entry.target.classList.contains('stat-card')) {
                    entry.target.classList.add('fade-in-up');
                } else {
                    entry.target.classList.add('fade-in');
                }

                // Add floating animation to step icons after fade in
                setTimeout(() => {
                    if (entry.target.classList.contains('step-card')) {
                        const icon = entry.target.querySelector('.step-icon');
                        if (icon) {
                            icon.classList.add('float');
                        }
                    }
                }, 800);
            }
        });
    }, observerOptions);

    // Observe all cards and major elements
    const elementsToObserve = document.querySelectorAll(
        '.stat-card, .step-card, .testimonial-card, .roadmap-card, .section-header'
    );

    elementsToObserve.forEach(el => {
        observer.observe(el);
    });

    // Enhanced navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.scrollY;

        if (scrolled > 100) {
            navbar.style.background = 'rgba(8, 27, 79, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(8, 27, 79, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.classList.add('fade-in-up');
        }, 300);
    }

    // Add entrance animation to hero elements with stagger
    const heroElements = [
        '.hero-subtitle',
        '.hero-buttons',
        '.hero-features',
        '.hero-stats'
    ];

    heroElements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            setTimeout(() => {
                element.style.transition = 'all 0.8s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 500 + (index * 200));
        }
    });

    // Add pulse effect to CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.classList.add('pulse');
        });

        btn.addEventListener('mouseleave', function() {
            this.classList.remove('pulse');
        });
    });

    // Add number counting animation to stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const countUpObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = target.textContent.replace(/,/g, '');
                const duration = 2000; // 2 seconds

                if (!isNaN(finalNumber)) {
                    animateNumber(target, 0, parseInt(finalNumber), duration);
                }

                countUpObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        countUpObserver.observe(stat);
    });

    // Number animation function
    function animateNumber(element, start, end, duration) {
        const startTime = performance.now();

        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = end.toLocaleString();
            }
        }

        requestAnimationFrame(updateNumber);
    }

    // Add parallax effect to background elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::before');

        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Add interactive hover effects to testimonial avatars
    const testimonialAvatars = document.querySelectorAll('.testimonial-avatar');
    testimonialAvatars.forEach(avatar => {
        avatar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            this.style.boxShadow = '0 0 20px rgba(253, 205, 9, 0.5)';
        });

        avatar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = 'none';
        });
    });

    // Add loading animation for the page
    document.body.style.opacity = '0';
    window.addEventListener('load', function() {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    });

    // Add click effect to cards
    const cards = document.querySelectorAll('.card, .step-card, .testimonial-card, .roadmap-card, .stat-card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(253, 205, 9, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 1;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .testimonial-avatar {
            transition: all 0.3s ease;
        }

        .step-icon i {
            transition: all 0.3s ease;
        }

        .feature-item {
            transition: all 0.3s ease;
        }

        .feature-item:hover {
            transform: translateY(-2px);
        }

        .roadmap-status {
            animation: pulse 2s infinite;
        }

        .roadmap-card.current .roadmap-status {
            animation: pulse 1.5s infinite;
            box-shadow: 0 0 15px rgba(253, 205, 9, 0.5);
        }

        .window-controls span:nth-child(1) {
            animation: pulse 2s infinite;
            animation-delay: 0s;
        }

        .window-controls span:nth-child(2) {
            animation: pulse 2s infinite;
            animation-delay: 0.3s;
        }

        .window-controls span:nth-child(3) {
            animation: pulse 2s infinite;
            animation-delay: 0.6s;
        }

        .preview-stat {
            transition: all 0.3s ease;
        }

        .preview-stat:hover {
            background: rgba(253, 205, 9, 0.1);
            transform: translateX(5px);
        }
    `;
    document.head.appendChild(style);

    // Add smooth reveal animation to sections
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.8s ease-out';
        sectionObserver.observe(section);
    });

    // Initialize hero section as visible
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.opacity = '1';
        heroSection.style.transform = 'translateY(0)';
    }
});