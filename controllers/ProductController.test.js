const request = require('supertest');
const app = require('../app'); // Pastikan app.js diexport sebagai app
const { sequelize, Product, User, Purchase } = require('../models');
const jwt = require('jsonwebtoken');

let userToken, adminToken;

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset database

  // Membuat admin dan regular user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'adminpass',
    role: 'admin',
  });

  const user = await User.create({
    name: 'Regular User',
    email: 'user@example.com',
    password: 'userpass',
    role: 'user',
  });

  adminToken = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET);
  userToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
});

describe('ProductController Tests', () => {

  // Test GET /api/products - Menampilkan semua produk
  describe('GET /api/products', () => {
    test('should return all products', async () => {
      await Product.create({ name: 'Product A', price: 5000 });
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual(expect.any(Array));  // Expect array of products
    });
  });

  // Test POST /api/products - Menambahkan produk
  describe('POST /api/products', () => {
    test('should return 403 if user is not an admin', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Fail Product', price: 1000 });

      expect(res.statusCode).toBe(403); // Forbidden
      expect(res.body.message).toBe('Access forbidden: admin only');
    });

    test('should successfully add a product if user is an admin', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Product', price: 10000 });

      expect(res.statusCode).toBe(201);  // Success
      expect(res.body.message).toBe('Product added successfully');
      expect(res.body.data.name).toBe('New Product');
    });

    test('should return 400 if name or price is missing', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Missing Price' });  // Missing price

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Name and price are required');
    });
  });

  // Test POST /api/purchase - Membeli produk
  describe('POST /api/purchase', () => {
    test('should successfully purchase a product', async () => {
      const product = await Product.create({ name: 'BuyMe', price: 2000 });

      const res = await request(app)
        .post('/api/purchase')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product.id });

      expect(res.statusCode).toBe(201);  // Success
      expect(res.body.message).toBe('Purchase successful');
    });

    test('should return 400 if productId is missing', async () => {
      const res = await request(app)
        .post('/api/purchase')
        .set('Authorization', `Bearer ${userToken}`)
        .send({});  // Missing productId

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Product ID is required');
    });

    test('should return 404 if product not found', async () => {
      const res = await request(app)
        .post('/api/purchase')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: 9999 });  // Invalid product ID

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Product not found');
    });
  });
});

afterAll(async () => {
  await sequelize.close(); // Tutup koneksi DB setelah test
});
