const { OrderMaster, sequelize, Customer,Driver, DriverToken } = require('../../models');
const responseWrapper = require('../../utils/responseWrapper');
const SerialNumberService = require('../../utils/SerialNumberService');
const { generateToken } = require('../../utils/driverAuth'); // Adjust the path as needed





exports.registerDriver = async (req, res) => {
  const { userName, driverName, phoneNumber, driverCode } = req.body;

  if (!userName || !driverName || !phoneNumber || !driverCode) {
      return res.status(400).json(responseWrapper(400, 'fail', null, 'All fields are required'));
  }

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
      // Check if driver already exists
      const existingDriver = await Driver.findOne({ where: { driverCode } }, { transaction });
      if (existingDriver) {
          return res.status(400).json(responseWrapper(400, 'fail', null, 'Driver already exists'));
      }

      // Create a new driver
      const driver = await Driver.create({ userName, driverName, phoneNumber, driverCode }, { transaction });

      // Generate a token for the newly registered driver
      const token = generateToken(driver.id);
      
      // Invalidate previous tokens (if any)
      await DriverToken.update(
          { isExpired: true },
          {
              where: {
                  driverId: driver.id,
                  isExpired: false,
              },
              transaction,
          }
      );

      // Store the new token
      await DriverToken.create({
          driverId: driver.id,
          authToken: token,
          authTokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Token expiry set to 30 days
      }, { transaction });

      // Commit the transaction
      await transaction.commit();

      // Respond with the driver and token
      res.json(responseWrapper(200, 'success', { driver, token }, 'Driver registered successfully'));
  } catch (error) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      console.error('Registration Error:', error);
      res.status(500).json(responseWrapper(500, 'error', null, 'Registration failed'));
  }
};




// Driver login
exports.loginDriver = async (req, res) => {
  const { userName, phoneNumber } = req.body;

  if (!userName || !phoneNumber) {
      return res.status(400).json(responseWrapper(400, 'fail', null, 'Username and phone number are required'));
  }

  try {
      // Find the driver
      const driver = await Driver.findOne({
          where: { userName, phoneNumber }
      });

      if (!driver) {
          return res.status(404).json(responseWrapper(404, 'fail', null, 'Driver not found'));
      }

      // Invalidate all previous tokens
      await DriverToken.update(
          { isExpired: true },
          {
              where: {
                  driverId: driver.id,
                  isExpired: false,
              },
          }
      );

      // Generate a new token
      const token = generateToken(driver.id);

      // Store the new token
      await DriverToken.create({
          driverId: driver.id,
          authToken: token,
          authTokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
          isExpired: false,
      });

      res.json(responseWrapper(200, 'success', { token }, 'Login successful'));
  } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json(responseWrapper(500, 'error', null, 'Login failed'));
  }
};

//To Get All The Driver
exports.getAllDrivers = async (req, res) => {
  try {
      // Fetch all drivers from the Driver table
      const drivers = await Driver.findAll();

      // Respond with the list of drivers
      res.json(responseWrapper(200, 'success', drivers, 'Drivers retrieved successfully'));
  } catch (error) {
      console.error('Error fetching drivers:', error);
      res.status(500).json(responseWrapper(500, 'error', null, 'Failed to retrieve drivers'));
  }
};


