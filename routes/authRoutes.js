const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { loginDto } = require('../dtos/createRequests/loginDto');
const { userDto } = require('../dtos/createRequests/userDto');

router.post('/register', validate(userDto), authController.register);
router.post('/login', validate(loginDto), authController.login);
router.get('/verify-email', authController.verifyEmail);

module.exports = router;