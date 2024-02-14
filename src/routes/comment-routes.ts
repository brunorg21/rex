import { FastifyInstance } from "fastify";
import { commentSchemaParams, commentsSchema } from "../schemas/commentsSchema";
import { CommentController } from "../controllers/comment-controller";
import { auth } from "../middleware/auth";

const commentController = new CommentController();

export async function commentRoutes(app: FastifyInstance) {
  app.post(
    "/comment/:postId",
    {
      preHandler: auth,
    },
    (request, reply) => {
      const { comment } = commentsSchema.parse(request.body);

      const { postId } = commentSchemaParams.parse(request.params);

      const { user } = request.headers;

      const commentToCreate = {
        comment,
        postId: Number(postId),
        userId: Number(user),
      };
      const createdComment = commentController.create(commentToCreate);

      reply.status(201).send(createdComment);
    }
  );
  app.get(
    "/comment/:postId",
    {
      preHandler: auth,
    },
    async (request, reply) => {
      const { postId } = commentSchemaParams.parse(request.params);

      const { comments } = await commentController.getAll(Number(postId));

      reply.status(201).send(comments);
    }
  );
}
