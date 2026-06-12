// ==================== MOBILE MENU ====================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ==================== MODAL ====================
const modal = document.getElementById('reservaModal');
const closeBtn = document.querySelector('.close');

// Cerrar modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// ==================== FORMULARIO DE RESERVA ====================
const reservaForm = document.getElementById('reservaForm');

reservaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const servicio = document.getElementById('servicio').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const comentarios = document.getElementById('comentarios').value;

    // Formatear fecha
    const fechaObj = new Date(fecha);
    const fechaFormato = fechaObj.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Crear mensaje para WhatsApp
    let mensaje = `Hola, soy ${nombre}.\n\n`;
    mensaje += `Me gustaría reservar una cita en Barbería Ecológica GAJAH KLUB.\n\n`;
    mensaje += `Servicio: ${servicio}\n`;
    mensaje += `Fecha: ${fechaFormato}\n`;
    mensaje += `Hora: ${hora}\n`;
    if (comentarios) {
        mensaje += `\nComentarios: ${comentarios}\n`;
    }
    mensaje += `\nMuchas gracias.`;

    // Codificar mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    const numeroWhatsApp = '34687211505';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;

    // Abrir WhatsApp
    window.open(urlWhatsApp, '_blank');

    // Cerrar modal
    modal.style.display = 'none';

    // Resetear formulario
    reservaForm.reset();
});

// ==================== FORMULARIO DE CONTACTO ====================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simular envío de formulario
    alert('Gracias por tu mensaje. Nos pondremos en contacto pronto.');
    contactForm.reset();
});

// ==================== ANIMACIONES AL SCROLL ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos animados
document.querySelectorAll('.service-card, .pricing-card, .why-card, .review-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==================== SCROLL SUAVE Y NAVBAR ====================
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Efecto de shadow en navbar
    if (scrollTop > 0) {
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ==================== VALIDACIÓN DE FECHA ====================
const inputFecha = document.getElementById('fecha');

// Establecer fecha mínima (hoy)
const hoy = new Date();
const fechaMinima = hoy.toISOString().split('T')[0];
inputFecha.setAttribute('min', fechaMinima);

// ==================== NÚMEROS CONTADOR ====================
const stats = [
    { element: null, final: 99, text: 'Reseñas' },
    { element: null, final: 4.8, text: 'Valoración' }
];

// Encontrar elementos y animar
function animarNumeros() {
    const reviewHeader = document.querySelector('.reviews .section-header p');
    if (reviewHeader) {
        reviewHeader.textContent = '4.8 ⭐ basado en 99 reseñas';
    }
}

// Llamar cuando el elemento sea visible
const reviewsSection = document.querySelector('.reviews');
if (reviewsSection) {
    const observerStats = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                animarNumeros();
                entry.target.classList.add('animated');
            }
        });
    });
    observerStats.observe(reviewsSection);
}

// ==================== GALERÍA INTERACTIVA ====================
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Agregar efecto de clic
        item.style.transform = 'scale(0.98)';
        setTimeout(() => {
            item.style.transform = 'scale(1)';
        }, 200);
    });
});

// ==================== SMOOTH SCROLLING ====================
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

// ==================== PARALLAX EFFECT ====================
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrollPosition = window.pageYOffset;
    hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
});

// ==================== VALIDACIÓN DE FORMULARIO ====================
function validarTelefono(telefono) {
    const regexTelefono = /^[\d\s\-\+\(\)]{9,}$/;
    return regexTelefono.test(telefono);
}

// Validar teléfono en tiempo real
document.getElementById('telefono').addEventListener('input', function() {
    if (!validarTelefono(this.value) && this.value.length > 0) {
        this.style.borderColor = '#ff6b6b';
    } else {
        this.style.borderColor = '#e0e0e0';
    }
});

// ==================== EFECTO HOVER EN BOTONES ====================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });

    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ==================== VERIFICAR HORARIO DE ATENCIÓN ====================
function verificarHorarioAtencion() {
    const ahora = new Date();
    const hora = ahora.getHours();
    const minutos = ahora.getMinutes();
    const horaActual = hora * 60 + minutos;

    // Horarios: 9:30-14:00 (570-840) y 15:30-20:30 (930-1230)
    const abierto = (horaActual >= 570 && horaActual <= 840) || 
                    (horaActual >= 930 && horaActual <= 1230);

    const diaSemana = ahora.getDay();
    const esLaboral = diaSemana >= 1 && diaSemana <= 5; // Lun-Vie

    return abierto && esLaboral;
}

// ==================== INIT ====================
console.log('GAJAH KLUB - Página web cargada correctamente');
console.log('Contacto: 687 21 15 05');
console.log('WhatsApp: https://wa.me/34687211505');