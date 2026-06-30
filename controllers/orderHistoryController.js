const { OrderHistory } = require('../models');

exports.createOrderHistory = async (req, res) => {
    try {
        const item = await OrderHistory.create(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllOrderHistory = async (req, res) => {
    try {
        const where = {};
        if (req.query.userId) where.userId = req.query.userId;
        const items = await OrderHistory.findAll({ where, include: { all: true } });
        res.status(200).json(items);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getOrderHistoryById = async (req, res) => {
    try {
        const item = await OrderHistory.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateOrderHistory = async (req, res) => {
    try {
        const item = await OrderHistory.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        await item.update(req.body);
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteOrderHistory = async (req, res) => {
    try {
        const item = await OrderHistory.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        await item.destroy();
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
