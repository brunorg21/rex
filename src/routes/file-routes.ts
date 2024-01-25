import { FastifyInstance } from "fastify";
import { auth } from "../middleware/auth";
import fs from "fs";
import { join } from "path";
import { z } from "zod";

const fileSchema = z.object({
  path: z.string(),
});

export async function fileRoutes(app: FastifyInstance) {
  app.post(
    "/file",
    {
      preHandler: auth,
    },
    async (request, reply) => {
      const { path } = fileSchema.parse(request.body);

      const image = fs.readFileSync(join(path));
      const mimeType = "image/png";

      reply.send(`data:${mimeType};base64,${image.toString("base64")}`);
    }
  );
}
