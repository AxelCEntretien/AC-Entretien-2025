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
    const { firstname, lastname, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Utilisateur déjà inscrit');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstname, lastname, email, password: hashedPassword });
        await newUser.save();

        req.session.userId = newUser._id; // auto-connexion après inscription
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

        req.session.userId = user._id;
        res.status(200).send('Connexion réussie');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

app.get('/check-auth', (req, res) => {
    if (req.session.userId) {
        res.json({ connected: true });
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


