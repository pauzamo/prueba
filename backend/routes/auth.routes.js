const express = require('express');
const { registerProfile, getProfile, updateProfile } = require('../controller/auth.controllers');
const authenticateCognito = require('../middleware/cognitoAuth.middleware');

const router = express.Router();

router.post('/register-profile', registerProfile); 

router.post('/profile', getProfile); 

router.put('/profile', authenticateCognito, updateProfile); 

module.exports = router;