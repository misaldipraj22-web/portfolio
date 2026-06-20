/* ==========================================================================
   PARTICLE BACKGROUND SIMULATION
   ========================================================================== */
class ParticleBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 100 };
        this.numberOfParticles = 60;
        this.maxDistance = 100;
        this.colors = ['#6366f1', '#14b8a6']; // Indigo, Teal

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.numberOfParticles; i++) {
            const size = Math.random() * 2 + 1;
            const x = Math.random() * (this.canvas.width - size * 2) + size;
            const y = Math.random() * (this.canvas.height - size * 2) + size;
            const speedX = (Math.random() * 0.4) - 0.2;
            const speedY = (Math.random() * 0.4) - 0.2;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];

            this.particles.push({ x, y, speedX, speedY, size, color });
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.speedX;
            p.y += p.speedY;

            // Bounce on boundaries
            if (p.x > this.canvas.width || p.x < 0) p.speedX = -p.speedX;
            if (p.y > this.canvas.height || p.y < 0) p.speedY = -p.speedY;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();

            // Connect nearby particles
            for (let j = i; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.hypot(dx, dy);

                if (distance < this.maxDistance) {
                    const opacity = (1 - (distance / this.maxDistance)) * 0.12;
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }

            // Interactive mouse links
            if (this.mouse.x != null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const distance = Math.hypot(dx, dy);

                if (distance < this.mouse.radius) {
                    const opacity = (1 - (distance / this.mouse.radius)) * 0.18;
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

/* ==========================================================================
   TYPING TEXT ANIMATION
   ========================================================================== */
class TextTyper {
    constructor(elementId, words, period = 2000) {
        this.el = document.getElementById(elementId);
        this.words = words;
        this.period = period;
        this.loopNum = 0;
        this.txt = '';
        this.isDeleting = false;
        this.tick();
    }

    tick() {
        const i = this.loopNum % this.words.length;
        const fullTxt = this.words[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = this.txt;

        let delta = 200 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(() => this.tick(), delta);
    }
}

/* ==========================================================================
   DOM MANIPULATION & INTERACTIVITY
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Particle Background
    new ParticleBackground('particle-canvas');

    // 2. Initialize Hero Text Typing
    new TextTyper('typing-text', [
        'immersive user interfaces.',
        'responsive web layouts.',
        'high-performance web apps.',
        'elegant user experiences.'
    ], 2000);

    // 3. Header Scroll Effect
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Mobile Menu Drawer Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close menu on clicking nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    // 5. ScrollSpy - Active Nav Link Highlighting
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // 6. Skills Progress Animation on Scroll Trigger
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.progress-bar-fill');
    
    const animateSkills = () => {
        if (!skillsSection) return;
        const rect = skillsSection.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight - 100 && rect.bottom >= 100;
        
        if (isInViewport) {
            progressBars.forEach(bar => {
                const targetWidth = bar.style.width;
                // Temporarily clear and set to animate
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 100);
            });
            // Remove listener so it only animates once
            window.removeEventListener('scroll', animateSkills);
        }
    };
    window.addEventListener('scroll', animateSkills);
    animateSkills(); // check on load

    // 7. Projects Interactive Grid Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    // Trigger fade-in transition
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    // Delay display:none to let transition complete
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 8. Contact Form Live Validation and Submission
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const successUserName = document.getElementById('success-user-name');
    const btnSuccessReset = document.getElementById('btn-success-reset');

    const fields = [
        { id: 'form-name', errorId: 'error-name', validator: val => val.trim().length > 0 },
        { id: 'form-email', errorId: 'error-email', validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) },
        { id: 'form-subject', errorId: 'error-subject', validator: val => val.trim().length > 0 },
        { id: 'form-message', errorId: 'error-message', validator: val => val.trim().length > 10 }
    ];

    // Live validation listener on blur
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            input.addEventListener('blur', () => {
                const isValid = field.validator(input.value);
                if (isValid) {
                    input.classList.remove('invalid');
                } else {
                    input.classList.add('invalid');
                }
            });
            input.addEventListener('input', () => {
                if (field.validator(input.value)) {
                    input.classList.remove('invalid');
                }
            });
        }
    });

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            // Run validation on all fields
            fields.forEach(field => {
                const input = document.getElementById(field.id);
                const isValid = field.validator(input ? input.value : '');
                if (!isValid) {
                    input.classList.add('invalid');
                    isFormValid = false;
                } else {
                    input.classList.remove('invalid');
                }
            });

            if (isFormValid) {
                const nameInput = document.getElementById('form-name');
                const userName = nameInput ? nameInput.value.split(' ')[0] : 'there';
                
                // Show Success Pane
                contactForm.style.display = 'none';
                formSuccess.style.display = 'flex';
                if (successUserName) {
                    successUserName.textContent = userName;
                }
            }
        });

        // Reset contact form handler
        if (btnSuccessReset) {
            btnSuccessReset.addEventListener('click', () => {
                contactForm.reset();
                formSuccess.style.display = 'none';
                contactForm.style.display = 'block';
                // Remove validation helper classes
                fields.forEach(field => {
                    const input = document.getElementById(field.id);
                    if (input) input.classList.remove('invalid');
                });
            });
        }
    }
});
