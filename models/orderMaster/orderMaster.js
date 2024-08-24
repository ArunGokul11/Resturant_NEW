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
          model: 'Customers', // Ensure this matches the model name exactly
          key: 'id',
        },
        allowNull: false,
      },
      driverId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Drivers', // Ensure this matches the model name exactly
          key: 'id',
        },
        allowNull: true, // Driver can be assigned later
      },
      orderItems: {
        type: DataTypes.JSONB, // Using JSONB to store an array of items
        allowNull: false,
        defaultValue: [], // Default to an empty array
      },
      orderStatus: {
        type: DataTypes.ENUM,
        values: ['Pending', 'Processing', 'Completed', 'Cancelled'],
        defaultValue: 'Pending',
        allowNull: false,
      },
    }, {
      timestamps: true,
    });
  
    OrderMaster.associate = models => {
      OrderMaster.belongsTo(models.Customer, { foreignKey: 'customerId', as: 'customer' });
      OrderMaster.belongsTo(models.Driver, { foreignKey: 'driverId', as: 'driver' }); // Association with Driver model
    };
  
    return OrderMaster;
  };
  