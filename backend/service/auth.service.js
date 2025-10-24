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

  // Si el usuario existe, pero su campo 'password' está vacío o es un placeholder 
  // (es decir, fue creado por OIDC), no permitimos el login local.
  // Esto previene que usuarios de OIDC intenten loguearse con contraseña.
  if (!user.password || user.password.length < 5) {
     return { status: 401, body: { message: 'Usa el inicio de sesión federado.' } };
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

  return { status: 200, body: { message: 'Login exitoso', token, idUsuario: user.id } }; // Asegúrate de usar user.id
};

/**
 * Busca un usuario por email o lo crea si no existe (flujo OIDC).
 * @param {object} data - Contiene el email del usuario de Cognito.
 * @returns {object} {status, body: {user}}
 */
const findOrCreateUserByEmail = async ({ email }) => {
    try {
        // 1. Buscar usuario por Email
        let user = await authRepository.getUserByEmail(email);

        if (!user) {
            // 2. Si no existe, crear un nuevo registro
            // Proporciona valores predeterminados seguros para todos los campos requeridos en tu tabla SQL
            const newUserData = {
                email: email,
                // 🚨 CRÍTICO: El campo password debe ser insertado, pero con un valor seguro
                // que indique que este usuario es de OIDC y no tiene login local.
                password: '', 
                nombre: 'Usuario', 
                apellido: 'Federado',
                telefono: '0', 
                direccion: 'N/A', 
                dni: '0',
                // Añade cualquier otra columna obligatoria aquí
            };
            
            // Asumimos que insertUser devuelve el objeto de usuario creado (incluyendo el ID)
            user = await authRepository.insertUser(newUserData);
        }
        
        // Retorna el usuario encontrado o recién creado
        return { 
            status: 200, 
            body: { user } 
        };

    } catch (error) {
        console.error('Error en findOrCreateUserByEmail service:', error);
        return { 
            status: 500, 
            body: { message: 'Error interno del servidor al procesar el usuario OIDC.' } 
        };
    }
};

module.exports = { registerUser, loginUser, findOrCreateUserByEmail }; // 👈 NUEVA FUNCIÓN EXPORTADA
