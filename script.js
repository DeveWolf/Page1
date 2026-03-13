// ===============================================
// INICIALIZACIÓN
// ===============================================
document.addEventListener('DOMContentLoaded', function() {
    initAOS();
    initSwiper();
    initMobileMenu();
    initScrollEffects();
    initCounters();
    initForms();
    initInterviewFilters();
    initPhotoGallery();
});

// ===============================================
// AOS (Animate On Scroll)
// ===============================================
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, easing: 'ease-in-out', once: true, offset: 100 });
    }
}

// ===============================================
// SWIPER CAROUSEL
// ===============================================
function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    if (!document.querySelector('.heroSwiper')) return;

    const progressFill = document.querySelector('.slide-progress-fill');
    const delay = 5000;
    let startTime = null;
    let rafId = null;

    function animateProgress(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const pct = Math.min((elapsed / delay) * 100, 100);
        if (progressFill) progressFill.style.width = pct + '%';
        if (elapsed < delay) rafId = requestAnimationFrame(animateProgress);
    }

    function resetProgress() {
        cancelAnimationFrame(rafId);
        startTime = null;
        if (progressFill) progressFill.style.width = '0%';
        rafId = requestAnimationFrame(animateProgress);
    }

    new Swiper('.heroSwiper', {
        loop: true,
        autoplay: { delay: delay, disableOnInteraction: false },
        speed: 1000,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        on: {
            slideChangeTransitionStart: resetProgress,
            autoplayStart: resetProgress,
        }
    });

    resetProgress();
}

// ===============================================
// MENÚ MÓVIL
// ===============================================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mainNav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// ===============================================
// EFECTOS DE SCROLL
// ===============================================
function initScrollEffects() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    });
}

// ===============================================
// CONTADORES ANIMADOS
// ===============================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = new Set();

    function animateCounter(element) {
        if (animated.has(element)) return;
        animated.add(element);

        const target = parseInt(element.getAttribute('data-target'));
        if (!target) return;
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (target === 95 ? '%' : '+');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (target === 95 ? '%' : '+');
            }
        }, 16);
    }

    function checkCounters() {
        counters.forEach(counter => {
            const rect = counter.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100 && !animated.has(counter)) {
                animateCounter(counter);
            }
        });
    }

    window.addEventListener('load', checkCounters);
    window.addEventListener('scroll', checkCounters);
    checkCounters();
}

// ===============================================
// FORMULARIOS
// ===============================================
function initForms() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
}

function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#CC0000';
            setTimeout(() => { field.style.borderColor = ''; }, 3000);
        }
    });

    if (!isValid) { showNotification('Por favor, completa todos los campos obligatorios', 'error'); return; }

    const emailField = form.querySelector('#email');
    if (emailField && !isValidEmail(emailField.value)) {
        showNotification('Por favor, ingresa un email válido', 'error');
        return;
    }

    const submitBtn = form.querySelector('.btn-submit');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;

    setTimeout(() => {
        showNotification('¡Gracias! Nos pondremos en contacto contigo en menos de 24 horas.', 'success');
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        form.reset();
    }, 1500);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type) {
    document.querySelectorAll('.custom-notification').forEach(n => n.remove());
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `<div class="notification-content"><i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i><span>${message}</span></div>`;
    Object.assign(notification.style, {
        position: 'fixed', top: '20px', right: '20px',
        background: type === 'success' ? '#22c55e' : '#CC0000',
        color: 'white', padding: '20px 25px', borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: '10000',
        animation: 'slideInRight 0.3s ease', maxWidth: '400px'
    });
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ===============================================
// FILTROS DE ENTREVISTAS
// ===============================================
function initInterviewFilters() {
    document.querySelectorAll('.service-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const targetSection = document.querySelector('.interviews-section');
                if (targetSection) {
                    const header = document.getElementById('header');
                    const headerHeight = header ? header.offsetHeight : 90;
                    window.scrollTo({ top: targetSection.offsetTop - headerHeight - 20, behavior: 'smooth' });
                    highlightCategory(href.substring(1));
                }
            }
        });
    });
}

