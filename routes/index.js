const express = require('express');
const UserController = require('../controllers/UserController');  // Pastikan controller terimpor dengan benar
const ProductController = require('../controllers/ProductController');
const PurchaseController = require('../controllers/PurchaseController');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

const router = express.Router();

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: User registers with email, password, and name
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input or missing required fields
 *       409:
 *         description: Email already registered
 */
router.post('/register', UserController.registerUser);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     description: User logs in with email and password to receive an authentication token
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns an authentication token
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', UserController.loginUser);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Get a list of all available products in the system
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Failed to fetch products
 */
router.get('/products', ProductController.getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product (admin only)
 *     description: Only admins can add new products to the system
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product added successfully
 *       403:
 *         description: Access forbidden: admin only
 *       400:
 *         description: Missing name or price
 */
router.post('/products', authentication, authorization, ProductController.addProduct);

/**
 * @swagger
 * /api/purchase:
 *   post:
 *     summary: Purchase a product
 *     description: Allows a logged-in user to purchase a product
 *     tags:
 *       - Purchases
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Purchase successful
 *       400:
 *         description: Product ID is required
 *       404:
 *         description: Product not found
 */
router.post('/purchase', authentication, PurchaseController.addPurchase);

module.exports = router;
