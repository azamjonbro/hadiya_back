const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SoatShop API',
            version: '1.0.0',
            description: 'Complete CRUD API documentation for all 8 models (Dynamically generated)',
        },
        tags: [
            { name: 'Superadmin', description: 'Superadmin operations' },
            { name: 'Manager', description: 'Manager operations' },
            { name: 'User', description: 'User operations' },
            { name: 'Category', description: 'Category operations' },
            { name: 'Product', description: 'Product operations' },
            { name: 'CartHistory', description: 'Cart History operations' },
            { name: 'OrderHistory', description: 'Order History operations' },
            { name: 'LikesHistory', description: 'Likes History operations' }
        ],
        servers: [
            {
                url: '/',
                description: 'Default server'
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
