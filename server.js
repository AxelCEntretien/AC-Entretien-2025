const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const connectDB = require('./mongo');

const app = express();
const port = 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ✅ Middleware de session
app.use(session({
  secret: 'ACENTRETIEN_SECRET',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24h
  }
}));

// ✅ Route inscription
app.post('/register', async (req, res) => {
    const {
        firstname,
        lastname,
        email,
        password,
        street,
        number,
        zipcode,
        city
    } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Utilisateur déjà inscrit');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            street,
            number,
            zipcode,
            city
        });

        await newUser.save();

        // ✅ Enregistrement de l'utilisateur dans la session
        req.session.user = {
            _id: newUser._id,
            firstname: newUser.firstname
        };

        res.status(200).send('Inscription réussie');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});



// ✅ Route connexion
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).send('Email incorrect');

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).send('Mot de passe incorrect');

        // ✅ Enregistrement du prénom dans la session
        req.session.user = {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            street: user.street,
            number: user.number,
            zipcode: user.zipcode,
            city: user.city
        };

        res.status(200).send('Connexion réussie');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});


app.get('/check-auth', (req, res) => {
    if (req.session.user) {
        const user = req.session.user; // ✅ on récupère l'objet utilisateur depuis la session

        res.json({
            connected: true,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            street: user.street,
            number: user.number,
            zipcode: user.zipcode,
            city: user.city
        });
    } else {
        res.json({ connected: false });
    }
});





app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});


app.listen(port, () => {
  console.log(`Serveur ACENTRETIEN en ligne sur http://localhost:${port}`);
});

const nodemailer = require('nodemailer');

app.post('/contact', async (req, res) => {
  const { firstname, lastname, email, street, number, zipcode, city, message } = req.body;

  try {
    // 🔐 Configuration de ton compte mail OVH
    const transporter = nodemailer.createTransport({
      host: 'ssl0.ovh.net', // ou smtp.<ton-domaine>.fr
      port: 465,
      secure: true,
      auth: {
        user: 'contact@ac-entretien.fr',   // à remplacer
        pass: 'Modestie3544470!'           // à remplacer
      }
    });

    const mailOptions = {
      from: `"${firstname} ${lastname}" <${email}>`,
      to: 'contact@ac-entretien.fr',  // vers toi-même
      subject: 'Nouvelle demande de prestation AC Entretien',
      html: `
        <h2>Nouvelle demande reçue :</h2>
        <p><b>Nom :</b> ${lastname}</p>
        <p><b>Prénom :</b> ${firstname}</p>
        <p><b>Email :</b> ${email}</p>
        <p><b>Adresse :</b> ${number} ${street}, ${zipcode} ${city}</p>
        <p><b>Message :</b><br>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Message envoyé avec succès.');
  } catch (err) {
    console.error('Erreur envoi e-mail :', err);
    res.status(500).send('Erreur lors de l’envoi. Veuillez réessayer plus tard.');
  }
});


