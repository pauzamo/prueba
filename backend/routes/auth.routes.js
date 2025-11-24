const express = require('express');
const { registerProfile, getProfile, updateProfile } = require('../controller/auth.controllers');
const authenticateCognito = require('../middleware/cognitoAuth.middleware');

const router = express.Router();

// Rutas de uso público/inicial:
// POST: Crea el perfil local después de que Cognito registra al usuario por primera vez.
router.post('/register-profile', registerProfile); 
// POST: Obtiene el perfil local enviando el email (para el primer login).
router.post('/profile', getProfile); 

// Rutas protegidas (Requieren Token JWT de Cognito válido)
// PUT: Actualiza el perfil
router.put('/profile', authenticateCognito, updateProfile); 

module.exports = router;