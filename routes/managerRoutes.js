const express = require('express');
const router = express.Router();
const controller = require('../controllers/managerController');

/**
 * @swagger
 * tags:
 *   name: Manager
 *   description: Manager management API
 */

/**
 * @swagger
 * /api/manager:
 *   post:
 *     summary: Create a new Manager
 *     tags: [Manager]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               username: "manager_ali"
 *               password: "mypassword123"
 *               email: "ali@soatshop.uz"
 *               phone: "+998941112233"
 *               status: true
 *               history: { "assignedTasks": 10 }
 *               superadminId: 1
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               status: { type: boolean }
 *               history: { type: object }
 *               superadminId: { type: integer }
 *     responses:
 *       201: { description: Created }
 */
router.post('/', controller.createManager);

/**
 * @swagger
 * /api/manager/login:
 *   post:
 *     summary: Login Manager
 *     tags: [Manager]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               username: "manager_ali"
 *               password: "mypassword123"
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Success }
 *       400: { description: Invalid credentials }
 */
router.post('/login', controller.loginManager);

/**
 * @swagger
 * /api/manager:
 *   get:
 *     summary: Get all Managers
 *     tags: [Manager]
 *     responses:
 *       200: { description: Success }
 */
router.get('/', controller.getAllManager);

/**
 * @swagger
 * /api/manager/{id}:
 *   get:
 *     summary: Get Manager by ID
 *     tags: [Manager]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 */
router.get('/:id', controller.getManagerById);

/**
 * @swagger
 * /api/manager/{id}:
 *   put:
 *     summary: Update Manager
 *     tags: [Manager]
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
 *               username: "manager_ali_new"
 *               email: "ali_new@soatshop.uz"
 *               phone: "+998941112244"
 *               status: false
 *               history: { "assignedTasks": 15 }
 *               superadminId: 1
 *             properties:
 *               username: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               status: { type: boolean }
 *               history: { type: object }
 *               superadminId: { type: integer }
 *     responses:
 *       200: { description: Updated }
 */
router.put('/:id', controller.updateManager);

/**
 * @swagger
 * /api/manager/{id}:
 *   delete:
 *     summary: Delete Manager
 *     tags: [Manager]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 */
router.delete('/:id', controller.deleteManager);

module.exports = router;
