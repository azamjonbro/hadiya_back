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

// Serve static images
app.use('/uploads', express.static('uploads'));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api', routes);

// Global Error Handler
app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});

module.exports = app;
