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
  origin: "https://rex-front-pied.vercel.app",
  allowedHeaders: ["content-type"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  credentials: true,
});

app.register(cookie, {
  secret: "my-secret",
  parseOptions: {
    httpOnly: process.env.PORT !== "development",
    secure: process.env.PORT !== "development",
    path: "/",
    maxAge: 1 * 60 * 60 * 24,
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
    host: process.env.PORT !== "development" ? "0.0.0.0" : "",
  })
  .then(() => {
    console.log("Server is running... " + PORT);
  });
