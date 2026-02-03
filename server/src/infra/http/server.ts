import cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastify } from "fastify";
import { hasZodFastifySchemaValidationErrors, jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { env } from "node:process";
import { uploadLinkRoute } from "./routes/upload-link";

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.validation,
    });
  }

  // Envia erro para observabilidade
  console.log('Error:', error);

  return reply.status(500).send({
    message: 'Internal server error.',
  });
});

server.register(cors, {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Upload Link API',
      description: 'API for generating upload links',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});
server.register(uploadLinkRoute);
server.register(fastifyMultipart);
server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

console.log(env.DATABASE_URL);

server.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running on http://localhost:3333');
});