document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const themeStatus = document.getElementById('theme-status');
    const changeNameBtn = document.getElementById('change-name');
    const nameModal = document.getElementById('name-modal');
    const saveNameBtn = document.getElementById('save-name');
    const closeNameBtn = document.getElementById('close-name');
    const usernameInput = document.getElementById('username');
    const blockUsersBtn = document.getElementById('block-users');
    const toggleThemeBtn = document.getElementById('toggle-theme');

    // 🔹 Función para cambiar el tema
    function toggleDarkMode() {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        themeStatus.textContent = isDarkMode ? 'Oscuro' : 'Claro';
    }

    // 🔹 Cargar el tema guardado al iniciar
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeStatus.textContent = 'Oscuro';
    } else {
        themeStatus.textContent = 'Claro';
    }

    // 🔹 Abrir modal de cambio de nombre
    if (changeNameBtn) {
        changeNameBtn.addEventListener('click', () => {
            nameModal.style.display = 'block';
        });
    }

    // 🔹 Cerrar modal con la X
    if (closeNameBtn) {
        closeNameBtn.addEventListener('click', () => {
            nameModal.style.display = 'none';
        });
    }

    // 🔹 Guardar nombre en LocalStorage
    if (saveNameBtn) {
        saveNameBtn.addEventListener('click', () => {
            const newName = usernameInput.value.trim();
            if (newName) {
                localStorage.setItem('username', newName);
                nameModal.style.display = 'none';
            }
        });
    }

    // 🔹 Bloquear usuario
    if (blockUsersBtn) {
        blockUsersBtn.addEventListener('click', () => {
            const userToBlock = prompt('Ingresa el nombre del usuario a bloquear:');
            if (userToBlock) {
                let blockedUsers = JSON.parse(localStorage.getItem('blockedUsers')) || [];
                blockedUsers.push(userToBlock);
                localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
                alert('Usuario ' + userToBlock + ' bloqueado.');
            }
        });
    }

    // 🔹 Cambiar tema
    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', toggleDarkMode);
    }
});
