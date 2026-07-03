const express = require('express');
const router = express.Router();

router.use('/superadmin', require('./superadminRoutes'));
router.use('/manager', require('./managerRoutes'));
router.use('/category', require('./categoryRoutes'));
router.use('/product', require('./productRoutes'));
router.use('/user', require('./userRoutes'));
router.use('/likeshistory', require('./likesHistoryRoutes'));
router.use('/carthistory', require('./cartHistoryRoutes'));
router.use('/orderhistory', require('./orderHistoryRoutes'));
router.use('/order', require('./orderRoutes'));

module.exports = router;
