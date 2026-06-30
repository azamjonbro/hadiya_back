const express = require('express');
const router = express.Router();
const controller = require('../controllers/likesHistoryController');

/**
 * @swagger
 * tags:
 *   name: LikesHistory
 *   description: LikesHistory management API
 */

/**
 * @swagger
 * /api/likeshistory:
 *   post:
 *     summary: Create a new LikesHistory
 *     tags: [LikesHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               productid: "PROD-101"
 *               likedAt: "2024-10-15T12:00:00Z"
 *               userId: 1
 *               productId: 10
 *             properties:
 *               productid: { type: string }
 *               likedAt: { type: string, format: date }
 *               userId: { type: integer }
 *               productId: { type: integer }
 *     responses:
 *       201: { description: Created }
 */
router.post('/', controller.createLikesHistory);

/**
 * @swagger
 * /api/likeshistory:
 *   get:
 *     summary: Get all LikesHistorys
 *     tags: [LikesHistory]
 *     responses:
 *       200: { description: Success }
 */
router.get('/', controller.getAllLikesHistory);

/**
 * @swagger
 * /api/likeshistory/{id}:
 *   get:
 *     summary: Get LikesHistory by ID
 *     tags: [LikesHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 */
router.get('/:id', controller.getLikesHistoryById);

/**
 * @swagger
 * /api/likeshistory/{id}:
 *   put:
 *     summary: Update LikesHistory
 *     tags: [LikesHistory]
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
 *               productid: "PROD-101"
 *               likedAt: "2024-10-16T12:00:00Z"
 *               userId: 1
 *               productId: 10
 *             properties:
 *               productid: { type: string }
 *               likedAt: { type: string, format: date }
 *               userId: { type: integer }
 *               productId: { type: integer }
 *     responses:
 *       200: { description: Updated }
 */
router.put('/:id', controller.updateLikesHistory);

/**
 * @swagger
 * /api/likeshistory/{id}:
 *   delete:
 *     summary: Delete LikesHistory
 *     tags: [LikesHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 */
router.delete('/:id', controller.deleteLikesHistory);

module.exports = router;
