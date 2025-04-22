'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    static associate(models) {
      // Relasi: Purchase berhubungan dengan User
      Purchase.belongsTo(models.User, {
        foreignKey: 'userId',
      });

      // Relasi: Purchase berhubungan dengan Product
      Purchase.belongsTo(models.Product, {
        foreignKey: 'productId',
      });
    }
  }

  Purchase.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Purchase',
    }
  );

  return Purchase;
};
