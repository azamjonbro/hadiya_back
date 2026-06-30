const { Manager } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createManager = async (req, res) => {
    try {
        const { password, ...otherData } = req.body;
        if (password) {
            otherData.password = await bcrypt.hash(password, 10);
        }
        const item = await Manager.create(otherData);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.loginManager = async (req, res) => {
    try {
        const { username, password } = req.body;
        const manager = await Manager.findOne({ where: { username } });
        if (!manager) return res.status(404).json({ message: 'User not found' });
        
        if (!manager.password) return res.status(400).json({ message: 'Password not set for this user' });
        const isMatch = await bcrypt.compare(password, manager.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        
        const token = jwt.sign({ id: manager.id, role: 'manager' }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
        res.status(200).json({ token, manager });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllManager = async (req, res) => {
    try {
        const items = await Manager.findAll();
        res.status(200).json(items);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getManagerById = async (req, res) => {
    try {
        const item = await Manager.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateManager = async (req, res) => {
    try {
        const item = await Manager.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        
        const { password, ...otherData } = req.body;
        if (password) {
            otherData.password = await bcrypt.hash(password, 10);
        }
        await item.update(otherData);
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteManager = async (req, res) => {
    try {
        const item = await Manager.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        await item.destroy();
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
