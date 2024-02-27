import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";

export function auth(req: FastifyRequest, reply: FastifyReply, done: Function) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return reply.status(401).send({ message: "Usuário não autenticado" });
  }
  const token = authToken.split(" ")[1];
  try {
    const { sub: userId } = verify(
      token,
      "5488943c-7a3b-4248-b7b6-8063baf9ef2d"
    );

    req.headers.user = String(userId);
    done();
  } catch (error) {
    return reply.status(401).send({ message: "Invalid Token" });
  }
}
