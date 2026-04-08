/* ============================================
   RAKSHIT GOYAL — PORTFOLIO JS
   Particles · Stats Counter · Scroll Effects
   Lightbox · Back to Top · Enhanced Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === Cursor Glow ===
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.style.opacity = '1';
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // === Particle Canvas ===
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 230, 118, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 230, 118, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // === Navbar Scroll ===
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // === Active Nav Link ===
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink);

    // === Mobile Nav Toggle ===
    const navToggle = document.getElementById('navToggle');
    const navLinksEl = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksEl.classList.toggle('open');
    });

    // Close mobile nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksEl.classList.remove('open');
        });
    });

    // === Stat Counter Animation ===
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsCounted = false;

    function animateCounters() {
        if (statsCounted) return;
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            let current = 0;
            const increment = target / 40;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 40);
        });
        statsCounted = true;
    }

    // === Scroll Reveal ===
    const revealElements = document.querySelectorAll(
        '.skill-category, .project-card, .achievement-card, .cert-card, ' +
        '.about-text, .info-card, .gallery-item, .timeline-item, .goals-quote, ' +
        '.contact-card, .section-header, .edu-card, .hobby-card'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Check if it's in the hero/stats area
                if (entry.target.closest('.hero')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // Also observe the stats section itself
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(heroStats);
    }

    // === Stagger animation for grid items ===
    document.querySelectorAll(
        '.skills-grid, .projects-grid, .achievements-grid, .certs-grid, ' +
        '.gallery-grid, .contact-grid, .hobbies-grid, .education-timeline'
    ).forEach(grid => {
        const gridObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.querySelectorAll('.reveal');
                    children.forEach((child, index) => {
                        child.style.transitionDelay = `${index * 0.08}s`;
                        child.classList.add('visible');
                    });
                }
            });
        }, { threshold: 0.1 });
        gridObserver.observe(grid);
    });

    // === Smooth scroll for anchor links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // === Typing effect for hero subtitle ===
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        heroSubtitle.style.borderRight = '2px solid var(--accent)';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 60);
            } else {
                // Remove cursor after typing
                setTimeout(() => {
                    heroSubtitle.style.borderRight = 'none';
                }, 1500);
            }
        }
        // Start typing after initial animations
        setTimeout(typeWriter, 1200);
    }

    // === Image Lightbox ===
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    // All clickable gallery items (both gallery and education images)
    document.querySelectorAll('.galleryOpen').forEach(item => {
        item.addEventListener('click', () => {
            const src = item.dataset.src || item.querySelector('img')?.src;
            const caption = item.dataset.caption || '';
            
            if (src) {
                lightboxImg.src = src;
                lightboxCaption.textContent = caption;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImg.src = '';
        }, 400);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // === Back to Top Button ===
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === Parallax effect on hero background grid ===
    const heroGrid = document.querySelector('.hero-bg-grid');
    if (heroGrid) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            heroGrid.style.transform = `translateY(${scrolled * 0.3}px)`;
        });
    }

    // === Tilt effect on hover for project and edu cards ===
    document.querySelectorAll('.project-card, .edu-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

});
