document.addEventListener("DOMContentLoaded", function () {
    let signUp = document.getElementById("signUp");
    let signIn = document.getElementById("signIn");
    let nameInput = document.getElementById("nameInput");
    let titulo_formulario = document.getElementById("titulo_formulario");

    const modal_terms = document.getElementById("modal_terms");
    const abrir_Terms = document.getElementById("abrir_terms");
    const cerrar_terms = document.querySelector(".cerrar_terms");
    const termsCheckbox = document.getElementById("termscheckbox");
    const acceptTermsBtn = document.getElementById("acceptTerms");

    const body = document.body;
    const themeStatus = document.getElementById("theme-status");
    const toggleThemeBtn = document.getElementById("toggle-theme");

    console.log("Script cargado correctamente");

    // ✅ Comprobación de elementos antes de usarlos
    if (signUp && signIn && nameInput && titulo_formulario) {
        signUp.onclick = function () {
            nameInput.style.maxHeight = "60px";
            titulo_formulario.innerHTML = "Registro";
            signUp.classList.remove("disable");
            signIn.classList.add("disable");
        };

        signIn.onclick = function () {
            nameInput.style.maxHeight = "0";
            titulo_formulario.innerHTML = "Iniciar Sesión";
            signUp.classList.add("disable");
            signIn.classList.remove("disable");
        };
    } else {
        console.error("No se encontraron todos los elementos necesarios para cambiar de sesión.");
    }

//terminos y condiciones

    // PARTE DE LOS TÉRMINOS Y CONDICIONES  DE USO
    if (!modal_terms || !abrir_Terms || !cerrar_terms) {
        console.error("No se encontraron todos los elementos del modal.");
        return;
    }

    // ✅ Mostrar modal
    abrir_Terms.addEventListener("click", function (event) {
        event.preventDefault();
        modal_terms.style.display = "flex";
        modal_terms.scrollTop = 0;
    });

    // ✅ Cerrar modal
    cerrar_terms.addEventListener("click", function () {
        modal_terms.style.display = "none";
    });

    // ✅ Cerrar modal al hacer clic fuera de él
    window.addEventListener("click", function (event) {
        if (event.target === modal_terms) {
            modal_terms.style.display = "none";
        }
    });

    if (acceptTermsBtn && termsCheckbox) {
        acceptTermsBtn.addEventListener("click", function (event) {
            // Evitar el comportamiento predeterminado (enviar formulario o recargar la página)
            event.preventDefault();
    
            // Marcar el checkbox automáticamente
            termsCheckbox.checked = true;
    
            // Cerrar el modal después de aceptar
            modal_terms.style.display = "none";
            console.log("Checkbox marcado: ", termsCheckbox.checked);
        });
    }
    

    // MODO OSCURO
    function toggleDarkMode() {
        body.classList.toggle("dark-mode");
        const isDarkMode = body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");

        if (themeStatus) {
            themeStatus.textContent = isDarkMode ? "Oscuro" : "Claro";
        }
    }

    // ✅ Cargar el tema guardado al iniciar
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

    // ✅ Agregar evento al botón solo si existe
    if (toggleThemeBtn) {
        toggleThemeBtn.onclick = toggleDarkMode;
    }
});

