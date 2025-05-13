const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { serviceDto } = require('../dtos/createRequests/serviceDto');
const { updateServiceDto } = require('../dtos/updateRequests/updateServiceDto');

router.get('/', serviceController.getAllServices);
router.get('/:id', authenticate, authorize(['user', 'staff', 'admin']), serviceController.getServiceById);
router.post('/', validate(serviceDto), serviceController.createService);
router.put('/:id', authenticate, authorize(['admin', 'staff']), validate(updateServiceDto), serviceController.updateService);
router.delete('/:id', authenticate, authorize(['admin']), serviceController.deleteService);

module.exports = router;