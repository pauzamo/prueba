// backend/index.js
const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();
require('./config/db.js'); // tu pool de DB
const { specs, swaggerUi } = require('./config/swagger.config');

const authRoutes = require('./routes/auth.routes.js');
const bookRoutes = require('./routes/book.routes.js');
const userRoutes = require('./routes/user.routes.js');
const checkoutRoutes = require('./routes/checkout.routes.js');
// const aiGeminiRoutes = require('./routes/aiGemini.routes'); // si aplica

const app = express();
const PORT = process.env.PORT || 3000;

// CORS (incluye FE local y FE en EC2)
app.use(cors({
  origin: ['http://localhost:4200', 'http://13.216.111.250', 'http://13.216.111.250:4200'],
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, sameSite: 'lax' }
}));

app.get('/', (_req, res) => res.send('¡Backend funcionando con CommonJS! 🚀'));

// Rutas de la app
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/user', userRoutes);      // 👈 SINGULAR /api/user
app.use('/api/checkout', checkoutRoutes);
// app.use('/api/ai', aiGeminiRoutes); // si aplica

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API Documentation",
  swaggerOptions: { persistAuthorization: true }
}));
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// ---------- OIDC / Cognito ----------
let oidc = { client: null };

(async () => {
  try {
    const openid = await import('openid-client');
    const { Issuer, generators } = openid.default || openid;

    const COGNITO_ISSUER = process.env.COGNITO_ISSUER; // ej: https://cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXX
    const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
    const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;
    const REDIRECT_URI = process.env.OIDC_REDIRECT_URI || 'http://13.216.111.250:3000/callback';
    const POST_LOGOUT_URI = process.env.OIDC_POST_LOGOUT_URI || 'http://13.216.111.250:4200/login';
    const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN; // miapp.auth.us-east-1.amazoncognito.com

    const issuer = await Issuer.discover(COGNITO_ISSUER);
    oidc.client = new issuer.Client({
      client_id: COGNITO_CLIENT_ID,
      client_secret: COGNITO_CLIENT_SECRET,
      redirect_uris: [REDIRECT_URI],
      response_types: ['code']
    });

    console.log('Cognito client inicializado');

    app.get('/login', (req, res) => {
      const codeVerifier = generators.codeVerifier();
      const codeChallenge = generators.codeChallenge(codeVerifier);
      req.session.codeVerifier = codeVerifier;

      const url = oidc.client.authorizationUrl({
        scope: 'openid email profile',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        redirect_uri: REDIRECT_URI
      });
      res.redirect(url);
    });

    app.get('/callback', async (req, res) => {
      try {
        if (!req.session || !req.session.codeVerifier) {
          return res.status(400).send('CodeVerifier no encontrado en sesión');
        }
        const params = oidc.client.callbackParams(req);
        const tokenSet = await oidc.client.callback(
          REDIRECT_URI,
          params,
          { code_verifier: req.session.codeVerifier }
        );
        req.session.tokenSet = tokenSet;
        const claims = tokenSet.claims(); // debe traer 'email'
        const email = encodeURIComponent(claims?.email || '');
        // Redirigimos al FE con el email
        res.redirect(`http://13.216.111.250:4200/home?email=${email}`);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en callback de Cognito' });
      }
    });

    app.get('/logout', (req, res) => {
      req.session.destroy(() => {
        if (!COGNITO_DOMAIN) {
          return res.status(500).send('COGNITO_DOMAIN no configurado');
        }
        const logoutUrl =
          `https://${COGNITO_DOMAIN}/logout?client_id=${encodeURIComponent(oidc.client.metadata.client_id)}&logout_uri=${encodeURIComponent(POST_LOGOUT_URI)}`;
        res.redirect(logoutUrl);
      });
    });

  } catch (err) {
    console.error('❌ Error cargando openid-client (OIDC deshabilitado):', err.message);
  } finally {
    app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
  }
})();
