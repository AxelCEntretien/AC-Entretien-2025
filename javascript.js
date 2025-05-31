
        function openModal(id) {
            document.getElementById(id).classList.add('show');
        }

        function closeModal(id) {
            document.getElementById(id).classList.remove('show');
        }

        async function logout() {
            await fetch('/logout');
            window.location.reload();
        }

        document.getElementById('register-form').addEventListener('submit', async function (e) {
            e.preventDefault();

            const firstname = this.firstname.value.trim();
            const lastname = this.lastname.value.trim();
            const email = this.email.value.trim();
            const password = this.password.value;
            const confirmPassword = this.confirmPassword.value;
            const errors = [];

            const errorContainer = document.getElementById('register-errors');
            errorContainer.innerHTML = '';

            if (!firstname) errors.push("Prénom requis");
            if (!lastname) errors.push("Nom requis");
            if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push("Adresse email invalide");
            if (!password || password.length < 6) errors.push("Mot de passe trop court (6 caractères minimum)");
            if (password !== confirmPassword) errors.push("Les mots de passe ne correspondent pas");

            if (errors.length > 0) {
                errorContainer.innerHTML = errors.map(e => `<div>${e}</div>`).join('');
                return;
            }

            const res = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstname, lastname, email, password })
            });

            const message = await res.text();
            if (res.status === 200) window.location.reload();
            else errorContainer.innerHTML = `<div>${message}</div>`;
        });

        document.getElementById('login-form').addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const errors = [];
            const errorBox = document.getElementById('login-errors');
            errorBox.innerHTML = '';

            if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push("Email invalide");
            if (!password) errors.push("Mot de passe requis");

            if (errors.length > 0) {
                errorBox.innerHTML = errors.map(e => `<div>${e}</div>`).join('');
                return;
            }

            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const msg = await res.text();
            if (res.status === 200) window.location.reload();
            else errorBox.innerHTML = `<div>${msg}</div>`;
        });

        window.addEventListener('DOMContentLoaded', async () => {
            const res = await fetch('/check-auth');
            const data = await res.json();

            const authButtons = document.getElementById('auth-buttons');
            const accountButton = document.getElementById('account-button');

            if (data.connected) {
    const connexionBtn = document.getElementById('connexion-button');
    const inscriptionBtn = document.querySelector('.header-btn2');

    connexionBtn.textContent = 'Mon Compte';
    connexionBtn.onclick = () => window.location.href = '/account';

    if (inscriptionBtn) inscriptionBtn.style.display = 'none';
} else {
    const connexionBtn = document.getElementById('connexion-button');
    connexionBtn.textContent = 'Connexion';
    connexionBtn.onclick = () => openModal('modal-login');

    const inscriptionBtn = document.querySelector('.header-btn2');
    if (inscriptionBtn) inscriptionBtn.style.display = 'block';
}


        });

        function switchTab(el, tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');

    const indicator = document.querySelector('.tab-indicator');
    indicator.style.width = `${el.offsetWidth}px`;
    indicator.style.left = `${el.offsetLeft}px`;
}

window.addEventListener('DOMContentLoaded', () => {
    const active = document.querySelector('.tab.active');
    const indicator = document.querySelector('.tab-indicator');
    if (active && indicator) {
        indicator.style.width = `${active.offsetWidth}px`;
        indicator.style.left = `${active.offsetLeft}px`;
    }
});
function switchToRegister() {
    closeModal('modal-login');
    openModal('modal-register');
}

function switchToLogin() {
    closeModal('modal-register');
    openModal('modal-login');
}

function switchTab(el, tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');

    const indicator = document.querySelector('.tab-indicator');
    indicator.style.width = `${el.offsetWidth}px`;
    indicator.style.left = `${el.offsetLeft}px`;

    const slides = {
        prestations: document.getElementById('slide-prestations'),
        contact: document.getElementById('slide-contact')
    };

    // Hide all first
    for (const key in slides) {
        slides[key].classList.remove('active', 'exit-left', 'exit-right');
    }

    // Set animation direction
    if (tabName === 'prestations') {
        slides.contact.classList.add('exit-right');
        setTimeout(() => {
            slides.prestations.classList.add('active');
        }, 20);
    } else if (tabName === 'contact') {
        slides.prestations.classList.add('exit-left');
        setTimeout(() => {
            slides.contact.classList.add('active');
        }, 20);
    }
}
