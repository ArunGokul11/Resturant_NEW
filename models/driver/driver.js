// models/driver.js

// module.exports = (sequelize, DataTypes) => {
//     const Driver = sequelize.define('Driver', {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       userName: {
//         type: DataTypes.STRING,
//         unique: true,
//         allowNull: false,
//       },
//       driverName: {
//         type: DataTypes.STRING,
//         unique: false,
//         allowNull: false,
//       },
//       phoneNumber: {
//         type: DataTypes.STRING,
//         unique: true,
//         allowNull: false,
//       },
//       isAvailable: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: true,
//       },
//       // Add any other driver-specific fields here
//     }, {
//       timestamps: true,
//     });
  
//     Driver.associate = models => {
//       Driver.hasMany(models.DriverToken, { foreignKey: 'driverId', as: 'tokens' });
//       Driver.hasMany(models.OrderMaster, { foreignKey: 'driverId', as: 'orders' });
//     };
  
//     return Driver;
//   };
  


module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Driver', {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      userName: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
      },
      driverName: {
          type: DataTypes.STRING,
          unique: false,
          allowNull: false,
      },
      phoneNumber: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
      },
      driverCode: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
      },
      isAvailable: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
      },
      // Add any other driver-specific fields here
  }, {
      timestamps: true,
  });

  Driver.associate = models => {
      Driver.hasMany(models.DriverToken, { foreignKey: 'driverId', as: 'tokens' });
      Driver.hasMany(models.OrderMaster, { foreignKey: 'driverId', as: 'orders' });
  };

  return Driver;
};
