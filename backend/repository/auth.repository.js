const { poolPromise, sql } = require('../config/db');

const getUserByEmail = async (email) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM Usuarios WHERE email = @email');

    // ⚠️ REVISIÓN: Devuelve el primer registro o null si no hay ninguno.
    return result.recordset.length > 0 ? result.recordset[0] : null;
};

const insertUser = async ({ email, password, nombre, apellido, telefono, direccion, dni }) => {
    const pool = await poolPromise;
    
    // 1. Ejecutamos la consulta para devolver el registro insertado (incluyendo el ID)
    const result = await pool.request()
        .input('email', sql.VarChar, email)
        .input('password', sql.VarChar, password)
        .input('nombre', sql.VarChar, nombre)
        .input('apellido', sql.VarChar, apellido)
        .input('telefono', sql.VarChar, telefono)
        .input('direccion', sql.VarChar, direccion)
        .input('dni', sql.VarChar, dni)
        .query(`
            INSERT INTO Usuarios (email, password, nombre, apellido, telefono, direccion, dni, fecha_registro) 
            OUTPUT INSERTED.* VALUES (@email, @password, @nombre, @apellido, @telefono, @direccion, @dni, GETDATE()) 
        `);
    
    // 2. ⚠️ NUEVA LÍNEA: La cláusula OUTPUT devuelve el nuevo registro en recordset[0]
    if (result.recordset && result.recordset.length > 0) {
        return result.recordset[0];
    }

    throw new Error('Fallo al obtener el registro del nuevo usuario insertado.');
};

const updateUserByEmail = async (email, data) => {
    const pool = await poolPromise;
    const request = pool.request().input('email', sql.VarChar, email);

    if (data.nombre) request.input('nombre', sql.VarChar, data.nombre);
    if (data.apellido) request.input('apellido', sql.VarChar, data.apellido);
    if (data.telefono) request.input('telefono', sql.VarChar, data.telefono);
    if (data.direccion) request.input('direccion', sql.VarChar, data.direccion);
    if (data.dni) request.input('dni', sql.VarChar, data.dni);

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
    insertUser,
    updateUserByEmail
};
