import { fastify } from "fastify";
import cors from "@fastify/cors";
import { userRoutes } from "./routes/user-routes";
import { prisma } from "../prisma/prismaClient";
import { postRoutes } from "./routes/post-routes";
import { commentRoutes } from "./routes/comment-routes";

const app = fastify();

app.register(cors, {
  origin: "*",
  methods: ["PUT", "POST", "GET", "DELETE"],
});

app.register(commentRoutes);
app.register(userRoutes);
app.register(postRoutes);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server is running...");
    prisma.$connect();
  });
