import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user-controller";
import { userToUpdateSchema } from "../schemas/userSchema";
import { auth } from "../middleware/auth";
import { prisma } from "../../prisma/prismaClient";

const userController = new UserController();
export async function userRoutes(app: FastifyInstance) {
  app.post("/user", async (request, reply) => {
    await userController.create(request, reply);
  });

  app.post("/user/login", async (request, reply) => {
    await userController.login(request, reply);
  });

  app.put(
    "/user",
    {
      preHandler: [auth],
    },
    (req, reply) => {
      const userToUpdate = userToUpdateSchema.parse(req.body);
      const { user } = req.headers;

      userController.update(userToUpdate, Number(user));

      return reply.status(201).send();
    }
  );

  app.get(
    "/me",
    {
      preHandler: auth,
    },
    async (request, reply) => {
      const { user: userId } = request.headers;

      const user = await prisma.user.findFirstOrThrow({
        where: {
          id: Number(userId),
        },
        select: {
          avatar_url: true,
          name: true,
          email: true,
          username: true,
        },
      });

      return reply.status(200).send({ user });
    }
  );

  app.get(
    "/sign-out",
    {
      preHandler: auth,
    },
    async (request, reply) => {
      reply.clearCookie("auth");

      return reply.send({ message: "Usuário desconectado" });
    }
  );
}
