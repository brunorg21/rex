import { FastifyInstance } from "fastify";
import { z } from "zod";
import { FollowerController } from "../controllers/follower-controller";

const createFollowerRequestSchema = z.object({
  follower_username: z.string(),
  userId: z.number(),
});
const getFollowerRequestParamsSchema = z.object({
  userId: z.string(),
});

const deleteFollowerResquestBodySchema = z.object({
  followerId: z.string(),
});

const followerController = new FollowerController();

export async function followerRoute(app: FastifyInstance) {
  app.post(
    "/follower",

    async (request, reply) => {
      const createFollowerData = createFollowerRequestSchema.parse(
        request.body
      );

      const follower = await followerController.createFollower(
        createFollowerData
      );

      reply.status(201).send(follower);
    }
  );
  app.get(
    "/follower/:userId",

    async (request, reply) => {
      const getFollowerData = getFollowerRequestParamsSchema.parse(
        request.params
      );

      const followers = await followerController.getFollowers(getFollowerData);

      if (!followers) {
        return reply.status(200).send({
          message: "Nenhum seguidor encontrado",
        });
      }

      reply.status(200).send(followers);
    }
  );
  app.delete(
    "/follower/:followerId",

    async (request, reply) => {
      const { followerId } = deleteFollowerResquestBodySchema.parse(
        request.params
      );

      await followerController.deleteFollower({
        followerId: Number(followerId),
      });

      return reply.status(200).send();
    }
  );
}