function highlightCategory(category) {
    const categoryMap = {
        'lideres': 'Líderes Empresariales', 'emprendedores': 'Emprendedores',
        'expertos': 'Expertos en Mercados', 'rrhh': 'Recursos Humanos',
        'casos-exito': 'Casos de Éxito', 'tendencias': 'Tendencias Globales'
    };
    const categoryName = categoryMap[category];
    if (!categoryName) return;
    document.querySelectorAll('.interview-card').forEach(card => {
        const cardCategory = card.querySelector('.interview-category');
        if (cardCategory && cardCategory.textContent.includes(categoryName)) {
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 20px 50px rgba(62,64,149,0.3)';
            card.style.borderColor = '#FFD700';
            setTimeout(() => {
                card.style.transform = '';
                card.style.boxShadow = '';
                card.style.borderColor = '';
            }, 2000);
        }
    });
}

// ===============================================
// GALERÍA DE FOTOS
// ===============================================
function initPhotoGallery() {
    document.querySelectorAll('.photo-item').forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) openLightbox(img.src, img.alt);
        });
    });
}

function openLightbox(imageSrc, imageAlt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img src="${imageSrc}" alt="${imageAlt}">
            <p class="lightbox-caption">${imageAlt}</p>
        </div>`;
    Object.assign(lightbox.style, {
        position: 'fixed', top: '0', left: '0',
        width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.95)', zIndex: '10000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.3s ease', cursor: 'pointer'
    });
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) closeLightbox(lightbox);
    });

    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') { closeLightbox(lightbox); document.removeEventListener('keydown', escHandler); }
    });
}

function closeLightbox(lightbox) {
    lightbox.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => { lightbox.remove(); document.body.style.overflow = ''; }, 300);
}

// ===============================================
// BOTÓN VER MÁS ENTREVISTAS
// ===============================================
const loadMoreBtn = document.querySelector('.load-more-section .btn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
        showNotification('Próximamente más entrevistas disponibles', 'success');
    });
}

// ===============================================
// ANIMACIONES CSS DINÁMICAS
// ===============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    .notification-content { display: flex; align-items: center; gap: 12px; }
    .lightbox-content { position: relative; max-width: 90%; max-height: 90vh; text-align: center; }
    .lightbox-content img { max-width: 100%; max-height: 85vh; object-fit: contain; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
    .lightbox-close { position: absolute; top: -50px; right: 0; background: rgba(255,255,255,0.2); color: white; border: none; font-size: 40px; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(10px); }
    .lightbox-close:hover { background: rgba(255,215,0,0.8); transform: rotate(90deg); }
    .lightbox-caption { color: white; margin-top: 20px; font-size: 18px; font-weight: 600; }
`;
document.head.appendChild(style);

// ===============================================
// SMOOTH SCROLL
// ===============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const header = document.getElementById('header');
            const headerHeight = header ? header.offsetHeight : 90;
            window.scrollTo({ top: target.offsetTop - headerHeight - 20, behavior: 'smooth' });
        }
    });
});

console.log('%c🚀 OEA News Madrid', 'color: #3E4095; font-size: 24px; font-weight: bold;');
console.log('%c✨ Sitio web by OEA', 'color: #FFD700; font-size: 14px;');

// ===============================================
// POPUP DE NOTICIAS — aparece en cada carga
// ===============================================
function initNewsPopup() {
    var popup    = document.getElementById('newsPopup');
    var overlay  = document.getElementById('newsOverlay');
    var closeBtn = document.getElementById('newsPopupClose');

    if (!popup || !overlay || !closeBtn) return;

    function openPopup() {
        popup.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePopup() {
        popup.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closePopup(); });

    setTimeout(openPopup, 1500);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewsPopup);
} else {
    initNewsPopup();
}