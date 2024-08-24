const { Order, Customer } = require('../../models');
const responseWrapper = require('../../utils/responseWrapper');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { orderNumber, orderDate, customerId, orderStatus } = req.body;
    const order = await Order.create({ orderNumber, orderDate, customerId, orderStatus });
    responseWrapper(res, 201, 'Order created successfully', order);
  } catch (error) {
    responseWrapper(res, 500, 'Error creating order', error.message);
  }
};
// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: Customer, as: 'customer' }]
    });
    responseWrapper(res, 200, 'Orders retrieved successfully', orders);
  } catch (error) {
    responseWrapper(res, 500, 'Error retrieving orders', error.message);
  }
};
// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: Customer, as: 'customer' }]
    });
    if (!order) {
      return responseWrapper(res, 404, 'Order not found', null);
    }
    responseWrapper(res, 200, 'Order retrieved successfully', order);
  } catch (error) {
    responseWrapper(res, 500, 'Error retrieving order', error.message);
  }
};
// Update an existing order
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return responseWrapper(res, 404, 'Order not found', null);
    }
    const { orderNumber, orderDate, customerId, orderStatus } = req.body;
    await order.update({ orderNumber, orderDate, customerId, orderStatus });
    responseWrapper(res, 200, 'Order updated successfully', order);
  } catch (error) {
    responseWrapper(res, 500, 'Error updating order', error.message);
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return responseWrapper(res, 404, 'Order not found', null);
    }
    await order.destroy();
    responseWrapper(res, 200, 'Order deleted successfully', null);
  } catch (error) {
    responseWrapper(res, 500, 'Error deleting order', error.message);
  }
};

module.exports.updateOrderStatus = async (req, res) => {
  const { orderId, newStatus } = req.body;

  try {
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (newStatus === 'Completed') {
      const driver = await AllDriver.findByPk(order.driverId); // Assuming `driverId` is a field in the `Order` model

      if (driver && !driver.isAvailable) {
        await driver.update({ isAvailable: true });
        await AvailableDriver.create({
          driverId: driver.id,
          availableFrom: new Date(),
        });
      }
    }

    order.orderStatus = newStatus;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};