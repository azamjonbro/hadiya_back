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
 *               firstName: "Azizbek"
 *               lastName: "Tohirov"
 *               phone: "+998991234567"
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phone: { type: string }
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
 *               firstName: "Azizbek Updated"
 *               lastName: "Tohirov Updated"
 *               phone: "+998991234588"
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phone: { type: string }
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
