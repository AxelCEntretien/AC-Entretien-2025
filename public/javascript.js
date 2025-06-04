
        

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
            const street = this.street.value.trim();
            const number = this.number.value.trim();
            const zipcode = this.zipcode.value.trim();
            const city = this.city.value.trim();    

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
                body: JSON.stringify({ firstname, lastname, email, password, street, number, zipcode, city })

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

    if (data.connected) {
        const connexionBtn = document.getElementById('connexion-button');
        const inscriptionBtn = document.querySelector('.header-btn2');

        connexionBtn.textContent = 'Mon Compte';
        connexionBtn.setAttribute('onclick', "switchTab(this, 'moncompte')");
        connexionBtn.classList.add('tab');

        if (inscriptionBtn) inscriptionBtn.style.display = 'none';

        // ✅ Injecter le prénom
        const monCompteContainer = document.getElementById('slide-moncompte');
        const nameElement = monCompteContainer.querySelector('.user-firstname');
        console.log('Prénom reçu :', data.firstname); // DEBUG
        if (nameElement && data.firstname) {
            nameElement.textContent = data.firstname;
        }

        // ✅ Injecter les autres infos
        const userInfoContainer = document.querySelector('.user-info');
        if (userInfoContainer) {
            const infos = `
                <b>Email :</b> ${data.email}<br>
                <b>Adresse :</b> ${data.number || ''} ${data.street || ''}, ${data.zipcode || ''} ${data.city || ''}
            `;
            userInfoContainer.innerHTML = infos;
        }

    } else {
        const connexionBtn = document.getElementById('connexion-button');
        connexionBtn.textContent = 'Connexion';
        connexionBtn.setAttribute('onclick', "openModal('modal-login')");
        connexionBtn.classList.add('tab');

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

window.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('/check-auth');
    const data = await res.json();

    if (data.connected) {
        const connexionBtn = document.getElementById('connexion-button');
        const inscriptionBtn = document.querySelector('.header-btn2');

        connexionBtn.textContent = 'Mon Compte';
        connexionBtn.setAttribute('onclick', "switchTab(this, 'moncompte')");
        connexionBtn.classList.add('tab');

        if (inscriptionBtn) inscriptionBtn.style.display = 'none';

        // ✅ Injecter le prénom
        const monCompteContainer = document.getElementById('slide-moncompte');
        const nameElement = monCompteContainer.querySelector('.user-firstname');
        if (nameElement && data.firstname) {
            nameElement.textContent = data.firstname;
        }

        // ✅ Injecter les autres infos
        const userInfoContainer = document.querySelector('.user-info');
        if (userInfoContainer) {
            const infos = `
                <b>Email :</b> ${data.email}<br>
                <b>Adresse :</b> ${data.number || ''} ${data.street || ''}, ${data.zipcode || ''} ${data.city || ''}
            `;
            userInfoContainer.innerHTML = infos;
        }

        // ✅ Préremplir les champs du formulaire de contact
        const formFields = {
            firstname: document.getElementById('form-firstname'),
            lastname: document.getElementById('form-lastname'),
            email: document.getElementById('form-email'),
            street: document.getElementById('form-street'),
            number: document.getElementById('form-number'),
            zipcode: document.getElementById('form-zipcode'),
            city: document.getElementById('form-city')
        };

        if (formFields.firstname) formFields.firstname.value = data.firstname || '';
        if (formFields.lastname) formFields.lastname.value = data.lastname || '';
        if (formFields.email) formFields.email.value = data.email || '';
        if (formFields.street) formFields.street.value = data.street || '';
        if (formFields.number) formFields.number.value = data.number || '';
        if (formFields.zipcode) formFields.zipcode.value = data.zipcode || '';
        if (formFields.city) formFields.city.value = data.city || '';
    } else {
        const connexionBtn = document.getElementById('connexion-button');
        connexionBtn.textContent = 'Connexion';
        connexionBtn.setAttribute('onclick', "openModal('modal-login')");
        connexionBtn.classList.add('tab');

        const inscriptionBtn = document.querySelector('.header-btn2');
        if (inscriptionBtn) inscriptionBtn.style.display = 'block';
    }

    // ✅ Ajout pour initialiser la tab-indicator correctement
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
    // Onglets actifs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');

    // Déplacement de la barre verte
    const indicator = document.querySelector('.tab-indicator');
    indicator.style.width = `${el.offsetWidth}px`;
    indicator.style.left = `${el.offsetLeft}px`;

    // Slides à gérer
    const slides = {
        prestations: document.getElementById('slide-prestations'),
        contact: document.getElementById('slide-contact'),
        moncompte: document.getElementById('slide-moncompte')
    };

    // Masquer tous les slides
    for (const key in slides) {
        slides[key].classList.remove('active', 'exit-left', 'exit-right');
    }

    // Appliquer l'effet de transition (carrousel)
    for (const key in slides) {
        if (key !== tabName) {
            const currentIndex = Object.keys(slides).indexOf(key);
            const newIndex = Object.keys(slides).indexOf(tabName);

            if (currentIndex < newIndex) {
                slides[key].classList.add('exit-left');
            } else {
                slides[key].classList.add('exit-right');
            }
        }
    }

    // Affichage avec léger décalage
    setTimeout(() => {
        if (slides[tabName]) {
            slides[tabName].classList.add('active');
        }
    }, 20);
}

