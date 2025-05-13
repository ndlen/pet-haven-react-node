const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { createOrderDto } = require('../dtos/createRequests/createOrderDto');
const { updateOrderDto } = require('../dtos/updateRequests/updateOrderDto');

router.get('/', authenticate, authorize(['admin', 'staff']), orderController.getAllOrders);
router.get('/my-orders', authenticate, authorize(['user']), orderController.getOrdersByUser);
router.post('/', authenticate, authorize(['admin', 'user']), validate(createOrderDto), orderController.createOrder);
router.put('/:id', authenticate, authorize(['admin', 'staff', 'user']), validate(updateOrderDto), orderController.updateOrder);
router.delete('/:id', authenticate, authorize(['admin']), orderController.deleteOrder);
router.get('/check-payment-status', authenticate, authorize(['user']), orderController.checkPaymentStatus);

module.exports = router;