const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const upload = require('../config/multer');

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Rolex Submariner"
 *               status:
 *                 type: boolean
 *                 example: true
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               likes:
 *                 type: string
 *                 example: "1250"
 *               quantity:
 *                 type: string
 *                 example: "25"
 *               price:
 *                 type: string
 *                 example: "15000"
 *               saleprice:
 *                 type: string
 *                 example: "14500"
 *               salePercent:
 *                 type: integer
 *                 example: 5
 *               category:
 *                 type: string
 *                 example: "Premium"
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', upload.array('images'), controller.createProduct);

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get all Products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Success
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
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
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
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Rolex Submariner Updated"
 *               status:
 *                 type: boolean
 *                 example: false
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               likes:
 *                 type: string
 *                 example: "1300"
 *               quantity:
 *                 type: string
 *                 example: "20"
 *               price:
 *                 type: string
 *                 example: "16000"
 *               saleprice:
 *                 type: string
 *                 example: "15000"
 *               salePercent:
 *                 type: integer
 *                 example: 10
 *               category:
 *                 type: string
 *                 example: "Premium"
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id', upload.array('images'), controller.updateProduct);

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
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/:id', controller.deleteProduct);

module.exports = router;
