import { fastify } from "fastify";
import { userRoutes } from "./routes/user-routes";
import { prisma } from "../prisma/prismaClient";

const app = fastify();

app.register(userRoutes);

app
  .listen({
    port: 3333,
  })
  .then(() => prisma.$connect());
