// const Customer = require('../../models/customer/customer');
const responseWrapper = require('../../utils/responseWrapper');

const { Customer } = require('../../models'); 


// Create a new customer

exports.createCustomer = async (req, res) => {
    try {
    console.log("Request Body:", req.body);
    const customer = await Customer.create(req.body);
    console.log("Customer Created:", customer);
      res.status(201).json({
        message: 'Customer created successfully',
        data: customer,
      });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({
        message: 'Error creating customer',
        error: error.message,
      });
    }
  };
// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    responseWrapper(res, 200, 'Customers retrieved successfully', customers);
  } catch (error) {
    responseWrapper(res, 500, 'Error retrieving customers', error.message);
  }
};

// Get a customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (customer) {
      responseWrapper(res, 200, 'Customer retrieved successfully', customer);
    } else {
      responseWrapper(res, 404, 'Customer not found');
    }
  } catch (error) {
    responseWrapper(res, 500, 'Error retrieving customer', error.message);
  }
};
// Update a customer by ID
exports.updateCustomer = async (req, res) => {
  try {
    const [updated] = await Customer.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedCustomer = await Customer.findByPk(req.params.id);
      responseWrapper(res, 200, 'Customer updated successfully', updatedCustomer);
    } else {
      responseWrapper(res, 404, 'Customer not found');
    }
  } catch (error) {
    responseWrapper(res, 500, 'Error updating customer', error.message);
  }
};

// Delete a customer by ID
exports.deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      responseWrapper(res, 200, 'Customer deleted successfully');
    } else {
      responseWrapper(res, 404, 'Customer not found');
    }
  } catch (error) {
    responseWrapper(res, 500, 'Error deleting customer', error.message);
  }
};
