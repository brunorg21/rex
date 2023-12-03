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
  app.post("/user", (request, reply) => {
    const user = userSchema.parse(request.body);

    userController.create(user);

    reply.status(201).send();
  });

  app.post("/user/login", async (request, reply) => {
    const userToAuth = userSchemaToLogin.parse(request.body);

    const { passwordMatch, token } = await userController.login(userToAuth);

    if (!passwordMatch) {
      reply.status(400).send("Usuário ou senha inválidos");
    }

    request.headers.authorization = token;

    reply.status(200).send({ token });
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
