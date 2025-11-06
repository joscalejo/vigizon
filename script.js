/* ======================
   script.js - Vigizon Landing
   Funcionalidad:
   - Header sólido al hacer scroll
   - Efecto Parallax simple
   - Animaciones de aparición (Reveal on scroll)
   - Modal para la galería
   - Botones de cotización (WhatsApp)
   - Validación de formulario de contacto
   - Menú móvil
   ====================== */

// Envolvemos todo en una función autoejecutable (IIFE) 
// para proteger las variables del scope global.
(() => {
// ---------- CONFIGURACIÓN ----------
// IMPORTANTE: Reemplaza este número con tu WhatsApp (código de país + número)
const WHATSAPP_NUMBER = "51999999999"; 
const WA_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=`;
const WA_QUOTE_TEMPLATE = encodeURIComponent("Hola Vigizon, quisiera una cotización para: ");

// ---------- SELECCIÓN DE ELEMENTOS (DOM) ----------
// Usamos 'const' para elementos que no cambiarán
const body = document.body;
const header = document.getElementById('header');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalImg = document.getElementById('modalImg');
const yearEl = document.getElementById('year');
const contactForm = document.getElementById('contactForm');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

// ---------- INICIALIZACIÓN ----------

// 1. Actualizar año en el Footer
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// 2. Actualizar todos los enlaces de WhatsApp
const waHref = `https://wa.me/${WHATSAPP_NUMBER}`;
document.getElementById('floatingWA')?.setAttribute('href', waHref);
document.getElementById('whatsapp-top')?.setAttribute('href', waHref);
document.getElementById('whatsapp-aside')?.setAttribute('href', waHref);


// ---------- FUNCIONALIDAD: HEADER SÓLIDO ON SCROLL ----------
// Cambia el fondo del header cuando el usuario baja más de 40px
function updateHeaderBackground() {
    // window.scrollY es cuánto ha bajado el usuario
    if (window.scrollY > 40) {
     	header.classList.add('header--solid');
    	header.classList.remove('header--transparent');
    } else {
 	header.classList.remove('header--solid');
 	header.classList.add('header--transparent');
 }
 }
 // Ejecuta la función una vez al cargar
 updateHeaderBackground();
 // Y vuelve a ejecutarla cada vez que el usuario hace scroll
 window.addEventListener('scroll', updateHeaderBackground);


 // ---------- FUNCIONALIDAD: EFECTO PARALLAX SIMPLE ----------
 // Mueve la posición 'Y' del fondo de las secciones con [data-parallax-speed]
 const parallaxSections = document.querySelectorAll('[data-parallax-speed]');
 
 function applyParallaxEffect() {
 parallaxSections.forEach(section => {
 	// Obtenemos la velocidad (ej: 0.6) del atributo HTML
 	const speed = parseFloat(section.getAttribute('data-parallax-speed') || 0.5);
 	const rect = section.getBoundingClientRect();
 	// Calculamos qué tan visible está la sección
 	const offset = window.innerHeight - rect.top;
 	// Calculamos el desplazamiento (dividido por 12 para un efecto sutil)
 	const translate = (offset * speed) / 12;
 	// Aplicamos el desplazamiento al 'background-position'
 	section.style.backgroundPosition = `center ${translate}px`;
 });
 }
 // Aplicamos el efecto al cargar, al hacer scroll y al redimensionar
 window.addEventListener('scroll', applyParallaxEffect);
 window.addEventListener('resize', applyParallaxEffect);
 applyParallaxEffect();


 // ---------- FUNCIONALIDAD: REVELAR AL HACER SCROLL ----------
 // Usa IntersectionObserver para añadir 'in-view' a los elementos cuando entran en pantalla
 const revealElements = document.querySelectorAll('.reveal, .card, .price-card, .testimonial, .thumb');
 
 const observer = new IntersectionObserver((entries, obs) => {
 	entries.forEach(entry => {
 	  if (entry.isIntersecting) {
 	  	// 1. Añade la clase 'in-view' (que activa la animación CSS)
 	  	entry.target.classList.add('in-view');
 	  	// 2. Deja de observar el elemento (para que no se repita)
 	  	obs.unobserve(entry.target);
 	  }
 	});
 }, { threshold: 0.12 }); // threshold: 0.12 = se activa cuando el 12% del elemento es visible

 // Observa cada elemento
 revealElements.forEach(el => observer.observe(el));

// ---------- FUNCIONALIDAD: FADE EN LOOP DE VIDEO ----------
  // Oculta el "corte" del loop del video del hero
  const heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
  	// Tiempo (en segundos) para empezar el fade ANTES de que termine
  	const fadeDuration = 1.0; 

  	heroVideo.addEventListener('timeupdate', () => {
  		// 'timeupdate' se dispara muchas veces por segundo
  		const duration = heroVideo.duration;
  		const currentTime = heroVideo.currentTime;

  		// 1. Si falta menos de 'fadeDuration' para el final -> Ocultar
  		if ((duration - currentTime) <= fadeDuration) {
  			heroVideo.classList.add('is-fading');
  		} 
  		// 2. Si estamos al inicio (después del loop) -> Mostrar
  		else if (currentTime <= fadeDuration) {
  			heroVideo.classList.remove('is-fading');
  		}
  	});

  	// Seguridad: 'play' se dispara cuando el loop reinicia
  	heroVideo.addEventListener('play', () => {
  		// Nos aseguramos de que sea visible al reiniciar
  		if (heroVideo.currentTime < fadeDuration) {
  			heroVideo.classList.remove('is-fading');
  		}
  	});
  }

 // ---------- FUNCIONALIDAD: MODAL DE GALERÍA ----------
 const galleryThumbs = document.querySelectorAll('.gallery-grid .thumb, .gallery-grid img');
 
 function openModal(src) {
 	if (!src) return;
 	modalImg.src = src;
 	modal.setAttribute('aria-hidden', 'false'); // Muestra el modal
 	body.style.overflow = 'hidden'; // Evita scroll en el body
 }

 function closeModal() {
 	modal.setAttribute('aria-hidden', 'true'); // Oculta el modal
 	modalImg.src = ''; // Limpia la imagen
 	body.style.overflow = ''; // Restaura scroll
 }

 // 1. Abrir modal al hacer clic en una miniatura
 galleryThumbs.forEach(thumb => {
 	thumb.addEventListener('click', () => {
 	  // Busca la imagen (en data-src, o el src de la img interna, o el src del propio elemento)
 	  const src = thumb.dataset?.src || thumb.querySelector('img')?.src || thumb.src;
 	  openModal(src);
 	});
 });

 // 2. Cerrar modal con el botón 'X'
 modalClose?.addEventListener('click', closeModal);

 // 3. Cerrar modal al hacer clic fuera de la imagen (en el fondo oscuro)
 modal?.addEventListener('click', (e) => {
 	if (e.target === modal) {
 	  closeModal();
 	}
 });

 // 4. Cerrar modal con la tecla 'Escape'
 window.addEventListener('keydown', (e) => {
 	if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
 	  closeModal();
 	}
 });


 // ---------- FUNCIONALIDAD: BOTONES DE COTIZACIÓN (KITS) ----------
 // Abre WhatsApp con un mensaje predefinido
 document.querySelectorAll('.js-quote').forEach(btn => {
 	btn.addEventListener('click', () => {
 	  // Obtiene el nombre del kit desde 'data-kit'
 	  const kitName = btn.dataset.kit || 'una cotización';
 	  // Construye la URL final
 	  const url = WA_BASE_URL + WA_QUOTE_TEMPLATE + encodeURIComponent(kitName);
 	  // Abre en una nueva pestaña
 	  window.open(url, '_blank');
 	});
 });


 // ---------- FUNCIONALIDAD: FORMULARIO DE CONTACTO ----------
 // Validación simple. Envía los datos por WhatsApp
 if (contactForm) {
 	contactForm.addEventListener('submit', (e) => {
 	  e.preventDefault(); // Evita que la página se recargue
 	  
 	  const name = contactForm.querySelector('#name').value.trim();
 	  const phone = contactForm.querySelector('#phone').value.trim();
 	  const msg = contactForm.querySelector('#msg').value.trim();

 	  // Validación básica
 	  if (!name || !phone) {
 	  	alert('Por favor completa tu nombre y teléfono.');
 	  	return; // Detiene la ejecución
 	  }

 	  // Si es válido, construye el mensaje para WhatsApp
 	  const waMessage = encodeURIComponent(`Hola Vigizon, soy ${name}. Necesito información sobre: ${msg || '-'}. Mi teléfono es ${phone}`);
 	  
 	  // Abre WhatsApp (alternativa a enviar a un email/backend)
 	  window.open(`${WA_BASE_URL}${waMessage}`, '_blank');
 	  
 	  contactForm.reset(); // Limpia el formulario
 	  alert('Solicitud enviada. Te contactaremos por WhatsApp pronto.');
 	});
 }


 // ---------- FUNCIONALIDAD: MENÚ MÓVIL ----------
 // Muestra u oculta el menú en móviles
 if (menuToggle && navMenu) {
 	menuToggle.addEventListener('click', () => {
 	  // Añade o quita la clase 'nav--open' (definida en el CSS)
 	  navMenu.classList.toggle('nav--open');
 	  
 	  // Opcional: mejora la accesibilidad
 	  const isOpen = navMenu.classList.contains('nav--open');
 	  menuToggle.setAttribute('aria-expanded', isOpen);
 	});
 }

})(); // Fin de la IIFE