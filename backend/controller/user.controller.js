const userService = require('../service/user.service');

const createUser = async (req, res) => {
  try {
    const userData = req.body; // { email, password, ... }
    if (!userData?.email || !userData?.password) {
      return res.status(400).json({ message: 'email y password son requeridos' });
    }
    const response = await userService.createUser(userData);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error en createUser controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const response = await userService.getUserByEmail(email);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error en getUserByEmail controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email } = req.params;
    const userData = req.body;

    const response = await userService.updateUserByEmail(email, userData);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error en updateUser controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  updateUser
};
