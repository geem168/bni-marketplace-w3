'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Purchases', {
      id: {
        allowNull: false,
        autoIncrement: true,  // Kolom id akan auto increment
        primaryKey: true,     // id akan menjadi primary key
        type: Sequelize.INTEGER  // Tipe data kolom id adalah INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',      // Mengacu pada tabel Users
          key: 'id'            // Kolom yang digunakan untuk relasi
        },
        onUpdate: 'CASCADE',    // Jika data di tabel Users diupdate, data di tabel Purchases akan diupdate juga
        onDelete: 'CASCADE'    // Jika data di tabel Users dihapus, maka data di tabel Purchases juga akan dihapus
      },
      productId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Products',   // Mengacu pada tabel Products
          key: 'id'            // Kolom yang digunakan untuk relasi
        },
        onUpdate: 'CASCADE',    // Jika data di tabel Products diupdate, data di tabel Purchases akan diupdate juga
        onDelete: 'CASCADE'    // Jika data di tabel Products dihapus, maka data di tabel Purchases juga akan dihapus
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
    await queryInterface.dropTable('Purchases');  // Untuk rollback, hapus tabel Purchases
  }
};
