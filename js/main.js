document.addEventListener('DOMContentLoaded', () => {
    // Elementos
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // 1. Header com efeito de scroll aprimorado
    let lastScroll = 0;
    
    const handleScroll = () => {
        const currentScroll = window.scrollY;
        
        // Header scrolled effect
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Header hide/show on scroll down/up
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;

        // Botão voltar ao topo
        if (currentScroll > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        // Ativar links do menu baseado na seção visível
        highlightActiveSection();
    };

    window.addEventListener('scroll', handleScroll);

    // 2. Menu Mobile aprimorado
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Fechar menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // 3. Botão Voltar ao Topo
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. Scroll suave para links internos
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 5. Destacar seção ativa no menu
    const highlightActiveSection = () => {
        const scrollPosition = window.scrollY + header.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    // 6. Carrossel de Testemunhos aprimorado
    class TestimonialSlider {
        constructor() {
            this.slides = document.querySelectorAll('.testimonial-slide');
            this.prevBtn = document.querySelector('.prev-btn');
            this.nextBtn = document.querySelector('.next-btn');
            this.currentSlide = 0;
            this.autoPlayInterval = null;
            
            if (this.slides.length > 0) {
                this.init();
            }
        }

        init() {
            this.showSlide(this.currentSlide);
            
            if (this.prevBtn && this.nextBtn) {
                this.prevBtn.addEventListener('click', () => this.prevSlide());
                this.nextBtn.addEventListener('click', () => this.nextSlide());
            }

            // Touch events para mobile
            const slider = document.querySelector('.testimonial-slider');
            if (slider) {
                let touchStartX = 0;
                let touchEndX = 0;

                slider.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                }, { passive: true });

                slider.addEventListener('touchend', (e) => {
                    touchEndX = e.changedTouches[0].screenX;
                    if (touchStartX - touchEndX > 50) {
                        this.nextSlide();
                    } else if (touchEndX - touchStartX > 50) {
                        this.prevSlide();
                    }
                }, { passive: true });
            }

            this.startAutoPlay();
        }

        showSlide(index) {
            this.slides.forEach(slide => slide.classList.remove('active'));
            this.slides[index].classList.add('active');
        }

        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.slides.length;
            this.showSlide(this.currentSlide);
            this.resetAutoPlay();
        }

        prevSlide() {
            this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.showSlide(this.currentSlide);
            this.resetAutoPlay();
        }

        startAutoPlay() {
            this.autoPlayInterval = setInterval(() => this.nextSlide(), 7000);
        }

        resetAutoPlay() {
            clearInterval(this.autoPlayInterval);
            this.startAutoPlay();
        }
    }

    new TestimonialSlider();

    // 7. Formulário de Contato com feedback visual
    const contactForm = document.querySelector('.contact-form');
    const confirmationMessage = document.getElementById('form-confirmation');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            // Mostrar loading
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Animação de sucesso
                    contactForm.style.animation = 'fadeOut 0.5s ease';
                    setTimeout(() => {
                        contactForm.style.display = 'none';
                        if (confirmationMessage) {
                            confirmationMessage.style.display = 'block';
                            confirmationMessage.style.animation = 'scaleIn 0.5s ease';
                        }
                    }, 500);

                    // Scroll suave até a mensagem de confirmação
                    setTimeout(() => {
                        confirmationMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 600);
                } else {
                    throw new Error('Erro no envio');
                }
            } catch (error) {
                alert('Ocorreu um erro. Por favor, tente novamente.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // 8. Animações ao scroll (Intersection Observer)
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Se for um contador, iniciar animação
                    if (entry.target.classList.contains('counter')) {
                        startCounter(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(element => observer.observe(element));
    };

    animateOnScroll();

    // 9. Contadores animados
    const startCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target')) || 0;
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    };

    // 10. Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            // Animação de sucesso
            const btn = newsletterForm.querySelector('button');
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, var(--success-color), #27ae60)';
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
                btn.style.background = 'linear-gradient(135deg, var(--accent-color), var(--accent-light))';
            }, 2000);

            // Aqui você pode adicionar a lógica para salvar o email
            console.log('Newsletter signup:', email);
        });
    }

    // 11. Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // 12. Efeito parallax no hero
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        });
    }

    // 13. Loading do footer
    const loadFooter = async () => {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            try {
                const isServicePage = window.location.pathname.includes('/servicos/');
                const footerPath = isServicePage ? '../layout/footer.html' : 'layout/footer.html';
                
                const response = await fetch(footerPath);
                const data = await response.text();
                
                footerPlaceholder.innerHTML = data;
                
                // Adicionar classe animate-on-scroll aos elementos do footer
                footerPlaceholder.querySelectorAll('.footer-content > *').forEach((el, index) => {
                    el.classList.add('animate-on-scroll', `delay-${index + 1}`);
                });
            } catch (error) {
                console.error('Erro ao carregar footer:', error);
            }
        }
    };

    loadFooter();
});