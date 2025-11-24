const express = require('express');
const { addFavorite, removeFavorite, getFavorites } = require('../controller/favorites.controllers');
const authenticateCognito = require('../middleware/cognitoAuth.middleware'); 

const router = express.Router();

// Todas estas rutas requieren autenticación de Cognito
router.post('/', authenticateCognito, addFavorite);
router.get('/', authenticateCognito, getFavorites);
router.delete('/:libroApiId', authenticateCognito, removeFavorite);

module.exports = router;