const { OrderMaster, sequelize, Customer } = require('../../models');
const responseWrapper = require('../../utils/responseWrapper');
const paginate = require('../../utils/pagination');
const { Op } = require('sequelize'); 
const SerialNumberService = require('../../utils/SerialNumberService');
const { generateToken } = require('../../utils/driverAuth'); // Adjust the path as needed



// Create Customer
exports.createCustomer = async (req, res) => {
  const { fullName, phoneNumber,code, address, latitude, longitude } = req.body;

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    // Create a new customer with location data
    const customer = await Customer.create({
      fullName,
      phoneNumber,
      address,
      code,
      latitude,
      longitude,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude], // Longitude, Latitude
      },
    }, { transaction });

    // Commit the transaction
    await transaction.commit();

    res.status(201).json(responseWrapper(201, 'success', customer, 'Customer created successfully'));
  } catch (error) {
    // Rollback the transaction if any error occurs
    await transaction.rollback();

    // Log the error for debugging
    console.error('Error creating customer:', error);

    res.status(500).json(responseWrapper(500, 'error', null, 'Failed to create customer'));
  }
};

// Customer Update F
exports.updateCustomer = async (req, res) => {
  const { id } = req.params; // Customer ID from request params
  const { fullName, phoneNumber, code, address, latitude, longitude } = req.body;

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    // Find the customer by ID
    const customer = await Customer.findOne({ where: { id }, transaction });

    if (!customer) {
      return res.status(404).json(responseWrapper(404, 'error', null, 'Customer not found'));
    }

    // Update the customer fields
    await customer.update({
      fullName,
      phoneNumber,
      address,
      code,
      latitude,
      longitude,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude], // Longitude, Latitude
      },
    }, { transaction });

    // Commit the transaction
    await transaction.commit();

    res.status(200).json(responseWrapper(200, 'success', customer, 'Customer updated successfully'));
  } catch (error) {
    // Rollback the transaction if any error occurs
    await transaction.rollback();

    // Log the error for debugging
    console.error('Error updating customer:', error);

    res.status(500).json(responseWrapper(500, 'error', null, 'Failed to update customer'));
  }
};



// Get All Customers 
exports.getAllCustomers = async (req, res) => {
  try {
    // Fetch all customers from the Customer table
    const customers = await Customer.findAll();

    // Respond with the list of customers
    res.status(200).json(responseWrapper(200, 'success', customers, 'Customers retrieved successfully'));
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching customers:', error);
    
    res.status(500).json(responseWrapper(500, 'error', null, 'Failed to retrieve customers'));
  }
};

// Search customer by ID
exports.findCustomerById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const customer = await Customer.findByPk(id); // Directly find by primary key

    if (!customer) {
      return res.status(404).json(responseWrapper(404, 'error', null, 'Customer not found'));
    }

    res.status(200).json(responseWrapper(200, 'success', customer, 'Customer found successfully'));
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    res.status(500).json(responseWrapper(500, 'error', null, 'Failed to fetch customer by ID'));
  }
};



// Search customers 
exports.findCustomerByPhoneNumber = async (req, res) => {
  const { phoneNumber } = req.params;
  const { page = 0, size = 10 } = req.query;

  try {
    const filters = {
      phoneNumber: {
        [Op.like]: `%${phoneNumber}%` // Partial match for phone number
      }
    };

    const paginatedResult = await paginate(Customer, page, size, filters);

    if (paginatedResult.content.length === 0) {
      return res.status(404).json(responseWrapper(404, 'error', null, 'No customers found with the given phone number'));
    }

    res.status(200).json(responseWrapper(200, 'success', paginatedResult, 'Customers found successfully'));
  } catch (error) {
    console.error('Error fetching customers by phone number:', error);
    res.status(500).json(responseWrapper(500, 'error', null, 'Failed to fetch customers by phone number'));
  }
};

// Search customers
exports.findCustomerByName = async (req, res) => {
  const { name } = req.params;
  const { page = 0, size = 10 } = req.query; // Default page and size

  try {
    const filters = {
      fullName: {
        [Op.like]: `%${name}%` // Use Sequelize Op to search with LIKE
      }
    };

    const paginatedResult = await paginate(Customer, page, size, filters);

    if (paginatedResult.content.length === 0) {
      return res.status(404).json(responseWrapper(404, 'error', null, 'No customers found with the given name'));
    }

    res.status(200).json(responseWrapper(200, 'success', paginatedResult, 'Customers found successfully'));
  } catch (error) {
    console.error('Error fetching customers by name:', error);
    res.status(500).json(responseWrapper(500, 'error', null, 'Failed to fetch customers by name'));
  }
};
