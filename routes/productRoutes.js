const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management API
 */

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new Product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Rolex Submariner"
 *               status: true
 *               history: { "views": 1500 }
 *               images: ["https://example.com/rolex1.jpg", "https://example.com/rolex2.jpg"]
 *               likes: "1250"
 *               quantity: "25"
 *               price: "15000"
 *               saleprice: "14500"
 *               salePercent: 5
 *               category: "Premium"
 *               categoryId: 1
 *             properties:
 *               name: { type: string }
 *               status: { type: boolean }
 *               history: { type: object }
 *               images: { type: array, items: { type: string } }
 *               likes: { type: string }
 *               quantity: { type: string }
 *               price: { type: string }
 *               saleprice: { type: string }
 *               salePercent: { type: integer }
 *               category: { type: string }
 *               categoryId: { type: integer }
 *     responses:
 *       201: { description: Created }
 */
router.post('/', controller.createProduct);

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get all Products
 *     tags: [Product]
 *     responses:
 *       200: { description: Success }
 */
router.get('/', controller.getAllProduct);

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get Product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 */
router.get('/:id', controller.getProductById);

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Update Product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Rolex Submariner Updated"
 *               status: false
 *               history: { "views": 1600 }
 *               images: ["https://example.com/rolex1_new.jpg"]
 *               likes: "1300"
 *               quantity: "20"
 *               price: "16000"
 *               saleprice: "15000"
 *               salePercent: 10
 *               category: "Premium"
 *               categoryId: 1
 *             properties:
 *               name: { type: string }
 *               status: { type: boolean }
 *               history: { type: object }
 *               images: { type: array, items: { type: string } }
 *               likes: { type: string }
 *               quantity: { type: string }
 *               price: { type: string }
 *               saleprice: { type: string }
 *               salePercent: { type: integer }
 *               category: { type: string }
 *               categoryId: { type: integer }
 *     responses:
 *       200: { description: Updated }
 */
router.put('/:id', controller.updateProduct);

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Delete Product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 */
router.delete('/:id', controller.deleteProduct);

module.exports = router;
