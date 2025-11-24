const favoritesRepository = require('../repository/favorites.repository');
const authRepository = require('../repository/auth.repository');

const getUserId = async (email) => {
    const user = await authRepository.getUserByEmail(email);
    return user ? user.idUsuario : null;
}

const addFavoriteBook = async (email, libroApiId) => {
  if (!libroApiId) {
    return { status: 400, body: { message: 'ID de libro es requerido' } };
  }

  const idUsuario = await getUserId(email);
  if (!idUsuario) {
    return { status: 404, body: { message: 'Usuario no encontrado en la base de datos local' } };
  }
  
  try {
    await favoritesRepository.addFavorite(idUsuario, libroApiId);
    return { status: 201, body: { message: 'Libro agregado a favoritos' } };
  } catch (error) {
      if (error.code && error.code.includes('UNIQUE')) { 
        return { status: 409, body: { message: 'El libro ya está en favoritos' } };
      }
      console.error('Error al agregar favorito:', error);
      return { status: 500, body: { message: 'Error interno del servidor al agregar favorito' } };
  }
};

const removeFavoriteBook = async (email, libroApiId) => {
  if (!libroApiId) {
    return { status: 400, body: { message: 'ID de libro es requerido' } };
  }

  const idUsuario = await getUserId(email);
  if (!idUsuario) {
    return { status: 404, body: { message: 'Usuario no encontrado en la base de datos local' } };
  }

  const removed = await favoritesRepository.removeFavorite(idUsuario, libroApiId);

  if (removed) {
    return { status: 200, body: { message: 'Libro eliminado de favoritos' } };
  } else {
    return { status: 404, body: { message: 'El libro no estaba en favoritos' } };
  }
};

const getFavoriteBooks = async (email) => {
  const idUsuario = await getUserId(email);
  if (!idUsuario) {
    return { status: 404, body: { message: 'Usuario no encontrado en la base de datos local' } };
  }

  const favoriteApiIds = await favoritesRepository.getFavorites(idUsuario);
  
  return { status: 200, body: { favoriteApiIds } };
};

module.exports = {
  addFavoriteBook,
  removeFavoriteBook,
  getFavoriteBooks
};