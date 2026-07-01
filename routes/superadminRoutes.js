const express = require('express');
const router = express.Router();
const controller = require('../controllers/superadminController');

/**
 * @swagger
 * tags:
 *   name: Superadmin
 *   description: Superadmin management API
 */

/**
 * @swagger
 * /api/superadmin:
 *   post:
 *     summary: Create a new Superadmin
 *     tags: [Superadmin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               username: "super_admin1"
 *               password: "mypassword123"
 *               name: "John Doe"
 *               email: "admin@soatshop.uz"
 *               phone: "+998901234567"
 *               status: true
 *               history: { "lastLogin": "2024-06-30" }
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               status: { type: boolean }
 *               history: { type: object }
 *     responses:
 *       201: { description: Created }
 */
router.post('/', controller.createSuperadmin);

/**
 * @swagger
 * /api/superadmin/login:
 *   post:
 *     summary: Login Superadmin
 *     tags: [Superadmin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               username: "super_admin1"
 *               password: "mypassword123"
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Success }
 *       400: { description: Invalid credentials }
 */
router.post('/login', controller.loginSuperadmin);

/**
 * @swagger
 * /api/superadmin:
 *   get:
 *     summary: Get all Superadmins
 *     tags: [Superadmin]
 *     responses:
 *       200: { description: Success }
 */
router.get('/', controller.getAllSuperadmin);

/**
 * @swagger
 * /api/superadmin/{id}:
 *   get:
 *     summary: Get Superadmin by ID
 *     tags: [Superadmin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 */
router.get('/:id', controller.getSuperadminById);

/**
 * @swagger
 * /api/superadmin/{id}:
 *   put:
 *     summary: Update Superadmin
 *     tags: [Superadmin]
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
 *               username: "super_admin1_updated"
 *               name: "John Doe Updated"
 *               email: "admin_new@soatshop.uz"
 *               phone: "+998901234568"
 *               status: false
 *               history: { "updatedAt": "2024-07-01" }
 *             properties:
 *               username: { type: string }
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               status: { type: boolean }
 *               history: { type: object }
 *     responses:
 *       200: { description: Updated }
 */
router.put('/:id', controller.updateSuperadmin);

module.exports = router;
