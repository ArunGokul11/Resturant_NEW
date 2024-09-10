const express = require('express');
const router = express.Router();
const customerController = require('../../controller/customer/customerController');
const userAuthMiddleware = require('../../middleware/userAuthMiddleware')



// Customers Routes
router.get('', customerController.getAllCustomers);
router.post('/create', customerController.createCustomer);
router.patch('/update/:id', customerController.updateCustomer);


router.get('/id/:id', customerController.findCustomerById);
router.get('/phone/:phoneNumber', customerController.findCustomerByPhoneNumber);
router.get('/name/:name', customerController.findCustomerByName);

module.exports = router;