document.getElementById('zipcode').addEventListener('input', async function () {
    const zip = this.value.trim();

    if (zip.length === 5 && /^\d+$/.test(zip)) {
        try {
            const res = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${zip}&fields=nom&format=json`);
            const data = await res.json();

            if (data.length > 0) {
                document.getElementById('city').value = data[0].nom;
            } else {
                document.getElementById('city').value = '';
            }
        } catch (e) {
            console.error("Erreur API code postal :", e);
            document.getElementById('city').value = '';
        }
    } else {
        document.getElementById('city').value = '';
    }
});
// 👁️ Afficher/Masquer le mot de passe
function togglePassword(id) {
    const field = document.getElementById(id);
    field.type = field.type === 'password' ? 'text' : 'password';
}

// 🎯 Code postal → villes API
document.getElementById('zipcode').addEventListener('input', async function () {
    const zip = this.value.trim();
    const citySelect = document.getElementById('city');

    if (zip.length === 5 && /^\d+$/.test(zip)) {
        try {
            const res = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${zip}&fields=nom&format=json`);
            const data = await res.json();

            citySelect.innerHTML = ''; // Réinitialise la liste

            if (data.length > 0) {
                data.forEach(commune => {
                    const option = document.createElement('option');
                    option.value = commune.nom;
                    option.textContent = commune.nom;
                    citySelect.appendChild(option);
                });
            } else {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'Aucune commune trouvée';
                citySelect.appendChild(option);
            }
        } catch (e) {
            console.error("Erreur API code postal :", e);
            citySelect.innerHTML = '<option value="">Erreur lors du chargement</option>';
        }
    } else {
        citySelect.innerHTML = '<option value="">-- Veuillez entrer un code postal --</option>';
    }
});
function openModal(id) {
  document.getElementById(id).classList.add('show');

  if (id === 'modal-login') {
    // Active les champs login seulement à l'ouverture
    document.getElementById('login-email').disabled = false;
    document.getElementById('login-password').disabled = false;
  }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');

  if (id === 'modal-login') {
    document.getElementById('login-email').disabled = true;
    document.getElementById('login-password').disabled = true;
  }
}

document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const data = {
    firstname: document.getElementById('form-firstname').value.trim(),
    lastname: document.getElementById('form-lastname').value.trim(),
    email: document.getElementById('form-email').value.trim(),
    street: document.getElementById('form-street').value.trim(),
    number: document.getElementById('form-number').value.trim(),
    zipcode: document.getElementById('form-zipcode').value.trim(),
    city: document.getElementById('form-city').value.trim(),
    message: document.getElementById('form-message').value.trim()
  };

  const feedback = document.getElementById('form-feedback');
  feedback.textContent = '';

  try {
    const res = await fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const msg = await res.text();
    if (res.ok) {
      feedback.style.color = 'lightgreen';
      feedback.textContent = '✅ Votre message a bien été envoyé.';
      this.reset(); // vide le formulaire
    } else {
      feedback.style.color = 'red';
      feedback.textContent = `❌ ${msg}`;
    }
  } catch (err) {
    feedback.style.color = 'red';
    feedback.textContent = "❌ Une erreur est survenue.";
  }
});
function animateLogoRandomly() {
    const logo = document.querySelector('.logo');
    if (!logo) return;

    const delay = Math.random() * (8000 - 2000) + 2000; // entre 2s et 8s

    setTimeout(() => {
        logo.classList.add('animate');

        // Enlève la classe après l'animation (évite accumulation)
        setTimeout(() => {
            logo.classList.remove('animate');
            animateLogoRandomly(); // relance récursivement
        }, 700); // durée animation + marge
    }, delay);
}

// Démarre l'animation quand la page est chargée
window.addEventListener('DOMContentLoaded', () => {
    animateLogoRandomly();
});

