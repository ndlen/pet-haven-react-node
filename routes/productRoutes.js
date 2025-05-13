const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { productDto } = require('../dtos/createRequests/productDto');
const { updateProductDto } = require('../dtos/updateRequests/updateProductDto');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', validate(productDto), productController.createProduct);
router.put('/:id', authenticate, authorize(['admin', 'staff', 'user']), validate(updateProductDto), productController.updateProduct);
router.delete('/:id', authenticate, authorize(['admin']), productController.deleteProduct);

module.exports = router;