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
      commentController.create(commentToCreate);

      reply.status(201).send();
    }
  );
}
