const { poolPromise, sql } = require('../config/db');

// Obtiene todos los datos de perfil para mostrar en la vista de Perfil
const getUserByEmail = async (email) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('email', sql.VarChar, email)
    .query('SELECT idUsuario, email, nombre, apellido, telefono, direccion, dni FROM Usuarios WHERE email = @email');

  return result.recordset[0];
};

// Crea el perfil de usuario en la DB local después de la autenticación de Cognito
const insertUserProfile = async ({ email, nombre, apellido, telefono, direccion, dni }) => {
  const pool = await poolPromise;
  await pool.request()
    .input('email', sql.VarChar, email)
    .input('nombre', sql.VarChar, nombre)
    .input('apellido', sql.VarChar, apellido)
    .input('telefono', sql.VarChar, telefono)
    .input('direccion', sql.VarChar, direccion)
    .input('dni', sql.VarChar, dni)
    .query(`
      INSERT INTO Usuarios (email, nombre, apellido, telefono, direccion, dni)
      VALUES (@email, @nombre, @apellido, @telefono, @direccion, @dni)
    `);
};

// Para el endpoint de actualizar perfil
const updateUserProfileByEmail = async (email, data) => {
  const pool = await poolPromise;
  const request = pool.request().input('email', sql.VarChar, email);

  // Lógica para construir el UPDATE solo con los campos presentes
  if (data.nombre) request.input('nombre', sql.VarChar, data.nombre);
  if (data.apellido) request.input('apellido', sql.VarChar, data.apellido);
  if (data.telefono) request.input('telefono', sql.VarChar, data.telefono);
  if (data.direccion) request.input('direccion', sql.VarChar, data.direccion);
  if (data.dni) request.input('dni', sql.VarChar, data.dni);
  
  // Si no hay datos para actualizar, retorna false
  if (Object.keys(data).length === 0) return false; 

  const result = await request.query(`
    UPDATE Usuarios
    SET
      nombre = ISNULL(@nombre, nombre),
      apellido = ISNULL(@apellido, apellido),
      telefono = ISNULL(@telefono, telefono),
      direccion = ISNULL(@direccion, direccion),
      dni = ISNULL(@dni, dni)
    WHERE email = @email
  `);

  return result.rowsAffected[0] > 0;
};

module.exports = {
  getUserByEmail,
  insertUserProfile,
  updateUserProfileByEmail
};