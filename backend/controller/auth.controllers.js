const authService = require('../service/auth.service');
const axios = require('axios'); // Asegúrate de instalar esta dependencia
const qs = require('querystring'); // Para codificar el cuerpo de la petición


const COGNITO_CLIENT_ID = '2k8b23s30om1ottpre3pm1tmr5'; 
const COGNITO_CLIENT_SECRET = 'flsl0qhh8hhth87hjk3joan1eh7rkjejsrelpr12ttvbapd0l4d'; 
const COGNITO_TOKEN_ENDPOINT = 'https://us-east-1-cdjiudhc.auth.us-east-1.amazoncognito.com/oauth2/token';
const REDIRECT_URI = 'https://13.215.111.250/callback'; // Debe coincidir con Cognito

const register = async (req, res) => {
  try {
    const response = await authService.registerUser(req.body);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error en register controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  try {
    const response = await authService.loginUser(req.body);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error en login controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const exchangeCode = async (req, res) => {
    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({ message: 'Falta el código de autorización OIDC.' });
    }

    try {
        // 1. Datos que se envían a Cognito
        const requestBody = {
            grant_type: 'authorization_code',
            client_id: COGNITO_CLIENT_ID,
            code: code,
            redirect_uri: REDIRECT_URI
        };

        // 2. Codificación de las credenciales para Basic Authentication (Client ID:Client Secret)
        const clientCredentials = Buffer.from(`${COGNITO_CLIENT_ID}:${COGNITO_CLIENT_SECRET}`).toString('base64');

        // 3. Llamada al Endpoint de Token de Cognito
        const response = await axios.post(
            COGNITO_TOKEN_ENDPOINT,
            qs.stringify(requestBody), // Envía los datos como x-www-form-urlencoded
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${clientCredentials}` // Usa las credenciales secretas
                }
            }
        );

        const tokens = response.data;
        const idToken = tokens.id_token;

        // 2. Decodificar el ID Token para obtener la identidad del usuario
        const decodedToken = jwt.decode(idToken);
        const userEmail = decodedToken.email;

        if (!userEmail) {
             return res.status(401).json({ message: 'ID Token de Cognito no contiene el email.' });
        }

        // 3. Buscar/Crear usuario local en tu base de datos (SQL Server)
        // El servicio de autenticación debe manejar la lógica SQL.
        let user;
        const userLookupResponse = await authService.findOrCreateUserByEmail({ email: userEmail });
        
        if (userLookupResponse.status !== 200) {
             return res.status(500).json({ message: 'Fallo al procesar el usuario local.' });
        }
        // Asumiendo que tu objeto de usuario SQL usa 'id' como identificador
        user = userLookupResponse.body.user;

        // 4. Crear un token JWT propio para la sesión de tu aplicación (Bibliapp)
        const appToken = jwt.sign(
            { id: user.id, email: user.email }, // 👈 Usamos user.id en lugar de user._id
            JWT_SECRET, 
            { expiresIn: '7d' } 
        );

        // 5. Devolver el token local a la aplicación frontend
        return res.status(200).json({ 
            message: 'Autenticación con Cognito exitosa.',
            token: appToken, // Este es el token que el frontend debe guardar y usar
            user: { email: user.email, id: user.id } // 👈 Usamos user.id en la respuesta
        });

    } catch (error) {
        console.error('Error durante el intercambio de código con Cognito:', error.response ? error.response.data : error.message);
        // Devolver error amigable al frontend
        return res.status(500).json({ message: 'Fallo en la autenticación OIDC.' });
    }
};

module.exports = { register, login, exchangeCode };

