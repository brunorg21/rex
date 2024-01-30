import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user-controller";
import { userToUpdateSchema } from "../schemas/userSchema";
import { auth } from "../middleware/auth";
import { prisma } from "../../prisma/prismaClient";
import fastifyMultipart from "@fastify/multipart";

const userController = new UserController();
export async function userRoutes(app: FastifyInstance) {
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
    async (req, reply) => {
      const userToUpdate = userToUpdateSchema.parse(req.body);
      const { user } = req.headers;

      const updatedUser = await userController.update(
        userToUpdate,
        Number(user)
      );

      return reply.status(201).send(updatedUser);
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
