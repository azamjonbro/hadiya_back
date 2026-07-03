const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');
const routes = require('./routes');
const { swaggerUi, specs } = require('./swagger/index');

const app = express();

app.use(cors({
  origin: [
    'https://alharameenadmin.netlify.app',
    'https://alharameenuz.netlify.app',
    'https://alharameenuz.uz',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3055'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', routes);

app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(async () => {
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
        } else {
            adminUser.password = hashedPassword;
            await adminUser.save();
        }
    } catch (err) {
        // silent
    }

    app.listen(PORT);
}).catch(() => { });

module.exports = app;
