const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management API
 */

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create a new User
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Azizbek"
 *               email: "azizbek@gmail.com"
 *               phone: "+998991234567"
 *               likesHistory: "liked_watches"
 *               OrderHistory: "ordered_watches"
 *               cartHistory: "cart_items"
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               likesHistory: { type: string }
 *               OrderHistory: { type: string }
 *               cartHistory: { type: string }
 *     responses:
 *       201: { description: Created }
 */
router.post('/', controller.createUser);

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all Users
 *     tags: [User]
 *     responses:
 *       200: { description: Success }
 */
router.get('/', controller.getAllUser);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get User by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 */
router.get('/:id', controller.getUserById);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Update User
 *     tags: [User]
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
 *               name: "Azizbek Updated"
 *               email: "azizbek_new@gmail.com"
 *               phone: "+998991234588"
 *               likesHistory: "liked_watches_2"
 *               OrderHistory: "ordered_watches_2"
 *               cartHistory: "cart_items_2"
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               likesHistory: { type: string }
 *               OrderHistory: { type: string }
 *               cartHistory: { type: string }
 *     responses:
 *       200: { description: Updated }
 */
router.put('/:id', controller.updateUser);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete User
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 */
router.delete('/:id', controller.deleteUser);

module.exports = router;
