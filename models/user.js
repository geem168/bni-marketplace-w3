"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Relasi: User dapat membeli banyak produk (many-to-many) melalui Purchase
      User.belongsToMany(models.Product, {
        through: models.Purchase, // Melalui tabel Purchase
        foreignKey: "userId",
        otherKey: "productId",
      });
    }

    // Menambahkan metode untuk mengecek password yang di-hash
    static async checkPassword(password, hashedPassword) {
      return await bcrypt.compare(password, hashedPassword);
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "user", // Default role adalah user
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  // Hook untuk mengenkripsi password sebelum menyimpan ke database
  User.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10); // Encrypt password
    }
  });

  return User;
};