// Get drivers by availability
exports.getDriversByAvailability = async (req, res) => {
    const { isAvailable } = req.params;
  
    // Convert the availability to a boolean
    const availability = isAvailable === 'true';
  
    try {
      // Find drivers by availability
      const drivers = await Driver.findAll({
        where: { isAvailable: availability },
        attributes: ['id', 'driverName', 'isAvailable'] // Only select relevant fields
      });
  
      if (drivers.length === 0) {
        return res.status(404).json(responseWrapper(404, 'fail', null, 'No drivers found with the specified availability'));
      }
  
      res.json(responseWrapper(200, 'success', drivers, 'Drivers retrieved successfully'));
    } catch (error) {
      console.error('Error retrieving drivers:', error);
      res.status(500).json(responseWrapper(500, 'error', null, 'Failed to retrieve drivers'));
    }
  };





  
  // exports.createOrder = async (req, res) => {
  //   const { fullName, phoneNumber, address, code, orderItems, driverCode } = req.body;
  
  //   // Validate that the code is provided
  //   if (!code) {
  //     return res.status(400).json(responseWrapper(400, 'fail', null, 'Customer code is required'));
  //   }
  
  //   const transaction = await sequelize.transaction(); // Start a transaction
  
  //   try {
  //     let customer;
  
  //     // Check if customer exists or create a new one
  //     customer = await Customer.findOne({ where: { code }, transaction });
  
  //     if (!customer) {
  //       customer = await Customer.create({
  //         fullName,
  //         phoneNumber,
  //         address,
  //         code,
  //       }, { transaction });
  //     }
  
  //     let driver;
  
  //     // Check if a driver with the provided driverCode exists
  //     if (driverCode) {
  //       driver = await Driver.findOne({ where: { driverCode }, transaction });
  
  //       // Throw an error if no driver is found
  //       if (!driver) {
  //         throw new Error('Driver not found');
  //       }
  //     } else {
  //       throw new Error('Driver code is required');
  //     }
  
  //     // Generate the next serial number for the order
  //     const { nextSerialNumber, completeSerialNumber } = await SerialNumberService.generateNextSerialNumber('ORDER');
  
  //     // Generate the current date for the order
  //     const orderDate = new Date();
  
  //     // Create a new order
  //     const order = await OrderMaster.create({
  //       orderNumber: completeSerialNumber,
  //       orderDate,
  //       customerId: customer.id,
  //       driverId: driver.id, // Set driverId if driver exists
  //       orderItems,
  //       orderStatus: "Processing",
  //     }, { transaction });
  
  //     // Update the serial number
  //     await SerialNumberService.updateSerialNumber('ORDER', nextSerialNumber);

  //     driver.isAvailable = false; // Set to false when assigned to an order
  //     await driver.save({ transaction });
  
  //     // Commit the transaction
  //     await transaction.commit();
  
  //     res.status(201).json(responseWrapper(201, 'success', order, 'Order created successfully'));
  //   } catch (error) {
  //     // Rollback the transaction if any error occurs
  //     await transaction.rollback();
  
  //     // Log the error for debugging
  //     console.error('Error creating order:', error);
  
  //     // Handle specific errors
  //     if (error.message === 'Driver not found') {
  //       return res.status(404).json(responseWrapper(404, 'fail', null, 'Driver not found'));
  //     }
  
  //     if (error.message === 'Driver code is required') {
  //       return res.status(400).json(responseWrapper(400, 'fail', null, 'Driver code is required'));
  //     }
  
  //     // Handle general errors
  //     res.status(500).json(responseWrapper(500, 'error', null, 'Failed to create order'));
  //   }
  // };
  
  
  


 
  exports.createOrder = async (req, res) => {
    const { fullName, phoneNumber, address, code, latitude, longitude, orderItems } = req.body;
  
    const transaction = await sequelize.transaction(); // Start a transaction
  
    try {
      let customer;
  
      if (code) {
        // Try to find an existing customer with the given code
        customer = await Customer.findOne({ where: { code }, transaction });
      }
  
      if (!customer) {
        // If no customer is found, create a new one with location data
        customer = await Customer.create({
          fullName,
          phoneNumber,
          address,
          code, // Ensure code is set even if it's the same as the provided one
          latitude,
          longitude,
          location: {
            type: 'Point',
            coordinates: [longitude, latitude], // Longitude, Latitude
          },
        }, { transaction });
      }
  
      console.log("Customer", customer);
  
      // Generate the next serial number for the order
      const { nextSerialNumber, completeSerialNumber } = await SerialNumberService.generateNextSerialNumber('ORDER');
  
      // Generate the current date for the order
      const orderDate = new Date();
  
      // Create a new order
      const order = await OrderMaster.create({
        orderNumber: completeSerialNumber,
        orderDate, // Use the current date
        customerId: customer.id, // Use the customer ID of the found or newly created customer
        orderItems,
        orderStatus: "Processing",
      }, { transaction });
  
      // Update the serial number
      await SerialNumberService.updateSerialNumber('ORDER', nextSerialNumber);
  
      // Commit the transaction
      await transaction.commit();
  
      res.status(201).json(responseWrapper(201, 'success', order, 'Order created successfully'));
    } catch (error) {
      // Rollback the transaction if any error occurs
      await transaction.rollback();
  
      // Log the error for debugging
      console.error('Error creating order:', error);
  
      res.status(500).json(responseWrapper(500, 'error', null, 'Failed to create order'));
    }
  };
  

