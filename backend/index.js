// index.js
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
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, sameSite: 'lax' }
}));

// Ruta de prueba
app.get('/', (req, res) => res.send('¡Backend funcionando con CommonJS! 🚀'));

// ---------- Cargamos openid-client dinámicamente ----------
(async () => {
  try {
    // 👇 FIX: obtener el default export
    const openid = await import('openid-client');
    const { Issuer, generators } = openid.default || openid;

    // Cognito OpenID Client
    const issuer = await Issuer.discover(
      'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_dvurIkHLe'
    );

    const client = new issuer.Client({
      client_id: '1951tqfvb7fakucpruls1e1875',
      client_secret: '220il2krtt5hgp1q0b1903vj492gtqnhigp04733cj4bmui15b7',
      redirect_uris: ['https://13.216.111.250/callback'],
      response_types: ['code']
    });

    console.log('✅ Cognito client inicializado');

    // ---------- Rutas Cognito ----------
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

    app.get('/callback', async (req, res) => {
      try {
        if (!req.session || !req.session.codeVerifier) {
          return res.status(400).send('CodeVerifier no encontrado en sesión');
        }

        const params = client.callbackParams(req);
        const tokenSet = await client.callback(
          'https://13.216.111.250/callback',
          params,
          { code_verifier: req.session.codeVerifier }
        );

        req.session.tokenSet = tokenSet;
        res.json({ message: 'Login exitoso con Cognito ✅', token: tokenSet });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en callback de Cognito' });
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