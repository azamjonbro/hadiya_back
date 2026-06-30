const { LikesHistory } = require('../models');

exports.createLikesHistory = async (req, res) => {
    try {
        const item = await LikesHistory.create(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllLikesHistory = async (req, res) => {
    try {
        const where = {};
        if (req.query.userId) where.userId = req.query.userId;
        const items = await LikesHistory.findAll({ where, include: { all: true } });
        res.status(200).json(items);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getLikesHistoryById = async (req, res) => {
    try {
        const item = await LikesHistory.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateLikesHistory = async (req, res) => {
    try {
        const item = await LikesHistory.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        await item.update(req.body);
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteLikesHistory = async (req, res) => {
    try {
        const item = await LikesHistory.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        await item.destroy();
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
