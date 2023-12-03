import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";

export function auth(
  request: FastifyRequest,
  reply: FastifyReply,
  done: Function
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return reply.status(401).send({ message: "Token is missing" });
  }
  const [, token] = authToken?.split(" ");
  try {
    const { sub: userId } = verify(
      token,
      "5488943c-7a3b-4248-b7b6-8063baf9ef2d"
    );

    request.headers.user = String(userId);
    done();
  } catch (error) {
    return reply.status(401).send({ message: "Invalid Token" });
  }
}
