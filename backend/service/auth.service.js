const authRepository = require('../repository/auth.repository');

const registerUserProfile = async (data) => {
  const { email, nombre, apellido, telefono, direccion, dni } = data;

  if (!email || !nombre || !apellido || !telefono || !direccion || !dni) {
    return { status: 400, body: { message: 'Todos los campos de perfil son requeridos' } };
  }

  const existe = await authRepository.getUserByEmail(email);
  if (existe) {
    // Si Cognito ya autenticó, solo necesitamos el perfil. Si ya existe, es éxito.
    return { status: 200, body: { message: 'El perfil de usuario ya existe', user: existe } };
  }
  
  await authRepository.insertUserProfile({ email, nombre, apellido, telefono, direccion, dni });

  // Se busca el ID del usuario recién creado para devolverlo
  const newUser = await authRepository.getUserByEmail(email);

  return { status: 201, body: { message: 'Perfil de usuario registrado con éxito', user: newUser } };
};

// Obtener Perfil: se usa cuando el usuario ya autenticado necesita sus datos locales.
const getProfileByEmail = async (email) => {
  const user = await authRepository.getUserByEmail(email);

  if (!user) {
    return { status: 404, body: { message: 'Perfil de usuario no encontrado. Complete su registro de perfil.' } };
  }

  return { status: 200, body: { message: 'Perfil de usuario obtenido con éxito', user } };
};

// Actualizar Perfil
const updateProfile = async (email, data) => {
  const updated = await authRepository.updateUserProfileByEmail(email, data);

  if (updated) {
    return { status: 200, body: { message: 'Perfil actualizado con éxito' } };
  } else {
    // Si no se actualizó, puede ser porque no se encontró el email o no hubo cambios
    const userExists = await authRepository.getUserByEmail(email);
    if (!userExists) {
        return { status: 404, body: { message: 'Usuario no encontrado.' } };
    }
    return { status: 200, body: { message: 'Perfil sin cambios' } };
  }
}

module.exports = { 
    registerUserProfile, 
    getProfileByEmail,
    updateProfile
};