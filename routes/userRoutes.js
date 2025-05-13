const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { getUpdateUserSchema } = require('../dtos/updateRequests/updateUserDto');

router.get('/', userController.getAllUsers);
router.get('/me', authenticate, userController.getCurrentUser);
router.get('/:id', authenticate, authorize(['admin']), userController.getUserById);
router.put('/:id', authenticate, authorize(['admin']), validate(getUpdateUserSchema), userController.updateUser);
// router.put('/me', authenticate, validate(getUpdateUserSchema), userController.updateUser);
router.delete('/:id', authenticate, authorize(['admin']), userController.deleteUser);

router.put('/me', (req, res, next) => {
    console.log("Entering PUT /api/users/me");
    next();
}, authenticate, validate(getUpdateUserSchema), (req, res, next) => {
    console.log("After validate, before updateUser:", req.user);
    next();
}, userController.updateUser);

module.exports = router;