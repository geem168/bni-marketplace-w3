const request = require('supertest');

const { sequelize, User } = require('../models');
const jwt = require('jsonwebtoken');

let userToken, adminToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Membuat user admin dan regular user
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

describe('UserController Tests', () => {

  describe('POST /api/register', () => {
    test('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({ name: 'New User', email: 'newuser@example.com', password: 'password123' });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Register successful');
      expect(res.body.user).toHaveProperty('name');
      expect(res.body.user).toHaveProperty('email');
      expect(res.body.user).toHaveProperty('role');
    });

    test('should return error if email is already registered', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({ name: 'Duplicate User', email: 'user@example.com', password: 'password123' });

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe('Email already registered');
    });
  });

  describe('POST /api/login', () => {
    test('should login successfully and return a token', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ email: 'user@example.com', password: 'userpass' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
    });

    test('should return error for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ email: 'user@example.com', password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
    });
  });

  describe('GET /api/users', () => {
    test('should allow admin to get all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual(expect.any(Array));  // Expect array of users
    });

    test('should return 403 if regular user tries to access all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403); // Forbidden
      expect(res.body.message).toBe('Access forbidden: admin only');
    });
  });
});

afterAll(async () => {
  await sequelize.close();
});
