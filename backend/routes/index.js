const express = require('express');
const router = express.Router();
const { signup, login, authenticate } = require('../controllers/authController');

// Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/authenticate', authenticate);
module.exports = router;
