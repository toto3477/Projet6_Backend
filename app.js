const express = require('express');
const mongoose = require('mongoose'); /*
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
const path = require('path'); */
// On charge les variables d'environnement du fichier .env (Sécurité du site)
require("dotenv").config();



// Début du paragraphe pour la connection a MongoDB
try {
  mongoose.connect(process.env.MONGO_DATABASE_USER, {});
  console.log("Connexion à MongoDB réussie");
} catch (error) {
  console.error('Connexion à MongoDB échouée:', error.message);
} 

//Création de l'application Express
const app = express();

// Donne un résultat au format JSON (remplace body.parser) dans req.body
app.use(express.json());

// MiddleWare CORS qui permet d'utiliser les headers et méthodes indiquées, depuis n'importe quelle origine.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
/* 
// Configuration des préfixes des routes (pour alléger le code plus tard)
 app.use('/api/auth', userRoutes);
 app.use('/api/books', booksRoutes);
 app.use('/images', express.static(path.join(__dirname, 'images')));
 */

module.exports = app;