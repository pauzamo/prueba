const sql = require('mssql');
const db = require('../config/db'); // tu config de conexión

const getUserByEmail = async (email) => {
  const pool = await db.getConnection();
  const result = await pool.request()
    .input('email', sql.VarChar, email)
    .query('SELECT * FROM Usuarios WHERE email = @email');
  return result.recordset[0] || null;
};

const insertUserProfile = async (user) => {
  const pool = await db.getConnection();
  await pool.request()
    .input('email', sql.VarChar, user.email)
    .input('cognitoSub', sql.VarChar, user.cognitoSub)
    .input('nombre', sql.VarChar, user.nombre)
    .input('apellido', sql.VarChar, user.apellido)
    .input('telefono', sql.VarChar, user.telefono)
    .input('direccion', sql.VarChar, user.direccion)
    .input('dni', sql.VarChar, user.dni)
    .query(`
      INSERT INTO Usuarios (email, cognitoSub, nombre, apellido, telefono, direccion, dni)
      VALUES (@email, @cognitoSub, @nombre, @apellido, @telefono, @direccion, @dni)
    `);
};

const updateUserProfileByEmail = async (email, data) => {
  const pool = await db.getConnection();
  const result = await pool.request()
    .input('email', sql.VarChar, email)
    .input('nombre', sql.VarChar, data.nombre)
    .input('apellido', sql.VarChar, data.apellido)
    .input('telefono', sql.VarChar, data.telefono)
    .input('direccion', sql.VarChar, data.direccion)
    .input('dni', sql.VarChar, data.dni)
    .query(`
      UPDATE Usuarios
      SET nombre = @nombre,
          apellido = @apellido,
          telefono = @telefono,
          direccion = @direccion,
          dni = @dni
      WHERE email = @email
    `);

  return result.rowsAffected[0] > 0;
};

module.exports = {
  getUserByEmail,
  insertUserProfile,
  updateUserProfileByEmail
};
