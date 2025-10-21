const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentación de la API de Biblio App.',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api-produccion.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        CognitoAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token de AWS Cognito'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Error interno del servidor'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'usuario@ejemplo.com'
            },
            nombre: {
              type: 'string',
              example: 'Juan Pérez'
            }
          }
        },
        Book: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'OL123456W'
            },
            title: {
              type: 'string',
              example: 'Harry Potter y la Piedra Filosofal'
            },
            author: {
              type: 'string',
              example: 'J.K. Rowling'
            },
            year: {
              type: 'string',
              example: '1997'
            },
            price: {
              type: 'number',
              example: 25000
            },
            cover: {
              type: 'string',
              example: 'https://covers.openlibrary.org/b/id/12345-M.jpg'
            }
          }
        },
        Card: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              example: 1
            },
            idUsuario: {
              type: 'number',
              example: 123
            },
            numeroTarjeta: {
              type: 'string',
              example: '4532XXXXXXXX1234'
            },
            nombreTitular: {
              type: 'string',
              example: 'Juan Pérez'
            },
            fechaVencimiento: {
              type: 'string',
              example: '12/25'
            }
          }
        },
        ChatMessage: {
          type: 'object',
          required: ['message'],
          properties: {
            message: {
              type: 'string',
              example: '¿Qué libros de ciencia ficción me recomiendas?'
            },
            conversationHistory: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  role: {
                    type: 'string',
                    enum: ['user', 'assistant'],
                    example: 'user'
                  },
                  content: {
                    type: 'string',
                    example: 'Hola'
                  }
                }
              }
            }
          }
        }
      }
    },
    security: []
  },
  apis: [
    './routes/*.js',           // Para documentación en archivos de rutas
    './controllers/*.js',      // Para documentación en controllers (opcional)
    './config/swagger.config.js' // Para que lea los schemas de este archivo
  ]
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
