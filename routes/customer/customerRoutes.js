const express = require('express');
const router = express.Router();
const customerController = require('../../controller/customer/customerController');
const userAuthMiddleware = require('../../middleware/userAuthMiddleware')



// Create a new customer
router.post('/', userAuthMiddleware,customerController.createCustomer);

// Get all customers
router.get('/', userAuthMiddleware,customerController.getAllCustomers);

// Get a single customer by ID
router.get('/:id', userAuthMiddleware,customerController.getCustomerById);

// Update a customer by ID
router.put('/:id',userAuthMiddleware, customerController.updateCustomer);

// Delete a customer by ID
router.delete('/:id',userAuthMiddleware, customerController.deleteCustomer);

module.exports = router;
