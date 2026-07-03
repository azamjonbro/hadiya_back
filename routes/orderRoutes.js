const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order processing API with Telegram and AmoCRM integrations
 */

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Submit a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phone
 *               - cartItems
 *               - totalPrice
 *             properties:
 *               userId: { type: integer }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phone: { type: string }
 *               cartItems:
 *                 type: array
 *                 items:
 *                   type: object
 *               totalPrice: { type: number }
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 */
router.post('/', controller.submitOrder);

module.exports = router;
