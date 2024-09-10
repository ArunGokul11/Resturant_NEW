module.exports = (sequelize, DataTypes) => {
  const OrderMaster = sequelize.define('OrderMaster', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Customers',
        key: 'id',
      },
      allowNull: false,
    },
    driverId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Drivers',
        key: 'id',
      },
      allowNull: true,
    },
    orderItems: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    orderStatus: {
      type: DataTypes.ENUM,
      values: ['Pending', 'Processing', 'Completed', 'Cancelled'],
      defaultValue: 'Pending',
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM,
      values: ['Cash', 'Card'],
      allowNull: false,
      defaultValue: 'Cash',
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00, 
    },
  }, {
    timestamps: true,
  });

  OrderMaster.associate = models => {
    OrderMaster.belongsTo(models.Customer, { foreignKey: 'customerId', as: 'customer' });
    OrderMaster.belongsTo(models.Driver, { foreignKey: 'driverId', as: 'driver' });
  };

  return OrderMaster;
};