// Assign Driver to Order
exports.assignDriverToOrder = async (req, res) => {
    const { orderId, driverId } = req.body;
  
    const transaction = await sequelize.transaction(); // Start a transaction
  
    try {
      // Find the order and driver within the transaction
      const [order, driver] = await Promise.all([
        OrderMaster.findByPk(orderId, { transaction }),
        Driver.findByPk(driverId, { transaction })
      ]);
  
      if (!order) {
        await transaction.rollback(); // Rollback transaction if order is not found
        return res.status(404).json(responseWrapper(404, 'fail', null, 'Order not found'));
      }
  
      if (!driver) {
        await transaction.rollback(); // Rollback transaction if driver is not found
        return res.status(404).json(responseWrapper(404, 'fail', null, 'Driver not found'));
      }
  
      // Assign driver to the order and update order status to 'Processing'
      order.driverId = driverId;
      order.orderStatus = 'Processing'; // Set status to 'Processing' when assigning a driver
      await order.save({ transaction });
  
      // Update driver availability
      driver.isAvailable = false; // Set to false when assigned to an order
      await driver.save({ transaction });
  
      // Commit transaction if everything is successful
      await transaction.commit();
  
      res.json(responseWrapper(200, 'success', order, 'Driver assigned to order successfully'));
    } catch (error) {
      // Rollback transaction in case of any error
      await transaction.rollback();
      console.error('Error assigning driver to order:', error);
      res.status(500).json(responseWrapper(500, 'error', null, 'Failed to assign driver to order'));
    }
  };


// Update the status of an order
exports.updateOrderStatus = async (req, res) => {
  const { orderId, newStatus, paymentMethod } = req.body;

  if (!orderId || !newStatus) {
    return res.status(400).json(responseWrapper(400, 'fail', null, 'Order ID and new status are required'));
  }

  // Validate paymentMethod if provided
  const validPaymentMethods = ['Cash', 'Card'];
  if (paymentMethod && !validPaymentMethods.includes(paymentMethod)) {
    return res.status(400).json(responseWrapper(400, 'fail', null, 'Invalid payment method'));
  }

  const transaction = await sequelize.transaction();

  try {
    // Find the order by ID
    const order = await OrderMaster.findByPk(orderId, { transaction });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json(responseWrapper(404, 'fail', null, `Order with ID ${orderId} not found`));
    }

    // Validate the new status
    const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(newStatus)) {
      await transaction.rollback();
      return res.status(400).json(responseWrapper(400, 'fail', null, 'Invalid order status'));
    }

    // Update the order status and payment method if provided
    order.orderStatus = newStatus;
    if (paymentMethod) {
      order.paymentMethod = paymentMethod; // Update payment method if provided
    }
    await order.save({ transaction });

    // If status is 'Completed', check driver availability
    if (newStatus === 'Completed' && order.driverId) {
      // Find the driver assigned to the order (using the User model)
      const driver = await sequelize.models.Driver.findByPk(order.driverId, { transaction });
      if (driver) {
        // Check if there are any pending orders for the driver
        const pendingOrders = await OrderMaster.count({
          where: {
            driverId: driver.id,
            orderStatus: 'Processing'
          },
          transaction
        });

        // Update driver's availability based on remaining orders
        driver.isAvailable = pendingOrders === 0;
        await driver.save({ transaction });
      }
    }

    // Commit transaction
    await transaction.commit();

    return res.json(responseWrapper(200, 'success', order, 'Order status updated successfully'));
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    console.error('Error updating order status:', error);
    return res.status(500).json(responseWrapper(500, 'error', null, 'Failed to update order status'));
  }
};


  
  // Get order details
exports.getOrderDetails = async (req, res) => {
    const { orderId } = req.params;
  
    try {
      const order = await OrderMaster.findByPk(orderId, {
        include: [
          {
            model: Driver,
            as: 'driver',
            attributes: ['id', 'driverName'],
          },
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'fullName'], 
          }
        ]
      });
  
      if (!order) {
        return res.status(404).json(responseWrapper(404, 'fail', null, 'Order not found'));
      }
  
      res.json(responseWrapper(200, 'success', order, 'Order details fetched successfully'));
    } catch (error) {
      res.status(500).json(responseWrapper(500, 'error', null, 'Failed to fetch order details'));
    }
  };
