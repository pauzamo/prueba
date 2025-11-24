// backend/controller/auth.controllers.js
const authService = require('../service/auth.service');

const registerProfile = async (req, res) => {
  try {
    console.log("---- registerProfile ----");
    console.log("req.user recibido:", req.user);
    console.log("req.body recibido:", req.body);

    const { email, sub } = req.user;
    const data = req.body;

    const response = await authService.registerUserProfile(email, sub, data);

    console.log("Respuesta de registerUserProfile:", response);

    return res.status(response.status).json(response.body);

  } catch (error) {
    console.error('Error en registerProfile:', error);
    return res.status(500).json({ message: 'Error interno en registerProfile' });
  }
};

const getProfile = async (req, res) => {
  try {
    console.log("---- getProfile ----");
    console.log("req.user recibido:", req.user);

    const { email } = req.user;

    const response = await authService.getProfileByEmail(email);

    console.log("Respuesta de getProfileByEmail:", response);

    return res.status(response.status).json(response.body);

  } catch (error) {
    console.error('Error en getProfile:', error);
    return res.status(500).json({ message: 'Error interno en getProfile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log("---- updateProfile ----");
    console.log("req.user recibido:", req.user);
    console.log("req.body recibido:", req.body);

    const { email } = req.user;
    const data = req.body;

    const response = await authService.updateProfile(email, data);

    console.log("Respuesta de updateProfile:", response);

    return res.status(response.status).json(response.body);

  } catch (error) {
    console.error('Error en updateProfile:', error);
    return res.status(500).json({ message: 'Error interno en updateProfile' });
  }
};

module.exports = {
  registerProfile,
  getProfile,
  updateProfile
};
