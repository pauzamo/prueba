// Importaciones
const express = require('express');
require('dotenv').config();
const session = require('express-session');
const cors = require('cors');
require('./config/db.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:4200'],
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, sameSite: 'lax' }
}));

app.get('/', (req, res) => res.send('Backend OK + Cognito'));

// ---------- COGNITO ----------
(async () => {
  try {
    const { Issuer, generators } = require('openid-client');

    const issuer = await Issuer.discover(
      `https://cognito-idp.us-east-1.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`
    );

    const client = new issuer.Client({
      client_id: process.env.COGNITO_CLIENT_ID,
      client_secret: process.env.COGNITO_CLIENT_SECRET, // AGRÉGALO AL .env
      redirect_uris: ['http://localhost:4200/login'],
      response_types: ['code']
    });

    console.log('✅ Cognito client inicializado con', client.metadata.client_id);

    // LOGIN
    app.get('/login', (req, res) => {
      const codeVerifier = generators.codeVerifier();
      const codeChallenge = generators.codeChallenge(codeVerifier);

      req.session.codeVerifier = codeVerifier;

      const url = client.authorizationUrl({
        scope: 'openid email',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
      });

      console.log('Auth URL =>', url);   // 👈 VER ACÁ EL client_id
      res.redirect(url);
    });

    // CALLBACK
  app.get('/callback', async (req, res) => {
  try {
    if (!req.session || !req.session.codeVerifier) {
      return res.status(400).send('No hay codeVerifier en sesión');
    }

    const params = client.callbackParams(req);

    const tokenSet = await client.callback(
      'http://localhost:4200/login',
      params,
      { code_verifier: req.session.codeVerifier }
    );

    req.session.tokenSet = tokenSet;
    return res.json({ message: 'Login OK', token: tokenSet });
  } catch (err) {
    console.error('Error en /callback:');
    console.error('message:', err.message);
    if (err.response && err.response.data) {
      console.error('response.data:', err.response.data);
    }
    return res.status(500).json({ error: 'Error en callback' });
  }
});

    // LOGOUT
    app.get('/logout', (req, res) => {
      req.session.destroy(() => {
        const cognitoDomain = 'us-east-1vvt9jn1br.auth.us-east-1.amazoncognito.com';
        const logoutRedirectUri = 'http://localhost:4200/login';

        const logoutUrl =
          `https://${cognitoDomain}/logout?` +
          `client_id=${process.env.COGNITO_CLIENT_ID}&` +
          `logout_uri=${encodeURIComponent(logoutRedirectUri)}`;

        res.redirect(logoutUrl);
      });
    });

    // Rutas API
    const authRoutes = require('./routes/auth.routes.js');
    const favoritesRoutes = require('./routes/favorites.routes.js');
    const bookRoutes = require('./routes/book.routes.js');
    const checkoutRoutes = require('./routes/checkout.routes.js');
    const aiGeminiRoutes = require('./routes/aiGemini.routes.js');

    app.use('/api/auth', authRoutes);
    app.use('/api/favorites', favoritesRoutes);
    app.use('/api/books', bookRoutes);
    app.use('/api/checkout', checkoutRoutes);
    app.use('/api/ai', aiGeminiRoutes);

    app.listen(PORT, () =>
      console.log(`Servidor en http://localhost:${PORT}`)
    );

  } catch (e) {
    console.error('❌ Error Cognito:', e);
    process.exit(1);
  }
})();
