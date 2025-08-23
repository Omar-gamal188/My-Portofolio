// Portfolio JavaScript Functions - Optimized for Production

// Error handling wrapper
function safeExecute(callback, functionName) {
    try {
        callback();
    } catch (error) {
        console.error(`Error in ${functionName}:`, error);
    }
}

// Main initialization with error handling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions with error handling
    safeExecute(initSmoothScroll, 'initSmoothScroll');
    safeExecute(initNavbarScroll, 'initNavbarScroll');
    safeExecute(initMobileMenu, 'initMobileMenu');
    safeExecute(initAnimations, 'initAnimations');
    safeExecute(initTypingEffect, 'initTypingEffect');
    
    // Additional production optimizations
    safeExecute(initPerformanceOptimizations, 'initPerformanceOptimizations');
});

// Smooth scrolling for navigation links with error handling
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    if (!anchors.length) return;
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const menuBtn = document.querySelector('.mobile-menu-btn i');
                    if (menuBtn) {
                        menuBtn.classList.replace('fa-times', 'fa-bars');
                    }
                }
            }
        });
    });
}

// Navbar scroll effects with debouncing
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    const debouncedScrollHandler = debounce(function() {
        const scrolled = window.scrollY > 100;
        
        if (scrolled) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 30px rgba(0,0,0,0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        }
        
        // Update active nav link
        updateActiveNavLink();
    }, 10);
    
    window.addEventListener('scroll', debouncedScrollHandler);
}

// Mobile menu functionality with improved accessibility
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuBtn || !navLinks) return;
    
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = navLinks.classList.toggle('active');
        const icon = this.querySelector('i');
        
        // Update ARIA attributes for accessibility
        this.setAttribute('aria-expanded', isExpanded);
        
        if (isExpanded) {
            icon.classList.replace('fa-bars', 'fa-times');
            navLinks.style.display = 'flex';
            navLinks.setAttribute('aria-hidden', 'false');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
            navLinks.style.display = 'none';
            navLinks.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Close mobile menu when clicking outside or on links
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar') || e.target.closest('.nav-links a')) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.replace('fa-times', 'fa-bars');
            }
            navLinks.style.display = 'none';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            navLinks.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.replace('fa-times', 'fa-bars');
            }
            navLinks.style.display = 'none';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            navLinks.setAttribute('aria-hidden', 'true');
            mobileMenuBtn.focus();
        }
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Initialize scroll animations with Intersection Observer
function initAnimations() {
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers without Intersection Observer
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.opacity = '1';
        });
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, observerOptions);
    
    // Observe all sections for animation
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        observer.observe(section);
    });
    
    // Animate skill bars
    animateSkillBars();
    
    // Animate counters
    animateCounters();
}

// Animate skill progress bars
function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-list li');
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateX(0)';
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.5 });
    
    skillItems.forEach((item, index) => {
        item.style.transform = 'translateX(-20px)';
        item.style.opacity = '0';
        item.style.transition = `all 0.5s ease ${index * 0.1}s`;
        skillObserver.observe(item);
    });
}

// Animate counter numbers
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Counter animation function
function animateCounter(element) {
    const target = parseInt(element.textContent);
    const increment = target / 50;
    let current = 0;
    
    const updateCounter = () => {
        if (current < target) {
            current += increment;
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = element.textContent;
        }
    };
    
    updateCounter();
}

// Typing effect for hero section
function initTypingEffect() {
    const subtitle = document.querySelector('.hero .subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Project card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Form validation and submission (if contact form is added later)
function initContactForm() {
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Message sent successfully!', 'success');
            this.reset();
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        default:
            notification.style.background = '#667eea';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Lazy loading for images (if images are added later)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Theme toggle (dark/light mode)
function initThemeToggle() {
    const themeToggle = document.querySelector('#theme-toggle');
    
    if (themeToggle) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.classList.add(savedTheme);
        }
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            // Save preference
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark-theme');
            } else {
                localStorage.removeItem('theme');
            }
        });
    }
}

// Parallax scrolling effect
function initParallax() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initNavbarScroll();
    initMobileMenu();
    initAnimations();
    initTypingEffect();
    initContactForm();
    initLazyLoading();
    initThemeToggle();
    initParallax();
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Performance optimization: Debounce function
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const context = this;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Additional performance optimizations
function initPerformanceOptimizations() {
    // Preload critical resources
    const preloadLinks = [
        './css/style.css',
        './js/script.js'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = href.endsWith('.css') ? 'style' : 'script';
        document.head.appendChild(link);
    });
    
    // Add loading="lazy" to future images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
    });
}
