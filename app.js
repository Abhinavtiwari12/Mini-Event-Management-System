import express from 'express';
import cors from 'cors';
import yaml from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

import apiRoutes from './src/router/router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Load OpenAPI Specification
const openapiDoc = yaml.load(path.join(__dirname, './openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));

// Routes - All aggregated to a single file as requested
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to Mini Event Management API! Visit /api-docs for Swagger UI.');
});

export default app;
