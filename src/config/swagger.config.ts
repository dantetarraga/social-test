import swaggerJSDoc from 'swagger-jsdoc'
import { SwaggerUiOptions } from 'swagger-ui-express'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Social Hub API',
      version: '1.0.0',
      description: 'API para gestión de perfiles sociales y publicaciones',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            fullName: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN'] },
            isVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        Profile: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
            },
            description: {
              type: 'string',
              minLength: 2,
              maxLength: 500,
            },
            color: {
              type: 'string',
              pattern: '^#[A-Fa-f0-9]{6}$',
              example: '#3B82F6',
            },
            userId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['name', 'description'],
        },

        SocialConnection: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            socialType: {
              type: 'string',
              enum: ['tiktok', 'facebook', 'instagram', 'youtube'],
            },
            socialAccountId: { type: 'string' },
            socialUsername: { type: 'string' },
            token: { type: 'string' },
            refreshToken: { type: 'string' },
            expires: { type: 'string', format: 'date-time' },
            refreshExpires: { type: 'string', format: 'date-time' },
            scope: { type: 'string' },
            tokenType: { type: 'string', default: 'Bearer' },
            isActive: { type: 'boolean', default: true },
            profileId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        Post: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            content: {
              type: 'string',
              minLength: 1,
              maxLength: 500,
            },
            media: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  type: { type: 'string', enum: ['image', 'video'] },
                  filename: { type: 'string' },
                },
                required: ['url', 'type', 'filename'],
              },
            },
            platforms: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  profileId: { type: 'integer', minimum: 1 },
                  connectionId: { type: 'integer', minimum: 1 },
                },
                required: ['profileId', 'connectionId'],
              },
            },
            status: {
              type: 'string',
              enum: ['SCHEDULED', 'PUBLISHED', 'FAILED', 'DRAFT'],
            },
            scheduledAt: { type: 'string', format: 'date-time' },
            publishNow: { type: 'boolean', default: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['content', 'platforms'],
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            error: { type: 'string' },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/docs/*.ts', './src/routes/*.ts'],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
}

export const swaggerUiOptions: SwaggerUiOptions = {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .auth-wrapper { margin-bottom: 20px }
  `,
  customSiteTitle: 'Social Hub API',
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'list',
    filter: true,
  },
}

export const specs = swaggerJSDoc(options)
