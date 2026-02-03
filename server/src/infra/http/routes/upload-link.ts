import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { eq, sql } from "drizzle-orm";
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
        .orderBy(sql`${schema.uploads.access} DESC`)

      return reply.status(200).send(uploads);
    }
  );

  server.get(
    "/uploads/:id",
    {
      schema: {
        summary: "Get upload by id",
        params: z.object({ id: z.string() }),
        response: {
          200: z.object({
            id: z.string(),
            name: z.string(),
            url: z.string(),
            access: z.number().optional(),
          }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
  
      const rows = await db
        .select()
        .from(schema.uploads)
        .where(eq(schema.uploads.id, id))
        .limit(1);
  
      if (!rows.length) return reply.status(404).send({ message: "Not found" });
      return reply.send(rows[0]);
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

  server.patch(
    "/uploads/:id/access",
    {
      schema: {
        summary: "Increment upload access",
        params: z.object({ id: z.string() }),
        response: {
          200: z.object({ ok: z.boolean() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
 
      const updated = await db
        .update(schema.uploads)
        .set({
          access: sql`${schema.uploads.access} + 1`,
        })
        .where(eq(schema.uploads.id, id))
        .returning({ id: schema.uploads.id });
 
      if (!updated.length) {
        return reply.status(404).send({ message: "Upload not found" });
      }
 
      return reply.send({ ok: true });
    }
  );

  server.delete(
    "/uploads/:id",
    {
      schema: {
        summary: "Delete upload by id",
        params: z.object({ id: z.string() }),
        response: {
          200: z.object({ ok: z.boolean() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const deleted = await db
        .delete(schema.uploads)
        .where(eq(schema.uploads.id, id))
        .returning({ id: schema.uploads.id });
 
      if (!deleted.length) {
        return reply.status(404).send({ message: "Upload not found" });
      }
 
      return reply.send({ ok: true });
    }
  );
}