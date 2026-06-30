const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderHistoryController');

/**
 * @swagger
 * tags:
 *   name: OrderHistory
 *   description: OrderHistory management API
 */

/**
 * @swagger
 * /api/orderhistory:
 *   post:
 *     summary: Create a new OrderHistory
 *     tags: [OrderHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               ProductId: "PROD-101"
 *               history: "Order confirmed"
 *               quantity: 1
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
router.post('/', controller.createOrderHistory);

/**
 * @swagger
 * /api/orderhistory:
 *   get:
 *     summary: Get all OrderHistorys
 *     tags: [OrderHistory]
 *     responses:
 *       200: { description: Success }
 */
router.get('/', controller.getAllOrderHistory);

/**
 * @swagger
 * /api/orderhistory/{id}:
 *   get:
 *     summary: Get OrderHistory by ID
 *     tags: [OrderHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 */
router.get('/:id', controller.getOrderHistoryById);

/**
 * @swagger
 * /api/orderhistory/{id}:
 *   put:
 *     summary: Update OrderHistory
 *     tags: [OrderHistory]
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
 *               history: "Order shipped"
 *               quantity: 1
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
router.put('/:id', controller.updateOrderHistory);

/**
 * @swagger
 * /api/orderhistory/{id}:
 *   delete:
 *     summary: Delete OrderHistory
 *     tags: [OrderHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 */
router.delete('/:id', controller.deleteOrderHistory);

module.exports = router;
