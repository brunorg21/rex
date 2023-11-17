import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import { PostController } from "../controllers/post-controller";
import { postsSchema } from "../schemas/postsSchema";
import { auth } from "../middleware/auth";

const postController = new PostController();

export async function postRoutes(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1048576 * 25,
    },
    attachFieldsToBody: "keyValues",
    onFile: (part: any) => {
      part.value = {
        filename: part.filename,
        mimetype: part.mimetype,
        data: part.toBuffer(),
      };
    },
  });
  app.post(
    "/post",
    {
      preHandler: auth,
    },
    async (request, reply) => {
      const post = postsSchema.parse(request.body);

      const { user } = request.headers;

      postController.create(post, Number(user));

      reply.status(201);
    }
  );

  app.get(
    "/post",
    {
      preHandler: auth,
    },
    async (request, reply) => {
      const { user } = request.headers;

      const post = await postController.getAllPosts(Number(user));

      if (!post) {
        return reply.status(204).send({ message: "Nenhum post encontrado" });
      }

      return reply.status(200).send(post);
    }
  );
}
