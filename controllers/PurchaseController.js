const { Product, Purchase, sequelize } = require("../models");

// Controller buat handle pembelian produk
class PurchaseController {
  static async addPurchase(req, res) {
    const t = await sequelize.transaction(); // Start transaksi database
    try {
      const { productId } = req.body; // Ambil productId dari body request

      // Cek kalau productId nggak ada, error 400
      if (!productId) {
        throw { status: 400, message: 'Product ID is required' };
      }

      // Cek apakah produk ada di database
      const product = await Product.findByPk(Number(productId)); 
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Simpan pembelian baru di database
      const newPurchase = await Purchase.create({
        userId: req.user.id, // Ambil userId dari request (dari authentication)
        productId: productId, // Produk yang dibeli
      }, { transaction: t });

      await t.commit(); // Commit transaksi ke database

      // Kirim response sukses
      res.status(201).json({ message: 'Purchase successful', data: newPurchase });
    } catch (error) {
      await t.rollback(); // Kalau error, rollback transaksi
      res.status(500).json({ message: 'Purchase failed', error: error.message });
    }
  }
}

module.exports = PurchaseController;
