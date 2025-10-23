const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repository/auth.repository');

const registerUser = async (data) => {
  const { email, password, nombre, apellido, telefono, direccion, dni } = data;

  if (!email || !password || !nombre || !apellido || !telefono || !direccion || !dni) {
    return { status: 400, body: { message: 'Todos los campos son requeridos' } };
  }

  const existe = await authRepository.getUserByEmail(email);
  if (existe) {
    return { status: 409, body: { message: 'El usuario ya existe' } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await authRepository.insertUser({ email, password: hashedPassword, nombre, apellido, telefono, direccion, dni });

  return { status: 201, body: { message: 'Usuario registrado con éxito' } };
};

const loginUser = async ({ email, password }) => {
  const user = await authRepository.getUserByEmail(email);

  if (!user) {
    return { status: 401, body: { message: 'Credenciales incorrectas' } };
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return { status: 401, body: { message: 'Credenciales incorrectas' } };
  }

  const token = jwt.sign(
    { email: user.email, nombre: user.nombre, id: user.id },
    'secreto123',
    { expiresIn: '1h' }
  );

  return { status: 200, body: { message: 'Login exitoso', token, idUsuario: user.idUsuario } };
};

module.exports = { registerUser, loginUser };
