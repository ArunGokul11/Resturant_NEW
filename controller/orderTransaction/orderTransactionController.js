const { sequelize, Customer,OrderTransaction, Order } = require('../../models');
const responseWrapper = require('../../utils/responseWrapper');
const { formatDate } = require('../../utils/dateFormatter');
const SerialNumberService = require('../../utils/SerialNumberService');

exports.createOrderWithTransactions = async (req, res) => {
  const { orderDate, customerId, orderStatus, orderTransactions } = req.body;

  const transaction = await sequelize.transaction();
  try {
    // Generate the next serial number for the order
    const { nextSerialNumber, completeSerialNumber } = await SerialNumberService.generateNextSerialNumber('ORDER');

    // Check if customer exists
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Create the order with the generated serial number
    const order = await Order.create({
      orderNumber: completeSerialNumber,
      orderDate,
      customerId,
      orderStatus
    }, { transaction });

    // Create order transactions
    for (const transactionData of orderTransactions) {
      await OrderTransaction.create({
        orderId: order.id,
        orderDate: transactionData.orderDate,
        itemName: transactionData.itemName,
        price: transactionData.price,
        quantity: transactionData.quantity
      }, { transaction });
    }

    // Update the serial number in the SerialNumberMaster table
    await SerialNumberService.updateSerialNumber('ORDER', nextSerialNumber);

    // Commit transaction
    await transaction.commit();

    return res.status(201).json({ message: 'Order and transactions created successfully', order });
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    return res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};





  exports.getOrderDetails = async (req, res) => {
    const { orderId } = req.params;
  
    try {
      // Find the order by ID and include related OrderTransactions and Customer
      const order = await Order.findOne({
        where: { id: orderId },
        include: [
          {
            model: OrderTransaction,
            as: 'orderTransactions',
          },
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'fullName', 'username', 'phoneNumber', 'address'] // Specify fields to include from Customer
          }
        ]
      });
  
  
      // If the order is not found, return a 404 error
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Return the order details with associated transactions and customer data
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  };