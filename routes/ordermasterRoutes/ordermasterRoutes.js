// routes/ordermasterRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../../controller/orderMasterController/orderMasterController');

// Driver Routes
router.post('/drivers/login', orderController.loginDriver);
router.post('/drivers/register', orderController.registerDriver);
router.get('/drivers', orderController.getAllDrivers);
router.get('/drivers/availability/:isAvailable', orderController.getDriversByAvailability);

// Customers Routes
router.get('/customers', orderController.getAllCustomers);
router.post('/customers/create', orderController.createCustomer);

// Order Routes
router.post('', orderController.createOrder);
router.get('/:orderId', orderController.getOrderDetails);
router.post('/assign-driver', orderController.assignDriverToOrder);
router.patch('/:orderId/status', orderController.updateOrderStatus);





module.exports = router;
