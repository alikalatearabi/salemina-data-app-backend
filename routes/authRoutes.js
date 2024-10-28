// routes/authRoutes.js
const express = require('express');
const { registerUser, authUser, refreshToken } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/refresh-token', refreshToken);

module.exports = router;
