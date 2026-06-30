const express = require('express');
const router = express.Router();
const controller = require('../controllers/cartHistoryController');

/**
 * @swagger
 * tags:
 *   name: CartHistory
 *   description: CartHistory management API
 */

/**
 * @swagger
 * /api/carthistory:
 *   post:
 *     summary: Create a new CartHistory
 *     tags: [CartHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               ProductId: "PROD-101"
 *               history: "Added 2 items to cart"
 *               quantity: 2
 *               userId: 1
 *               productId: 10
 *             properties:
 *               ProductId: { type: string }
 *               history: { type: string }
 *               quantity: { type: integer }
 *               userId: { type: integer }
 *               productId: { type: integer }
 *     responses:
 *       201: { description: Created }
 */
router.post('/', controller.createCartHistory);

/**
 * @swagger
 * /api/carthistory:
 *   get:
 *     summary: Get all CartHistorys
 *     tags: [CartHistory]
 *     responses:
 *       200: { description: Success }
 */
router.get('/', controller.getAllCartHistory);

/**
 * @swagger
 * /api/carthistory/{id}:
 *   get:
 *     summary: Get CartHistory by ID
 *     tags: [CartHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 */
router.get('/:id', controller.getCartHistoryById);

/**
 * @swagger
 * /api/carthistory/{id}:
 *   put:
 *     summary: Update CartHistory
 *     tags: [CartHistory]
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
 *               ProductId: "PROD-101"
 *               history: "Updated quantity to 3"
 *               quantity: 3
 *               userId: 1
 *               productId: 10
 *             properties:
 *               ProductId: { type: string }
 *               history: { type: string }
 *               quantity: { type: integer }
 *               userId: { type: integer }
 *               productId: { type: integer }
 *     responses:
 *       200: { description: Updated }
 */
router.put('/:id', controller.updateCartHistory);

/**
 * @swagger
 * /api/carthistory/{id}:
 *   delete:
 *     summary: Delete CartHistory
 *     tags: [CartHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 */
router.delete('/:id', controller.deleteCartHistory);

module.exports = router;
