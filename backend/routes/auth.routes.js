const express = require('express');
const { registerProfile, getProfile, updateProfile } = require('../controller/auth.controllers');
const authenticateCognito = require('../middleware/cognitoAuth.middleware');

const router = express.Router();

// Crear perfil local (solo después de signup/login)
router.post('/register-profile', authenticateCognito, registerProfile);

// Obtener perfil (GET, protegido)
router.get('/profile', authenticateCognito, getProfile);

// Actualizar perfil (PUT, protegido)
router.put('/profile', authenticateCognito, updateProfile);

module.exports = router;
