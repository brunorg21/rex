import { fastify } from "fastify";
import cors from "@fastify/cors";
import { userRoutes } from "./routes/user-routes";
import { prisma } from "../prisma/prismaClient";
import { postRoutes } from "./routes/post-routes";
import { commentRoutes } from "./routes/comment-routes";
import { emailRoute } from "./routes/email-route";
import cookie, { FastifyCookieOptions } from "@fastify/cookie";

const app = fastify();

app.register(cors, {
  credentials: true,
  origin: true,
  methods: ["PUT", "POST", "GET", "DELETE", "OPTIONS", "PUTCH", "HEAD"],
  exposedHeaders: ["set-cookie"],
});

app.register(cookie, {
  secret: "my-secret",
  parseOptions: {},
  setOptions: {
    path: "/",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  },
} as FastifyCookieOptions);
app.register(commentRoutes);
app.register(userRoutes);
app.register(postRoutes);
app.register(emailRoute);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server is running...");
    prisma.$connect();
  });
