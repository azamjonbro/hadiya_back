const { Product } = require('../models');

exports.createProduct = async (req, res) => {
    try {
        if (req.files) {
            req.body.images = req.files.map(f => f.path);
        }
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllProduct = async (req, res) => {
    try {
        const products = await Product.findAll({ include: { all: true } });
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, { include: { all: true } });
        if (!product) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Not found' });
        if (req.files && req.files.length > 0) {
            req.body.images = req.files.map(f => f.path);
        }
        await product.update(req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Not found' });
        await product.destroy();
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
