// Esperar a que el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // --- Configuraciones Generales ---
    const animationConfig = {
        fadeInDuration: 1000,       // Duración de la transición de entrada en ms
        scrollTriggerOffset: 0.85,  // Porcentaje del viewport para activar animaciones (85% desde arriba)
        staggerDelay: 100,          // Retraso entre animaciones de elementos consecutivos (ms)
        parallaxIntensity: 0.03     // Intensidad del efecto parallax (más sutil)
    };

    // --- Transición de Carga Inicial ---
    const overlay = document.querySelector('.transition-overlay');
    if (overlay) {
        // Desvanecimiento simple del overlay
        setTimeout(() => {
            overlay.style.opacity = '0';

            // Eliminar el overlay del DOM después de la transición para liberar recursos
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, animationConfig.fadeInDuration); // Esperar a que termine la transición CSS

            // Iniciar la animación del título y otros elementos después del overlay
            setTimeout(animateInitialElements, 300); // Un pequeño retraso

        }, 500); // Mostrar el overlay por medio segundo antes de empezar a desvanecer
    } else {
         // Si no hay overlay, iniciar animaciones directamente
         animateInitialElements();
    }

    // --- Keyframes CSS Dinámicos (Inyectados por JS) ---
    // Añade animaciones CSS que se usarán luego
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
        @keyframes scaleIn {
            from { transform: scale(0.98); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        @keyframes floatUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        @keyframes floatUpDown { /* Animación sutil de flotación */
            0% { transform: translateY(0px); }
            50% { transform: translateY(-6px); } /* Movimiento vertical reducido */
            100% { transform: translateY(0px); }
        }

        .float-animation {
            /* Aplica la animación de flotación */
            animation: floatUpDown 4s ease-in-out infinite;
        }
    `;
    document.head.appendChild(styleSheet);

    // --- Barra de Progreso de Scroll ---
    let scrollProgress; // Definir la variable fuera para acceso global en este scope

    function createScrollProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress'; // Usa la clase definida en CSS
        document.body.appendChild(progressBar);
        return progressBar;
    }

    function updateScrollProgress() {
        if (!scrollProgress) return; // Si no existe la barra, no hacer nada

        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        // Evitar división por cero si el contenido no es scrolleable
        if (scrollTotal <= 0) {
             scrollProgress.style.width = '0%';
             return;
        }
        const scrollDone = window.scrollY;
        const scrollPercent = Math.min((scrollDone / scrollTotal) * 100, 100); // Asegurar máximo 100%
        scrollProgress.style.width = scrollPercent + '%';
    }

    // Crear la barra de progreso
    scrollProgress = createScrollProgressBar();

    // --- Animación de Elementos al Hacer Scroll ---
    // Función para verificar si un elemento está visible en el viewport
    function isElementInViewport(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        // Activar cuando la parte superior del elemento entra en el % definido del viewport
        return (
            rect.top <= windowHeight * animationConfig.scrollTriggerOffset &&
            rect.bottom >= 0 // Y que la parte inferior aún no haya salido por arriba
        );
    }

    // Función para animar elementos marcados con .animate-element
    function animateElementsOnScroll() {
        const elements = document.querySelectorAll('.animate-element:not(.visible)'); // Selecciona solo los no visibles

        elements.forEach((element, index) => {
            if (isElementInViewport(element)) {
                // Aplicar retraso escalonado para efecto cascada
                setTimeout(() => {
                    element.classList.add('visible');

                    // Opcional: añadir animaciones específicas JS si es necesario
                    // (La animación base ya está en CSS con .animate-element.visible)
                    // if (element.classList.contains('team-member')) {
                    //     element.style.animation = 'floatUp 0.8s forwards ease-out';
                    // }

                }, index * animationConfig.staggerDelay);
            }
        });
    }

    // --- Efecto Parallax Sutil ---
    function applyParallaxEffect() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Parallax para el fondo del body (si es una imagen que se repite o es grande)
        document.body.style.backgroundPosition = `center ${scrollTop * animationConfig.parallaxIntensity}px`;

        // Parallax sutil para secciones (opcional, puede afectar rendimiento)
        /*
        const sections = document.querySelectorAll('.content-section');
        sections.forEach((section, index) => {
            if (isElementInViewport(section)) {
                const yPos = scrollTop * (0.01 + (index * 0.002)); // Muy sutil
                section.style.transform = `translateY(${-yPos}px)`;
            } else {
                 section.style.transform = `translateY(0px)`; // Resetear si no está visible
            }
        });
        */
    }

    // --- Efecto Hover Mejorado para Miembros del Equipo (Desktop) ---
    function setupTeamMemberHover() {
         // Solo aplicar en pantallas mayores a 768px (donde se usa .team y no el carrusel)
        if (window.innerWidth > 768) {
            const teamMembers = document.querySelectorAll('.team .team-member'); // Específico para desktop

            teamMembers.forEach(member => {
                member.classList.add('float-animation'); // Añadir flotación constante

                member.addEventListener('mouseenter', function() {
                    // Restablecer estilos de todos primero para evitar conflictos
                    teamMembers.forEach(m => {
                        m.style.opacity = '1';
                        m.style.transform = ''; // Limpiar transform inline
                         m.style.zIndex = '1';
                         m.style.boxShadow = ''; // Limpiar sombra inline
                    });

                    // Aplicar estilos al miembro activo
                    this.style.transform = 'translateY(-10px) scale(1.03)'; // Elevación y escala
                    this.style.boxShadow = '0 12px 30px rgba(134, 100, 255, 0.4)';
                    this.style.zIndex = '2'; // Poner al frente

                    // Atenuar los demás miembros
                    teamMembers.forEach(otherMember => {
                        if (otherMember !== this) {
                            otherMember.style.opacity = '0.6';
                            otherMember.style.transform = 'scale(0.98)'; // Ligeramente más pequeño
                            otherMember.style.zIndex = '1';
                        }
                    });
                });

                member.addEventListener('mouseleave', function() {
                    // Restaurar todos los miembros a su estado normal (controlado por CSS)
                    teamMembers.forEach(otherMember => {
                        otherMember.style.opacity = ''; // Quitar estilo inline
                        otherMember.style.transform = ''; // Quitar estilo inline
                        otherMember.style.zIndex = ''; // Quitar estilo inline
                        otherMember.style.boxShadow = ''; // Quitar estilo inline
                    });
                });
            });
        } else {
             // En pantallas móviles, quitar la animación de flotación si se aplicó antes
             document.querySelectorAll('.team-member.float-animation').forEach(member => {
                 member.classList.remove('float-animation');
             });
        }
    }


    // --- Corrección/Animación para Lista de Valores (si se usara 'li') ---
    // Este código asume que los valores están en .valor-card ahora,
    // por lo que el bloque original 'FIX: Arreglar la sección de valores'
    // que buscaba 'li' ya no es aplicable directamente. El hover se maneja por CSS.
    // Si hubiera elementos 'li' específicos que animar:
    /*
    const valoresItems = document.querySelectorAll('.valores li.animate-element'); // Ejemplo
    valoresItems.forEach(item => {
        // Asegurarse de que sean visibles y aplicar animaciones si es necesario
        item.style.opacity = "1"; // Asegurar visibilidad base
        item.classList.add('visible'); // Marcar como visible para que no lo anime el scroll general
        // Añadir listeners de hover si se requiere comportamiento JS específico
    });
    */

    // --- Animación Botón de Contacto ---
    const contactButton = document.querySelector('.contact-button');
    if (contactButton) {
        // Los efectos hover ya están definidos en CSS y son suficientes.
        // Se podría añadir JS para efectos más complejos (partículas, etc.) si se desea.
    }

    // --- Efecto Máquina de Escribir para el Título Principal (H1) ---
    function typeWriterEffect() {
        const mainTitle = document.querySelector('h1');
        if (mainTitle && mainTitle.dataset.originalTitle) { // Usar data-attribute para guardar el original
            const originalTitle = mainTitle.dataset.originalTitle;
            mainTitle.textContent = ''; // Limpiar
            let i = 0;

            function type() {
                if (i < originalTitle.length) {
                    mainTitle.textContent += originalTitle.charAt(i);
                    i++;
                    setTimeout(type, 70); // Velocidad de escritura
                }
            }
            type(); // Iniciar escritura
        }
    }

    // --- Desplazamiento Suave para Enlaces Internos (Anclas) ---
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                // Asegurarse de que es un ancla real y no solo '#'
                if (href && href.length > 1 && href.startsWith('#')) {
                    try {
                         const targetElement = document.querySelector(href);
                         if (targetElement) {
                            e.preventDefault(); // Prevenir comportamiento por defecto solo si el target existe
                            const headerOffset = document.querySelector('.header') ? document.querySelector('.header').offsetHeight + 10 : 70; // Offset para la cabecera fija
                            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                            const offsetPosition = elementPosition - headerOffset;

                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth' // Desplazamiento suave
                            });
                        }
                    } catch (error) {
                        console.error("Error finding element for smooth scroll:", error);
                        // No prevenir el default si el selector es inválido o no se encuentra
                    }
                }
            });
        });
    }

    // --- Interactividad del Logo ---
    const logo = document.querySelector('.logo');
    if (logo) {
        // Los efectos :hover en CSS son generalmente suficientes y más eficientes.
        // Este JS es redundante si el CSS ya lo hace.
        /*
        logo.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.4s ease'; // Asegurar transición
            this.style.transform = 'scale(1.05)';
        });
        logo.addEventListener('mouseleave', function() {
             this.style.transform = 'scale(1)';
        });
        */
    }

    // --- Inicialización de Funciones ---
    function animateInitialElements() {
        // Guardar el título original antes de limpiarlo para el efecto typeWriter
         const mainTitle = document.querySelector('h1');
         if(mainTitle && !mainTitle.dataset.originalTitle) { // Guardar solo si no se ha guardado ya
            mainTitle.dataset.originalTitle = mainTitle.textContent;
         }

        // Activar efecto de escritura
        typeWriterEffect();

        // Animar elementos visibles inicialmente sin esperar scroll
        animateElementsOnScroll();
    }

    // --- Carrusel Móvil ---
    let autoScrollInterval;
    const autoScrollDelay = 5000; // 5 segundos
    let currentCarouselIndex = 0; // Índice del slide actual

    function initCarousel() {
        const track = document.querySelector('.mobile-carousel .carousel-track');
        const slides = document.querySelectorAll('.mobile-carousel .carousel-slide');
        const dotsContainer = document.querySelector('.mobile-carousel .carousel-dots');
        const carouselContainer = document.querySelector('.mobile-carousel .carousel-container');

        if (!track || !slides.length || slides.length <= 1) {
            // Si no hay track, slides o solo hay 1 slide, no inicializar carrusel
             if(dotsContainer) dotsContainer.style.display = 'none'; // Ocultar dots si no hay carrusel
            return;
        }

         // Limpiar dots existentes antes de crear nuevos
         if(dotsContainer) dotsContainer.innerHTML = '';

        // Crear dots dinámicamente
        slides.forEach((_, i) => {
             if(dotsContainer) {
                const dot = document.createElement('button'); // Usar button para accesibilidad
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                if (i === 0) dot.classList.add('active'); // Activar el primer dot

                dot.addEventListener('click', () => {
                    stopAutoScroll();
                    moveToSlide(i);
                    // Reiniciar auto-scroll después de interacción manual
                    setTimeout(startAutoScroll, autoScrollDelay * 1.5);
                });
                dotsContainer.appendChild(dot);
             }
        });

        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : []; // Obtener los dots recién creados

        // Mover a un slide específico
        function moveToSlide(index) {
            const numSlides = slides.length;
             // Ajustar índice para bucle infinito
             currentCarouselIndex = (index + numSlides) % numSlides;

            track.style.transform = `translateX(-${currentCarouselIndex * 100}%)`;

            // Actualizar dots activos
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentCarouselIndex);
            });
        }

        // Iniciar auto-scroll
        function startAutoScroll() {
            stopAutoScroll(); // Limpiar intervalo anterior si existe
             if (slides.length > 1) { // Solo iniciar si hay más de 1 slide
                autoScrollInterval = setInterval(() => {
                    moveToSlide(currentCarouselIndex + 1);
                }, autoScrollDelay);
            }
        }

        // Detener auto-scroll
        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }

        // Soporte táctil (Swipe)
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            stopAutoScroll();
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
             // Reiniciar auto-scroll después de swipe
             setTimeout(startAutoScroll, autoScrollDelay * 1.5);
        }, { passive: true });

        function handleSwipe() {
            const difference = touchStartX - touchEndX;
            const threshold = 50; // Mínimo deslizamiento para considerarlo swipe

            if (Math.abs(difference) > threshold) {
                if (difference > 0) { // Swipe izquierda (siguiente)
                    moveToSlide(currentCarouselIndex + 1);
                } else { // Swipe derecha (anterior)
                    moveToSlide(currentCarouselIndex - 1);
                }
            }
        }

        // Pausar en hover (si es relevante en móvil, aunque menos común)
        if (carouselContainer) {
             carouselContainer.addEventListener('mouseenter', stopAutoScroll);
             carouselContainer.addEventListener('mouseleave', startAutoScroll);
        }

         // Mover al slide inicial (asegura la posición correcta al cargar/redimensionar)
         moveToSlide(currentCarouselIndex); // Usar la variable global

        // Iniciar el auto-scroll
        startAutoScroll();
    }


    // --- Event Listeners Generales ---
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        // Optimización: No ejecutar en cada pixel de scroll
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            animateElementsOnScroll();
            applyParallaxEffect();
            updateScrollProgress();
        }, 10); // Ejecutar cada 10ms como máximo
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Reinicializar funciones que dependen del tamaño de pantalla
            setupTeamMemberHover();
            // Opcional: Reinicializar carrusel si su lógica depende del tamaño
             initCarousel(); // Reiniciar carrusel en resize
        }, 250); // Esperar a que termine el redimensionamiento
    });

    // --- Ejecución Inicial ---
    setupSmoothScrolling();
    setupTeamMemberHover(); // Configurar hover inicial
    initCarousel(); // Inicializar carrusel móvil (si aplica)
    animateElementsOnScroll(); // Ejecutar una vez al cargar por si hay elementos visibles
    updateScrollProgress(); // Actualizar progreso inicial


    // --- Intersection Observer para animaciones (Alternativa/Mejora a onScroll) ---
    // Más eficiente que comprobar en cada scroll
    const observerOptions = {
        root: null, // Relativo al viewport
        rootMargin: '0px',
        threshold: 0.1 // Activar cuando el 10% del elemento es visible
    };

    const intersectionCallback = (entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Aplicar retraso escalonado basado en el orden en el DOM
                // Necesitaríamos una forma de obtener el índice global si el retraso es importante
                 // const elements = Array.from(document.querySelectorAll('.animate-element'));
                 // const index = elements.indexOf(entry.target);
                 // setTimeout(() => {
                     entry.target.classList.add('visible');
                 // }, index * animationConfig.staggerDelay); // Staggering puede ser complejo con Observer

                 entry.target.classList.add('visible'); // Versión simple sin staggering complejo

                observerInstance.unobserve(entry.target); // Dejar de observar una vez animado
            }
        });
    };

    const observer = new IntersectionObserver(intersectionCallback, observerOptions);

    // Observar todos los elementos a animar
    document.querySelectorAll('.animate-element').forEach(el => {
        observer.observe(el);
    });

    // Nota: Si usas Intersection Observer, la función animateElementsOnScroll
    // y su llamada en el evento 'scroll' podrían eliminarse o modificarse,
    // ya que el Observer se encarga de detectar la visibilidad.
    // Por ahora, se dejan ambos como ejemplo, pero idealmente usarías solo uno.
    // Para usar solo Observer, comenta/elimina `animateElementsOnScroll` y su llamada en el listener de scroll.

}); // Fin de DOMContentLoaded