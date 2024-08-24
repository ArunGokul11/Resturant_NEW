module.exports = (sequelize, DataTypes) => {
    const SerialNumber = sequelize.define('SerialNumber', {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      form: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prefix: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      timestamps: true,
      tableName: 'SerialNumberMaster' // Ensure this matches your table name
    });
  
    return SerialNumber;
  };
  