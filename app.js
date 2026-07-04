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
    'https://www.alharameenuz.uz',
    "http://www.alharameenuz.uz",
    'http://alharameenuz.uz',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3055'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', routes);

app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 3000;

console.log("Connecting to PostgreSQL and syncing models...");
sequelize.sync({ alter: true }).then(async () => {
    console.log("Database synced successfully.");
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
            console.log("Default superadmin created.");
        } else {
            adminUser.password = hashedPassword;
            await adminUser.save();
            console.log("Default superadmin password verified/updated.");
        }
    } catch (err) {
        console.error("Error verifying/creating default superadmin:", err);
    }

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Sequelize startup error (Database connection failed):");
    console.error(err);
    process.exit(1);
});

module.exports = app;
