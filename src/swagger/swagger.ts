import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MediTrack API',
            version: '1.0.0',
            description: 'API documentation for MediTrack prescription tracker',
        },
        servers: [
            {
                url: 'http://localhost:3000/api', // Adjust if needed
            },
        ],
    },
    apis: ['src/routes/**/*.ts'], // Only your route files (where swagger comments live)
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
