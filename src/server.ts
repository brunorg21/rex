import { fastify } from "fastify";
import cors from "@fastify/cors";
import { userRoutes } from "./routes/user-routes";
import { postRoutes } from "./routes/post-routes";
import { commentRoutes } from "./routes/comment-routes";
import { emailRoute } from "./routes/email-route";
import cookie, { FastifyCookieOptions } from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import { join } from "path";
import { followerRoute } from "./routes/follower-route";

const app = fastify();

app.register(fastifyStatic, {
  root: join(__dirname, "../uploads"),
  prefix: "/uploads/",
});

app.register(cors, {
  credentials: true,
  origin: "https://rex-front-pied.vercel.app",
  allowedHeaders: ["content-type"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
});

app.register(cookie, {
  secret: "5488943c-7a3b-4248-b7b6-8063baf9ef2d",
  parseOptions: {
    path: "/",
    maxAge: 1 * 60 * 60 * 24, //1 dia
    httpOnly: true,
    domain: "rex-front-pied.vercel.app",
    secure: true,
    sameSite: "none",
  },
}),
  app.register(commentRoutes);
app.register(userRoutes);
app.register(postRoutes);
app.register(emailRoute);
app.register(followerRoute);

const PORT = Number(process.env.PORT);

app
  .listen({
    port: PORT,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("Server is running..." + PORT);
  });
