const authService = require('../service/auth.service');

const register = async (req, res) => {
  try {
    const response = await authService.registerUser(req.body);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error en register controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  try {
    const response = await authService.loginUser(req.body);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error en login controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { register, login };
