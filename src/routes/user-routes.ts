import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user-controller";
import { userSchema } from "../schemas/userSchema";

const userController = new UserController();
export async function userRoutes(app: FastifyInstance) {
  app.post("/user", (request, reply) => {
    const user = userSchema.parse(request.body);

    userController.create(user);

    reply.status(201).send();
  });

  app.post("/user/login", async (request, reply) => {
    const userToAuth = userSchema.parse(request.body);

    const { passwordMatch, token } = await userController.login(userToAuth);

    if (!passwordMatch) {
      reply.status(400).send("Usuário ou senha inválidos");
    }

    request.headers.authorization = token;

    reply.status(200).send({ token });
  });
}
