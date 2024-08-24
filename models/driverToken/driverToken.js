// models/driverToken.js

module.exports = (sequelize, DataTypes) => {
    const DriverToken = sequelize.define('DriverToken', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      driverId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Drivers', // Ensure this matches the model name exactly
          key: 'id',
        },
        allowNull: false,
      },
      authToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      authTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isExpired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    }, {
      timestamps: true,
    });
  
    DriverToken.associate = models => {
      DriverToken.belongsTo(models.Driver, { foreignKey: 'driverId', as: 'driver' });
    };
  
    return DriverToken;
  };
  