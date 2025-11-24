const authService = require('../service/auth.service');

const registerProfile = async (req, res) => {
  try {
    const response = await authService.registerUserProfile(req.body);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error en registerProfile controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getProfile = async (req, res) => {
  try {
   
    const { email } = req.body; 
    const response = await authService.getProfileByEmail(email);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error en getProfile controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateProfile = async (req, res) => {
    try {
        // El email se obtiene del token de Cognito validado por el middleware
        const email = req.user.email; 
        const response = await authService.updateProfile(email, req.body);
        res.status(response.status).json(response.body);
    } catch (error) {
        console.error('Error en updateProfile controller:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = { 
    registerProfile, 
    getProfile, 
    updateProfile 
};