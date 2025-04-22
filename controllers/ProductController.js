const { Product, Purchase, User } = require("../models");
const jwt = require("jsonwebtoken");

class ProductController {
  // Get All Products: Semua pengguna bisa melihat produk yang tersedia
  static async getAllProducts(req, res) {
    try {
      const products = await Product.findAll();
      res.status(200).json({ data: products });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch products", error: error.message });
    }
  }

  // Add Product: Hanya admin yang bisa menambahkan produk
  static async addProduct(req, res) {
    try {
      // Pastikan user adalah admin
      if (!req.user || req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Access forbidden: admin only" });
      }

      const { name, price } = req.body;

      if (!name || !price) {
        return res.status(400).json({ message: "Name and price are required" });
      }

      // Tambahkan produk baru
      const newProduct = await Product.create({
        name,
        price,
      });

      res
        .status(201)
        .json({ message: "Product added successfully", data: newProduct });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to add product", error: error.message });
    }
  }

  // Purchase Product: Pengguna dapat membeli produk dengan autentikasi token
  static async purchaseProduct(req, res) {
    try {
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      // Cek apakah produk tersedia
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Simpan pembelian produk oleh user
      const purchase = await Purchase.create({
        userId: req.user.id,
        productId: product.id,
      });

      res.status(201).json({ message: "Purchase successful", data: purchase });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Purchase failed", error: error.message });
    }
  }
}

module.exports = ProductController;
