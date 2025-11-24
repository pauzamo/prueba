const favoritesService = require('../service/favorites.service');

// POST /api/favorites
const addFavorite = async (req, res) => {
  try {
    // El email se obtiene del token validado por el middleware (req.user)
    const email = req.user.email; 
    const { libroApiId } = req.body;
    
    const response = await favoritesService.addFavoriteBook(email, libroApiId);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error en addFavorite controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// DELETE /api/favorites/:libroApiId
const removeFavorite = async (req, res) => {
  try {
    const email = req.user.email; 
    const { libroApiId } = req.params;
    
    const response = await favoritesService.removeFavoriteBook(email, libroApiId);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error en removeFavorite controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// GET /api/favorites
const getFavorites = async (req, res) => {
  try {
    const email = req.user.email; 
    
    const response = await favoritesService.getFavoriteBooks(email);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error en getFavorites controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { addFavorite, removeFavorite, getFavorites };