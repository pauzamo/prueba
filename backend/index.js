const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('./config/db.js');
const { specs, swaggerUi } = require('./config/swagger.config');

const authRoutes = require('./routes/auth.routes.js');
const bookRoutes = require('./routes/book.routes.js');
const userRoutes = require('./routes/user.routes.js');
const checkoutRoutes = require('./routes/checkout.routes.js');
const aiGeminiRoutes = require('./routes/aiGemini.routes');

const app = express();
const PORT = 3000;

// Middleware
// ⚠️ Nota: Cambiado el origen a la IP de tu EC2 para consistencia
app.use(cors({ origin: ['http://localhost:4200', 'https://13.215.111.250'], credentials: true }));
app.use(express.json());
app.use(session({
	secret: 'some secret',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: true, sameSite: 'lax' } // 'secure: true' recomendado para HTTPS
}));

// Ruta de prueba
app.get('/', (req, res) => res.send('¡Backend funcionando con CommonJS! 🚀'));

// ---------- Cargamos openid-client dinámicamente ----------
(async () => {
	try {
		// 👇 FIX: obtener el default export
		const openid = await import('openid-client');
		const { Issuer, generators } = openid.default || openid;
		
		// 🚨 Importamos el controlador de auth para acceder a la lógica de intercambio OIDC/DB
		const authController = require('./controller/auth.controllers.js');

		// Cognito OpenID Client
		const issuer = await Issuer.discover(
			'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_CdJiudHxQ'
		);

		// ⚠️ IMPORTANTE: Client ID y Secret deben ir en variables de entorno o un archivo de config.
		const client = new issuer.Client({
			client_id: '1bimmt2aaat9brr3pb2ssf4fpa',
			client_secret: '15rij2gb7t7kicd92jonrnhr3dd101mnm1bsstk2s0vo8ssk8ggp',
			// Usamos la IP de la EC2 para el backend
			redirect_uris: ['https://13.216.111.250/callback'], 
			response_types: ['code']
		});

		console.log('✅ Cognito client inicializado');

		// ---------- Rutas Cognito de redirección ----------
		// 1. Ruta que inicia el flujo OIDC
		app.get('/login', (req, res) => {
			const codeVerifier = generators.codeVerifier();
			const codeChallenge = generators.codeChallenge(codeVerifier);
			req.session.codeVerifier = codeVerifier;

			const url = client.authorizationUrl({
				scope: 'openid email profile',
				code_challenge: codeChallenge,
				code_challenge_method: 'S256',
			});

			res.redirect(url);
		});

		// 2. Ruta de callback de Cognito (¡La más importante!)
		app.get('/callback', async (req, res) => {
			try {
				if (!req.session || !req.session.codeVerifier) {
					return res.status(400).send('CodeVerifier no encontrado en sesión');
				}

				const params = client.callbackParams(req);
				
				// 🚨 2.1. Intercambio de Código por Tokens con Cognito
				const tokenSet = await client.callback(
					'https://13.216.111.250/callback', // Asegúrate que esta URL coincida con la de Cognito
					params,
					{ code_verifier: req.session.codeVerifier }
				);

				// Limpiar el verifier después de usarlo
				delete req.session.codeVerifier;

				const idToken = tokenSet.id_token;
				
				// 🚨 2.2. Usamos el controlador interno para procesar el token y generar el token de sesión de la app.
				// Nota: Usamos el ID Token porque contiene el email del usuario
				const internalResponse = await authController.processOidcLogin(idToken);
				
				if (internalResponse.status !== 200) {
					throw new Error('Error interno al crear sesión');
				}

				// 🚨 2.3. Redirigir al frontend de Angular y pasar el token JWT de la aplicación
				// El frontend Angular en la ruta '/auth/callback' debe capturar este token JWT del query.
				res.redirect(`http://localhost:4200/auth/callback?token=${internalResponse.body.token}`);
				
			} catch (err) {
				console.error('Error en callback de Cognito:', err);
				// Redirigir a la página de login con un mensaje de error
				res.redirect(`http://localhost:4200/login?error=auth_failed`);
			}
		});

		// Rutas internas de tu app
		app.use('/api/auth', authRoutes);
		app.use('/api/books', bookRoutes);
		app.use('/api/user', userRoutes);
		app.use('/api/checkout', checkoutRoutes);
		app.use('/api/ai', aiGeminiRoutes);

		// Iniciar servidor después de Cognito
		app.listen(PORT, () =>
			console.log(`Servidor escuchando en http://localhost:${PORT}`)
		);

	} catch (err) {
		console.error('❌ Error cargando openid-client:', err);
	}
})();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
	explorer: true,
	customCss: '.swagger-ui .topbar { display: none }',
	customSiteTitle: "API Documentation",
	swaggerOptions: {
		persistAuthorization: true, // Mantiene el token JWT entre recargas
	}
}));

app.get('/api-docs.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(specs);
});
