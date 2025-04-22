const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Versi dari spesifikasi OpenAPI
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'API documentation for an E-commerce platform, supporting user registration, login, and product management.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: 'http://localhost:3001', // Base URL untuk server
      },
    ],
  },
  apis: ['./routes/index.js'], // Path ke file route kamu untuk di-generate dokumentasi
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
