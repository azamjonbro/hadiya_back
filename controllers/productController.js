const { Product } = require('../models');

exports.createProduct = async (req, res) => {
    try {
        // Multer orqali fayl yuklangan bo'lsa (multipart/form-data)
        if (req.files && req.files.length > 0) {
            req.body.images = JSON.stringify(req.files.map(f => '/uploads/' + f.filename));
        }
        // JSON body orqali Base64 yoki URL massiv yuborilgan bo'lsa
        else if (req.body.images && typeof req.body.images === 'string') {
            try {
                JSON.parse(req.body.images); // Validatsiya — JSON string ekanligini tekshirish
            } catch (e) {
                req.body.images = JSON.stringify([req.body.images]);
            }
        } else if (Array.isArray(req.body.images)) {
            req.body.images = JSON.stringify(req.body.images);
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
            req.body.images = JSON.stringify(req.files.map(f => '/uploads/' + f.filename));
        } else if (req.body.images && typeof req.body.images === 'string') {
            try {
                JSON.parse(req.body.images);
            } catch (e) {
                req.body.images = JSON.stringify([req.body.images]);
            }
        } else if (Array.isArray(req.body.images)) {
            req.body.images = JSON.stringify(req.body.images);
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
