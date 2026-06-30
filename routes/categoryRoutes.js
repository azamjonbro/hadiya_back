const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoryController');

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management API
 */

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Create a new Category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Aqlli Soatlar"
 *               status: true
 *               history: { "created": "2024" }
 *               superadminId: 1
 *             properties:
 *               name: { type: string }
 *               status: { type: boolean }
 *               history: { type: object }
 *               superadminId: { type: integer }
 *     responses:
 *       201: { description: Created }
 */
router.post('/', controller.createCategory);

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Get all Categories
 *     tags: [Category]
 *     responses:
 *       200: { description: Success }
 */
router.get('/', controller.getAllCategory);

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Get Category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 */
router.get('/:id', controller.getCategoryById);

/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Update Category
 *     tags: [Category]
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
 *               name: "Mexanik Soatlar"
 *               status: false
 *               history: { "updated": "2024" }
 *               superadminId: 1
 *             properties:
 *               name: { type: string }
 *               status: { type: boolean }
 *               history: { type: object }
 *               superadminId: { type: integer }
 *     responses:
 *       200: { description: Updated }
 */
router.put('/:id', controller.updateCategory);

/**
 * @swagger
 * /api/category/{id}:
 *   delete:
 *     summary: Delete Category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 */
router.delete('/:id', controller.deleteCategory);

module.exports = router;
