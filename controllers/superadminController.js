const { Superadmin } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createSuperadmin = async (req, res) => {
    try {
        const { password, ...otherData } = req.body;
        if (password) {
            otherData.password = await bcrypt.hash(password, 10);
        }
        const item = await Superadmin.create(otherData);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.loginSuperadmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Superadmin.findOne({ where: { username } });
        if (!admin) return res.status(404).json({ message: 'User not found' });
        
        if (!admin.password) return res.status(400).json({ message: 'Password not set for this user' });
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        
        const token = jwt.sign({ id: admin.id, role: 'superadmin' }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
        res.status(200).json({ token, admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllSuperadmin = async (req, res) => {
    try {
        const items = await Superadmin.findAll();
        res.status(200).json(items);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getSuperadminById = async (req, res) => {
    try {
        const item = await Superadmin.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateSuperadmin = async (req, res) => {
    try {
        const item = await Superadmin.findByPk(req.params.id);
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


