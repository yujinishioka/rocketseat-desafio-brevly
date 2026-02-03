import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import crypto from "node:crypto";
import { z } from "zod";

export const uploadLinkRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    "/uploads",
    {
      schema: {
        summary: "List uploads",
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              url: z.string(),
              access: z.number(),
              remoteKey: z.string().nullable().optional(),
              createdAt: z.any().optional(),
            })
          ),
        },
      },
    },
    async (_request, reply) => {
      const uploads = await db
        .select()
        .from(schema.uploads)

      return reply.status(200).send(uploads);
    }
  );
  
  server.post("/uploads", {
    schema: {
      summary: "Generate an upload link",
      body: z.object({
        name: z.string(),
        url: z.string(),
      }),
      response: {
        201: z.object({ uploadLinkId: z.string()}),
        400: z.object({ message: z.string() }),
        409: z.object({ message: z.string() }).describe("Upload already exists"),
      },
    },
  }, async (request, reply) => {
    const remoteKey = crypto.randomUUID();

    await db.insert(schema.uploads).values({
      name: request.body.name,
      url: request.body.url,
      remoteKey,
    });
    
    return reply.status(201).send({ uploadLinkId: "generated-upload-link-id" });
  });
}