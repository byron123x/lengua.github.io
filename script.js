// Immediately Invoked Function Expression to avoid global scope pollution
(function() {
    'use strict';

    // DOM Elements
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxClose = document.querySelector('.lightbox-close');
    const reflectionForm = document.getElementById('reflection-form');
    const reflectionInput = document.getElementById('reflection-input');
    const memoryWall = document.getElementById('memory-wall');

    // Initialize all functionality when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initSmoothScrolling();
        initGalleryLightbox();
        initReflectionForm();
        loadStoredReflections();
        initScrollAnimations();
    });

    // Navigation functionality
    function initNavigation() {
        try {
            if (navToggle && navMenu) {
                navToggle.addEventListener('click', function() {
                    navMenu.classList.toggle('active');
                    
                    // Animate hamburger menu
                    const spans = navToggle.querySelectorAll('span');
                    spans.forEach((span, index) => {
                        if (navMenu.classList.contains('active')) {
                            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                            if (index === 1) span.style.opacity = '0';
                            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                        } else {
                            span.style.transform = 'none';
                            span.style.opacity = '1';
                        }
                    });
                });

                // Close mobile menu when clicking on a link
                navLinks.forEach(link => {
                    link.addEventListener('click', function() {
                        navMenu.classList.remove('active');
                        const spans = navToggle.querySelectorAll('span');
                        spans.forEach(span => {
                            span.style.transform = 'none';
                            span.style.opacity = '1';
                        });
                    });
                });
            }
        } catch (error) {
            console.error('Error initializing navigation:', error);
        }
    }

    // Smooth scrolling for navigation links
    function initSmoothScrolling() {
        try {
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = targetSection.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        } catch (error) {
            console.error('Error initializing smooth scrolling:', error);
        }
    }

    // Gallery lightbox functionality
    function initGalleryLightbox() {
        try {
            if (!lightboxModal || !lightboxImage) return;

            galleryItems.forEach(item => {
                item.addEventListener('click', function() {
                    const img = this.querySelector('img');
                    const overlay = this.querySelector('.gallery-overlay');
                    
                    if (img && overlay) {
                        const title = overlay.querySelector('h4').textContent;
                        const description = overlay.querySelector('p').textContent;
                        
                        lightboxImage.src = img.src;
                        lightboxImage.alt = img.alt;
                        lightboxTitle.textContent = title;
                        lightboxDescription.textContent = description;
                        
                        lightboxModal.style.display = 'flex';
                        document.body.style.overflow = 'hidden';
                        
                        // Fade in animation
                        setTimeout(() => {
                            lightboxModal.style.opacity = '1';
                        }, 10);
                    }
                });
            });

            // Close lightbox functionality
            function closeLightbox() {
                lightboxModal.style.opacity = '0';
                setTimeout(() => {
                    lightboxModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 300);
            }

            if (lightboxClose) {
                lightboxClose.addEventListener('click', closeLightbox);
            }

            // Close on background click
            lightboxModal.addEventListener('click', function(e) {
                if (e.target === lightboxModal) {
                    closeLightbox();
                }
            });

            // Close on Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && lightboxModal.style.display === 'flex') {
                    closeLightbox();
                }
            });

        } catch (error) {
            console.error('Error initializing gallery lightbox:', error);
        }
    }

    // Reflection form functionality
    function initReflectionForm() {
        try {
            if (!reflectionForm || !reflectionInput || !memoryWall) return;

            reflectionForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const reflection = reflectionInput.value.trim();
                
                if (reflection === '') {
                    showMessage('Por favor, escribe tu reflexión antes de enviar.', 'error');
                    return;
                }

                if (reflection.length < 10) {
                    showMessage('Tu reflexión debe tener al menos 10 caracteres.', 'error');
                    return;
                }

                // Add reflection to memory wall
                addReflectionToWall(reflection);
                
                // Save to localStorage
                saveReflectionToStorage(reflection);
                
                // Clear form
                reflectionInput.value = '';
                
                // Show success message
                showMessage('¡Tu reflexión ha sido agregada al muro de memoria!', 'success');
            });

        } catch (error) {
            console.error('Error initializing reflection form:', error);
        }
    }

    // Add reflection to memory wall
    function addReflectionToWall(reflection) {
        try {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'memory-message';
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(20px)';
            
            const currentDate = new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            messageDiv.innerHTML = `
                <p>"${reflection}"</p>
                <span class="message-author">- Visitante anónimo, ${currentDate}</span>
            `;
            
            memoryWall.insertBefore(messageDiv, memoryWall.firstChild);
            
            // Animate in
            setTimeout(() => {
                messageDiv.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                messageDiv.style.opacity = '1';
                messageDiv.style.transform = 'translateY(0)';
            }, 100);
            
        } catch (error) {
            console.error('Error adding reflection to wall:', error);
        }
    }

    // Save reflection to localStorage
    function saveReflectionToStorage(reflection) {
        try {
            let reflections = JSON.parse(localStorage.getItem('memoryWallReflections') || '[]');
            
            const newReflection = {
                text: reflection,
                date: new Date().toISOString(),
                id: Date.now()
            };
            
            reflections.unshift(newReflection);
            
            // Keep only the last 50 reflections
            if (reflections.length > 50) {
                reflections = reflections.slice(0, 50);
            }
            
            localStorage.setItem('memoryWallReflections', JSON.stringify(reflections));
            
        } catch (error) {
            console.error('Error saving reflection to storage:', error);
        }
    }

    // Load stored reflections from localStorage
    function loadStoredReflections() {
        try {
            const reflections = JSON.parse(localStorage.getItem('memoryWallReflections') || '[]');
            
            reflections.forEach((reflection, index) => {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'memory-message';
                
                const date = new Date(reflection.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                messageDiv.innerHTML = `
                    <p>"${reflection.text}"</p>
                    <span class="message-author">- Visitante anónimo, ${date}</span>
                `;
                
                memoryWall.appendChild(messageDiv);
            });
            
        } catch (error) {
            console.error('Error loading stored reflections:', error);
        }
    }

    // Show success/error messages
    function showMessage(text, type) {
        try {
            // Remove existing messages
            const existingMessage = document.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `form-message ${type}`;
            messageDiv.textContent = text;
            
            // Style the message
            messageDiv.style.cssText = `
                padding: 1rem;
                margin: 1rem 0;
                border-radius: 8px;
                font-weight: 500;
                text-align: center;
                transition: opacity 0.3s ease;
                ${type === 'success' ? 
                    'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
                    'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
                }
            `;
            
            reflectionForm.appendChild(messageDiv);
            
            // Remove message after 5 seconds
            setTimeout(() => {
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }, 5000);
            
        } catch (error) {
            console.error('Error showing message:', error);
        }
    }

    // Initialize scroll animations
    function initScrollAnimations() {
        try {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observe elements for scroll animations
            const animatedElements = document.querySelectorAll('.welcome-card, .timeline-item, .gallery-item, .question-card');
            
            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });

        } catch (error) {
            console.error('Error initializing scroll animations:', error);
        }
    }

    // Header scroll effect
    window.addEventListener('scroll', function() {
        try {
            const header = document.querySelector('.header');
            if (header) {
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(255, 255, 255, 0.98)';
                    header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                }
            }
        } catch (error) {
            console.error('Error in scroll handler:', error);
        }
    });

    // Handle form validation in real-time
    if (reflectionInput) {
        reflectionInput.addEventListener('input', function() {
            const value = this.value.trim();
            const submitBtn = document.querySelector('.submit-btn');
            
            if (submitBtn) {
                if (value.length >= 10) {
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                    submitBtn.disabled = false;
                } else {
                    submitBtn.style.opacity = '0.6';
                    submitBtn.style.cursor = 'not-allowed';
                    submitBtn.disabled = true;
                }
            }
        });
    }

    // Error handling for images
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            console.warn('Image failed to load:', e.target.src);
            e.target.style.display = 'none';
        }
    }, true);

})();
