import {OpenApiGeneratorV31, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';


export const swaggerRegistry = new OpenAPIRegistry();

import '../swagger/allRoutes'


const generator = new OpenApiGeneratorV31(swaggerRegistry.definitions);
export const swaggerDocumentation = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'Microservices Identity Service',
    description: 'Microservices Identity Service API documentation',
    termsOfService: 'https://example.com/terms/',
    contact: {
      name: 'API Support',
      url: 'https://example.com/support',
      email: '',
    },
    version: '1.0.0',
  },
});