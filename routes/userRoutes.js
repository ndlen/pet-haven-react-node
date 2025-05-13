const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { getUpdateUserSchema } = require('../dtos/updateRequests/updateUserDto');

console.log('Loaded userRoutes.js version 2025-05-14');

router.get('/me', authenticate, (req, res, next) => {
    console.log('GET /api/users/me called');
    userController.getCurrentUser(req, res, next);
});

router.get('/', authenticate, authorize(['admin']), (req, res, next) => {
    console.log('GET /api/users called');
    userController.getAllUsers(req, res, next);
});

router.put('/me', authenticate, authorize(['admin', 'staff', 'user']), validate(getUpdateUserSchema), (req, res, next) => {
    console.log('PUT /api/users/me called');
    userController.updateUser(req, res, next);
});

router.put('/:id', authenticate, authorize(['admin']), validate(getUpdateUserSchema), (req, res, next) => {
    console.log(`PUT /api/users/:id called with id: ${req.params.id}`);
    userController.updateUser(req, res, next);
});

router.delete('/:id', authenticate, authorize(['admin']), (req, res, next) => {
    console.log(`DELETE /api/users/:id called with id: ${req.params.id}`);
    userController.deleteUser(req, res, next);
});

module.exports = router;