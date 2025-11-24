// backend/service/auth.service.js
const authRepository = require('../repository/auth.repository');

// Crear perfil local
const registerUserProfile = async (email, sub, data) => {
  const { nombre, apellido, telefono, direccion, dni } = data;

  // SOLO exigimos email (del token Cognito)
  if (!email) {
    return { status: 400, body: { message: 'Email requerido' } };
  }

  // Si ya existe perfil → OK
  const existe = await authRepository.getUserByEmail(email);
  if (existe) {
    return { status: 200, body: { message: 'El perfil ya existe', user: existe } };
  }

  // Crear perfil nuevo con datos parciales o vacíos
  await authRepository.insertUserProfile({
    email,
    cognitoSub: sub,
    nombre: nombre || null,
    apellido: apellido || null,
    telefono: telefono || null,
    direccion: direccion || null,
    dni: dni || null
  });

  const newUser = await authRepository.getUserByEmail(email);

  return {
    status: 201,
    body: { message: 'Perfil registrado con éxito', user: newUser }
  };
};

// Obtener perfil
const getProfileByEmail = async (email) => {
  const user = await authRepository.getUserByEmail(email);

  if (!user) {
    return {
      status: 404,
      body: { message: 'Perfil no encontrado. Complete su registro.' }
    };
  }

  return {
    status: 200,
    body: { message: 'Perfil obtenido con éxito', user }
  };
};

// Actualizar perfil
const updateProfile = async (email, data) => {
  const updated = await authRepository.updateUserProfileByEmail(email, data);

  if (updated) {
    return { status: 200, body: { message: 'Perfil actualizado con éxito' } };
  } else {
    const userExists = await authRepository.getUserByEmail(email);
    if (!userExists) {
      return { status: 404, body: { message: 'Usuario no encontrado.' } };
    }
    return { status: 200, body: { message: 'Perfil sin cambios' } };
  }
};

module.exports = {
  registerUserProfile,
  getProfileByEmail,
  updateProfile
};
