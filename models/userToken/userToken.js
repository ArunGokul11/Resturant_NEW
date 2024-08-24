module.exports = (sequelize, DataTypes) => {
  const UserToken = sequelize.define('UserToken', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      references: {
        model: 'Users', // Ensure this matches the model name exactly
        key: 'id',
      },
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

  UserToken.associate = (models) => {
    UserToken.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return UserToken;
};

