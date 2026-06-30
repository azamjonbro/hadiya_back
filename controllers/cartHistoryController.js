const { CartHistory } = require('../models');

exports.createCartHistory = async (req, res) => {
    try {
        const item = await CartHistory.create(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllCartHistory = async (req, res) => {
    try {
        const where = {};
        if (req.query.userId) where.userId = req.query.userId;
        const items = await CartHistory.findAll({ where, include: { all: true } });
        res.status(200).json(items);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCartHistoryById = async (req, res) => {
    try {
        const item = await CartHistory.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateCartHistory = async (req, res) => {
    try {
        const item = await CartHistory.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        await item.update(req.body);
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCartHistory = async (req, res) => {
    try {
        const item = await CartHistory.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        await item.destroy();
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
