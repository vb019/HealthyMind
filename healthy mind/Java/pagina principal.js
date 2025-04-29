const nav = document.querySelector("#barra");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");
const logo = document.querySelector("#logo");
const mainContent = document.querySelector("main");

abrir.addEventListener("click", () => {
    nav.classList.add("visible")
    logo.style.display = "none";
    mainContent.style.display = "none";
})

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible")
    logo.style.display = "block";
    mainContent.style.display = "block";
})

document.querySelectorAll(".barralista li a").forEach(enlace => {
    enlace.addEventListener("click", (e) => {
        const icono = enlace.querySelector("i"); // Selecciona el icono dentro del enlace
        if (icono) {
            icono.classList.add("animacion");

            // Eliminar la animación después de que termine
            setTimeout(() => {
                icono.classList.remove("animacion");
            }, 300);
        }
    });
});

function moveCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    const wrapper = carousel.querySelector('.carousel-wrapper');
    const items = wrapper.children;
    const totalItems = items.length;

    let currentIndex = parseInt(wrapper.getAttribute('data-index')) || 0;
    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = totalItems - 1;
    } else if (currentIndex >= totalItems) {
        currentIndex = 0;
    }

    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`; 
    wrapper.setAttribute('data-index', currentIndex);
}

document.addEventListener("DOMContentLoaded", function () {
    const carousels = document.querySelectorAll(".contenido_carrusel");

    carousels.forEach(carousel => {
        const wrapper = carousel.querySelector(".carousel-wrapper");

        let startX = 0;
        let endX = 0;

        // Guardar la posición inicial del toque
        wrapper.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        });

        // Guardar la posición final del toque y decidir el movimiento
        wrapper.addEventListener("touchend", (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe(carousel.id);
        });

        function handleSwipe(carouselId) {
            const diff = startX - endX;
            if (Math.abs(diff) > 50) { // Detecta deslizamientos de más de 50px
                moveCarousel(carouselId, diff > 0 ? 1 : -1);
            }
        }
    });
});

// Ocultar las flechas en móvil
function toggleArrows() {
    const isMobile = window.innerWidth <= 600;
    document.querySelectorAll(".flechas_carrusel").forEach(arrow => {
        arrow.style.display = isMobile ? "none" : "block";
    });
}

// Ejecutar al cargar y al cambiar tamaño
window.addEventListener("load", toggleArrows);
window.addEventListener("resize", toggleArrows);

function handleClick(element) {
    // Remueve la clase 'active' de todos los elementos
    document.querySelectorAll('.inferiores_item').forEach(item => {
        item.classList.remove('active');
    });

    // Agrega la clase 'active' al elemento clickeado
    element.classList.add('active');
}

const carousels = document.querySelectorAll(".contenido_carrusel");

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
    logo.style.display = "none";
    
    // Ocultar los carruseles
    carousels.forEach(carousel => {
        carousel.classList.add("hidden");
    });
});

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
    logo.style.display = "block";
    
    // Mostrar los carruseles de nuevo
    carousels.forEach(carousel => {
        carousel.classList.remove("hidden");
    });
});

const commentBoxes = document.querySelectorAll(".caja_comentarios");

// Función para ocultar comentarios cuando el menú se abre
abrir.addEventListener("click", () => {
    commentBoxes.forEach(comment => comment.style.display = "none");
});

// Función para mostrar comentarios cuando el menú se cierra
cerrar.addEventListener("click", () => {
    commentBoxes.forEach(comment => comment.style.display = "block");
});



document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const themeStatus = document.getElementById("theme-status");
    const toggleThemeBtn = document.getElementById("toggle-theme");

    console.log("Script cargado correctamente");
    console.log("Botón encontrado:", toggleThemeBtn);

    // 🔹 Función para cambiar el tema
    function toggleDarkMode() {
        body.classList.toggle("dark-mode");
        const isDarkMode = body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");

        if (themeStatus) {
            themeStatus.textContent = isDarkMode ? "Oscuro" : "Claro";
        }
    }

    // 🔹 Cargar el tema guardado al iniciar
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        if (themeStatus) {
            themeStatus.textContent = "Oscuro";
        }
    } else {
        if (themeStatus) {
            themeStatus.textContent = "Claro";
        }
    }

});

