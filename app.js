const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');
const routes = require('./routes');
const { swaggerUi, specs } = require('./swagger/index');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require('path');
// Serve static images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api', routes);

// Global Error Handler
app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(async () => {
    console.log('Database synced successfully');
    
    // Boshlang'ich superadmin yaratish yoki parolini yangilash (superadmin qilib)
    try {
        const { Superadmin } = require('./models');
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('superadmin', 10);
        let adminUser = await Superadmin.findOne({ where: { username: 'admin' } });
        
        if (!adminUser) {
            await Superadmin.create({
                username: 'admin',
                password: hashedPassword,
                name: 'Asosiy Admin',
                email: 'admin@soatshop.uz',
                phone: '+998901234567',
                status: true
            });
            console.log('Default Superadmin created: admin / superadmin');
        } else {
            adminUser.password = hashedPassword;
            await adminUser.save();
            console.log('Superadmin password force updated to: superadmin');
        }
    } catch (err) {
        console.error('Failed to seed/update default superadmin:', err);
    }

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});

module.exports = app;
