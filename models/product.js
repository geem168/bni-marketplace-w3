"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Relasi: Product dapat dibeli banyak kali (many-to-many) oleh User
      Product.belongsToMany(models.User, {
        through: models.Purchase, // Melalui tabel Purchase
        foreignKey: "productId",
        otherKey: "userId",
      });
    }
  }

  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
