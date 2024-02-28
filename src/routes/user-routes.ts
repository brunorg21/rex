import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user-controller";
import {
  getUniqueUserRequestParams,
  userToUpdateSchema,
} from "../schemas/userSchema";
import { auth } from "../middleware/auth";
import { prisma } from "../../prisma/prismaClient";
import fastifyMultipart from "@fastify/multipart";
import { z } from "zod";
import { saveImage } from "../utils/saveImage";

const userController = new UserController();
export async function userRoutes(app: FastifyInstance) {
  app.post("/user", async (request, reply) => {
    await userController.create(request, reply);
  });

  app.post("/file", async (request, reply) => {
    const schema = z.object({
      file: z.any(),
    });
    const { file } = schema.parse(request.body);

    await saveImage(file);

    return file;
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
      return reply.send({ message: "Usuário desconectado" });
    }
  );

  app.get(
    "/users",
    {
      preHandler: auth,
    },
    async (request, reply) => {
      const users = await userController.getAll();

      if (!users) {
        return reply.status(404).send("Usuário não encontrado.");
      }

      return reply.status(200).send(users);
    }
  );
  app.get(
    "/user/:userId",
    {
      preHandler: auth,
    },
    async (request, reply) => {
      const { userId } = getUniqueUserRequestParams.parse(request.params);
      const user = await userController.getUniqueUser(Number(userId));

      if (!user) {
        return reply.status(404).send("Usuário não encontrado.");
      }

      return reply.status(200).send(user);
    }
  );
}
