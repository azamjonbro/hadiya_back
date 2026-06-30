const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected...');
        await sequelize.sync({ alter: true }); // Sync models
        console.log('Models synced.');
    } catch (error) {
        console.error('Error connecting to DB:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
