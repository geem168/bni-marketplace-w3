'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,  // id akan auto increment
        primaryKey: true,     // id akan menjadi primary key
        type: Sequelize.INTEGER  // Tipe data kolom id adalah INTEGER
      },
      name: {
        type: Sequelize.STRING,   // Tipe data untuk kolom name adalah STRING
        allowNull: false,         // Kolom name tidak boleh null
      },
      email: {
        type: Sequelize.STRING,   // Tipe data untuk kolom email adalah STRING
        allowNull: false,         // Kolom email tidak boleh null
        unique: true,             // Email harus unik
      },
      password: {
        type: Sequelize.STRING,   // Tipe data untuk kolom password adalah STRING
        allowNull: false,         // Kolom password tidak boleh null
      },
      role: {
        type: Sequelize.STRING,   // Tipe data untuk kolom role adalah STRING
        defaultValue: 'user',     // Default role adalah 'user' jika tidak diisi
      },
      createdAt: {
        allowNull: false,         // Kolom createdAt tidak boleh null
        type: Sequelize.DATE,     // Tipe data untuk createdAt adalah DATE
      },
      updatedAt: {
        allowNull: false,         // Kolom updatedAt tidak boleh null
        type: Sequelize.DATE,     // Tipe data untuk updatedAt adalah DATE
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users'); // Untuk rollback, hapus tabel Users
  }
};
