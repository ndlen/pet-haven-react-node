const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { appointmentDto } = require('../dtos/createRequests/appointmentDto');
const { updateAppointmentDto } = require('../dtos/updateRequests/updateAppointmentDto');

router.get('/', authenticate, authorize(['admin', 'staff']), appointmentController.getAllAppointments);
router.post('/', authenticate, authorize(['user']), validate(appointmentDto), appointmentController.createAppointment);
router.put('/:id', authenticate, authorize(['admin', 'staff']), validate(updateAppointmentDto), appointmentController.updateAppointment);
router.delete('/:id', authenticate, authorize(['admin']), appointmentController.deleteAppointment);

module.exports = router;