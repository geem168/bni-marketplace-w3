const request = require('supertest');
const app = require('../app'); // 
const { Product, Purchase, sequelize } = require('../models');
const jwt = require('jsonwebtoken');

// Mock untuk token autentikasi
const mockToken = jwt.sign({ id: 1, email: 'test@example.com' }, 'JWT_SECRET', { expiresIn: '1h' });

describe('POST /purchase', () => {
  
  beforeAll(async () => {
    // Setup awal: buat produk yang bisa dibeli
    await Product.create({
      id: 1,
      name: 'Product 1',
      price: 100,
    });
  });

  afterAll(async () => {
    // Bersihkan data setelah tes
    await sequelize.close();
  });

  it('should successfully create a purchase', async () => {
    const response = await request(app)
      .post('/purchase') // Sesuaikan dengan route API
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ productId: 1 }); // Mengirimkan productId untuk pembelian
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Purchase successful');
    expect(response.body.data.userId).toBe(1); // Pastikan userId yang terhubung adalah user yang sesuai
    expect(response.body.data.productId).toBe(1); // Pastikan productId yang dibeli adalah 1
  });

  it('should return 400 if productId is missing', async () => {
    const response = await request(app)
      .post('/purchase')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({});
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Product ID is required');
  });

  it('should return 404 if product is not found', async () => {
    const response = await request(app)
      .post('/purchase')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ productId: 999 }); // Produk yang tidak ada
    
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Product not found');
  });

  it('should return 500 if there is a server error', async () => {
    // Mock error
    jest.spyOn(Product, 'findByPk').mockRejectedValueOnce(new Error('Database error'));
    
    const response = await request(app)
      .post('/purchase')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ productId: 1 });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Purchase failed');
  });
});
