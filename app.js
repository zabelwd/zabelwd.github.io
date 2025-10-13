// Navigation functionality
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupResumeActions();
        this.setupContactForm();
        this.addScrollAnimations();
    }

    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Handle scroll effects on navbar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Update active nav link based on scroll position
        window.addEventListener('scroll', () => {
            let current = '';
            const sections = document.querySelectorAll('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }

    setupScrollEffects() {
        // Add intersection observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.timeline-item, .competency-item, .card, .experience-card'
        );
        
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for navbar height
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupResumeActions() {
        const downloadBtn = document.getElementById('downloadBtn');
        const printBtn = document.getElementById('printBtn');

        downloadBtn.addEventListener('click', () => {
            this.downloadResume();
        });

        printBtn.addEventListener('click', () => {
            this.printResume();
        });
    }

    downloadResume() {
        // Simulate resume download
        const notification = this.createNotification(
            'Resume download started!', 
            'Your resume will be available shortly.', 
            'success'
        );
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);

        // In a real application, you would trigger an actual file download here
        // For demonstration, we'll show the download process
        setTimeout(() => {
            const successNotification = this.createNotification(
                'Download Complete!', 
                'Dennis_Zabel_Resume.pdf has been saved to your downloads folder.', 
                'info'
            );
            document.body.appendChild(successNotification);
            
            setTimeout(() => {
                successNotification.remove();
            }, 4000);
        }, 1500);
    }

    printResume() {
        // Focus on the resume section for printing
        const resumeSection = document.getElementById('resume');
        
        // Create print-specific styling
        const printStyles = document.createElement('style');
        printStyles.textContent = `
            @media print {
                body * {
                    visibility: hidden;
                }
                #resume, #resume * {
                    visibility: visible;
                }
                #resume {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
                .resume-actions {
                    display: none !important;
                }
            }
        `;
        
        document.head.appendChild(printStyles);
        
        // Trigger print dialog
        window.print();
        
        // Remove print styles after printing
        setTimeout(() => {
            document.head.removeChild(printStyles);
        }, 1000);
    }

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmission(contactForm);
        });
    }

    handleContactSubmission(form) {
        // Get form data
        const formData = new FormData(form);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            company: formData.get('company'),
            message: formData.get('message')
        };

        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Reset form and button
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Show success notification
            const notification = this.createNotification(
                'Message Sent Successfully!',
                `Thank you ${data.firstName}! Your message has been sent to Dennis. He will get back to you soon.`,
                'success'
            );
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 5000);
        }, 2000);
    }

    createNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        const typeIcons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notification.innerHTML = `
            <div class="notification__content">
                <div class="notification__icon">${typeIcons[type]}</div>
                <div class="notification__text">
                    <div class="notification__title">${title}</div>
                    <div class="notification__message">${message}</div>
                </div>
                <button class="notification__close" onclick="this.parentElement.parentElement.remove()">
                    ×
                </button>
            </div>
        `;

        // Add notification styles
        this.addNotificationStyles();
        
        return notification;
    }

    addNotificationStyles() {
        if (document.getElementById('notification-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                background: var(--color-surface);
                border: 1px solid var(--color-card-border);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-lg);
                animation: slideInRight 0.3s ease-out;
            }

            .notification__content {
                display: flex;
                align-items: flex-start;
                gap: var(--space-12);
                padding: var(--space-16);
            }

            .notification__icon {
                font-size: 20px;
                flex-shrink: 0;
                margin-top: 2px;
            }

            .notification__text {
                flex: 1;
            }

            .notification__title {
                font-weight: var(--font-weight-semibold);
                color: var(--color-text);
                margin-bottom: var(--space-4);
            }

            .notification__message {
                font-size: var(--font-size-sm);
                color: var(--color-text-secondary);
                line-height: 1.4;
            }

            .notification__close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: var(--color-text-secondary);
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all var(--duration-fast) var(--ease-standard);
            }

            .notification__close:hover {
                background: var(--color-secondary);
                color: var(--color-text);
            }

            .notification--success {
                border-left: 4px solid var(--color-success);
            }

            .notification--error {
                border-left: 4px solid var(--color-error);
            }

            .notification--warning {
                border-left: 4px solid var(--color-warning);
            }

            .notification--info {
                border-left: 4px solid var(--color-info);
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @media (max-width: 480px) {
                .notification {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    addScrollAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            .timeline-item,
            .competency-item,
            .experience-card {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease-out;
            }

            .timeline-item.animate-in,
            .competency-item.animate-in,
            .experience-card.animate-in {
                opacity: 1;
                transform: translateY(0);
            }

            .timeline-item:nth-child(even).animate-in {
                animation: slideInFromRight 0.6s ease-out;
            }

            .timeline-item:nth-child(odd).animate-in {
                animation: slideInFromLeft 0.6s ease-out;
            }

            @keyframes slideInFromLeft {
                from {
                    opacity: 0;
                    transform: translateX(-50px) translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0) translateY(0);
                }
            }

            @keyframes slideInFromRight {
                from {
                    opacity: 0;
                    transform: translateX(50px) translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0) translateY(0);
                }
            }

            .competency-item:hover {
                transform: translateY(-4px) scale(1.02);
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Initialize the portfolio app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Add some utility functions for enhanced user experience
class PortfolioUtils {
    static formatPhoneNumber(phone) {
        // Format phone number for display
        return phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, PortfolioUtils };
}