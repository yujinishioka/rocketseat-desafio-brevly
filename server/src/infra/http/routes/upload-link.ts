import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const uploadLinkRoute: FastifyPluginAsyncZod = async server => {
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
    await db.insert(schema.uploads).values({
      name: request.body.name,
      url: request.body.url,
      remoteKey: "generated-remote-key",
    });
    
    return reply.status(201).send({ uploadLinkId: "generated-upload-link-id" });
  });
}