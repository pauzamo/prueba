// Importaciones
const express = require('express');
require('dotenv').config();
const session = require('express-session');
const cors = require('cors');
require('./config/db.js');

// Rutas
const authRoutes = require('./routes/auth.routes.js');
const favoritesRoutes = require('./routes/favorites.routes.js');
const bookRoutes = require('./routes/book.routes.js');
const checkoutRoutes = require('./routes/checkout.routes.js');
const aiGeminiRoutes = require('./routes/aiGemini.routes.js');

// App
const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(cors({
  origin: [
    'http://localhost:4200',
    // 'https://main.d17jgtfjujlttk.amplifyapp.com'
  ],
  credentials: true
}));

// JSON + Session
app.use(express.json());
app.use(session({
  secret: 'some secret',              // ideal: process.env.SESSION_SECRET
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, sameSite: 'lax' } // HTTP local
}));

// Ruta de prueba
app.get('/', (req, res) => res.send('¡Backend funcionando con Cognito! 🚀'));

// ---------- BLOQUE COGNITO ----------
(async () => {
  try {
    // Import openid-client dentro del bloque
    const { Issuer, generators } = require('openid-client');

    if (!Issuer || !generators) {
      throw new Error('openid-client no exportó Issuer o generators');
    }

    // 1) Descubrir ISSUER de Cognito (User Pool ID)
    const issuer = await Issuer.discover(
      'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_vvT9JN1bR'
    );

    // 2) Configurar cliente OIDC
    const client = new issuer.Client({
      client_id: '3nfpcp4h6gp49cet4qhgtihug0',
      client_secret: '1p72b463e88tjp1oqkjpddc7nri0024ne5bi52poqdvfqsov9q60',
      redirect_uris: ['http://localhost:4200/login'], // igual que en Cognito
      response_types: ['code']
    });

    console.log('✅ Cognito client inicializado');

    // 3) LOGIN: inicia flujo PKCE
    app.get('/login', (req, res) => {
      const codeVerifier = generators.codeVerifier();
      const codeChallenge = generators.codeChallenge(codeVerifier);

      req.session.codeVerifier = codeVerifier;

      const url = client.authorizationUrl({
        scope: 'openid email phone',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
      });

      res.redirect(url);
    });

    // 4) CALLBACK: intercambia code por tokens
    app.get('/callback', async (req, res) => {
      try {
        if (!req.session || !req.session.codeVerifier) {
          return res.status(400).send('No hay codeVerifier en sesión');
        }

        const params = client.callbackParams(req);

        const tokenSet = await client.callback(
          'http://localhost:4200/login',   // mismo redirect_uri configurado
          params,
          { code_verifier: req.session.codeVerifier }
        );

        req.session.tokenSet = tokenSet;

        res.json({
          message: 'Login exitoso con Cognito ✅',
          token: tokenSet
        });

      } catch (err) {
        console.error('Error en /callback:', err);
        res.status(500).json({ error: 'Error en callback' });
      }
    });

    // 5) LOGOUT
    app.get('/logout', (req, res) => {
      req.session.destroy(() => {
        const cognitoDomain = 'https://us-east-1vvt9jn1br.auth.us-east-1.amazoncognito.com';

        const logoutRedirectUri = 'http://localhost:4200/login';

        const logoutUrl =
          `https://${cognitoDomain}/logout?` +
          `client_id=3nfpcp4h6gp49cet4qhgtihug0&` +
          `logout_uri=${encodeURIComponent(logoutRedirectUri)}`;

        res.redirect(logoutUrl);
      });
    });

    // 6) APIs
    app.use('/api/auth', authRoutes);
    app.use('/api/favorites', favoritesRoutes);
    app.use('/api/books', bookRoutes);
    app.use('/api/checkout', checkoutRoutes);
    app.use('/api/ai', aiGeminiRoutes);

    // 7) Levantar servidor
    app.listen(PORT, () =>
      console.log(`Servidor escuchando en http://localhost:${PORT}`)
    );

  } catch (err) {
    console.error('❌ Error cargando openid-client:', err);
    process.exit(1);
  }
})();
