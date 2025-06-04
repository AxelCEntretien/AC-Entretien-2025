const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect('mongodb+srv://axelcharrier:Modestie3544!@acentretien2025.x0bkcp6.mongodb.net/?retryWrites=true&w=majority&appName=ACEntretien2025', {
            dbName: 'acentretien', // nom de ta base dans le cluster
        });
        console.log('✅ Connecté à MongoDB Atlas');
    } catch (err) {
        console.error('❌ Erreur de connexion MongoDB :', err);
    }
}

module.exports = connectDB;
