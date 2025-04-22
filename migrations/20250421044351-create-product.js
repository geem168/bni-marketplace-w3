'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,  // Kolom id akan auto increment
        primaryKey: true,     // id akan menjadi primary key
        type: Sequelize.INTEGER  // Tipe data kolom id adalah INTEGER
      },
      name: {
        type: Sequelize.STRING,  // Tipe data kolom name adalah STRING
        allowNull: false,        // Kolom name tidak boleh null
      },
      price: {
        type: Sequelize.INTEGER,  // Tipe data kolom price adalah INTEGER
        allowNull: false,         // Kolom price tidak boleh null
      },
      createdAt: {
        allowNull: false,         // Kolom createdAt tidak boleh null
        type: Sequelize.DATE,     // Tipe data untuk createdAt adalah DATE
      },
      updatedAt: {
        allowNull: false,         // Kolom updatedAt tidak boleh null
        type: Sequelize.DATE,     // Tipe data untuk updatedAt adalah DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');  // Untuk rollback, hapus tabel Products
  }
};
