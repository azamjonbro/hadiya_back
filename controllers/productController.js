const { Product } = require('../models');
const fs = require('fs');
const path = require('path');

// Helper to convert base64 image strings to physical files on the server
const processImages = (imagesInput) => {
  let imagesArray = [];
  
  if (typeof imagesInput === 'string') {
    try {
      imagesArray = JSON.parse(imagesInput);
    } catch (e) {
      imagesArray = [imagesInput];
    }
  } else if (Array.isArray(imagesInput)) {
    imagesArray = imagesInput;
  } else {
    return imagesInput;
  }

  const processed = imagesArray.map(img => {
    if (typeof img === 'string' && img.startsWith('data:image/')) {
      try {
        const matches = img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return img;
        }
        
        const ext = matches[1].split('/')[1] || 'png';
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
        const uploadsDir = path.join(__dirname, '../uploads');
        
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, buffer);
        return `/uploads/${filename}`;
      } catch (error) {
        console.error('Error saving base64 image:', error);
        return img;
      }
    }
    return img; // Return unchanged if not base64
  });

  return JSON.stringify(processed);
};

exports.createProduct = async (req, res) => {
    try {
        // Multer orqali fayl yuklangan bo'lsa (multipart/form-data)
        if (req.files && req.files.length > 0) {
            req.body.images = JSON.stringify(req.files.map(f => '/uploads/' + f.filename));
        } else if (req.body.images) {
            req.body.images = processImages(req.body.images);
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
        } else if (req.body.images) {
            req.body.images = processImages(req.body.images);
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
