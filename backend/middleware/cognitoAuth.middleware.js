require('dotenv').config();
const { CognitoJwtVerifier } = require("aws-jwt-verify"); 

// Se inicializa el verificador usando las variables de entorno
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: process.env.COGNITO_TOKEN_USE, 
  clientId: process.env.COGNITO_CLIENT_ID,
});

const authenticateCognito = async (req, res, next) => {
  console.log('AUTH HEADER:', req.headers.authorization);
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await verifier.verify(token); 
    
    const email = payload.email || payload['cognito:username'] || payload.username;
    
    if (!email) {
        return res.status(401).json({ message: 'Token inválido: falta información de identidad (email/username).' });
    }
    
    req.user = { 
        email: email, 
        sub: payload.sub 
    }; 
    
    next();
  } catch (error) {
    console.error('Error de validación de token de Cognito:', error.message);
    return res.status(401).json({ message: 'Token de autenticación inválido o expirado.' });
  }
};

module.exports = authenticateCognito;