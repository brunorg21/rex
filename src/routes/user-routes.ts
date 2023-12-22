import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user-controller";
import {
  userSchema,
  userSchemaToLogin,
  userToUpdateSchema,
} from "../schemas/userSchema";
import { auth } from "../middleware/auth";
import fastifyMultipart from "@fastify/multipart";

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
      preHandler: auth,
    },
    (req, reply) => {
      const userToUpdate = userToUpdateSchema.parse(req.body);
      const { user } = req.headers;

      userController.update(userToUpdate, Number(user));

      return reply.status(201).send();
    }
  );
}
