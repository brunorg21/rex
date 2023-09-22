import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user-controller";
import { userSchema } from "../schemas/userSchema";

const userController = new UserController();
export function userRoutes(app: FastifyInstance) {
  app.post("/user", (request, repy) => {
    const user = userSchema.parse(request.body);

    userController.create(user);
  });
}
