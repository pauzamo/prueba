// backend/repository/favorites.repository.js
const { poolPromise, sql } = require('../config/db');

const addFavorite = async (idUsuario, libroApiId) => {
  const pool = await poolPromise;
  await pool.request()
    .input('idUsuario', sql.Int, idUsuario)
    .input('libroApiId', sql.VarChar, libroApiId)
    .query(`
      INSERT INTO Favoritos (idUsuario, libroApiId)
      VALUES (@idUsuario, @libroApiId)
    `);
};

const removeFavorite = async (idUsuario, libroApiId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('idUsuario', sql.Int, idUsuario)
    .input('libroApiId', sql.VarChar, libroApiId)
    .query(`
      DELETE FROM Favoritos
      WHERE idUsuario = @idUsuario AND libroApiId = @libroApiId
    `);
    
    return result.rowsAffected[0] > 0;
};

const getFavorites = async (idUsuario) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('idUsuario', sql.Int, idUsuario)
    .query('SELECT libroApiId FROM Favoritos WHERE idUsuario = @idUsuario');

  // Retorna un array con solo los IDs de la API para que el frontend los busque
  return result.recordset.map(record => record.libroApiId);
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites
};