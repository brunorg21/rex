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
});

app.register(cookie, {
  parseOptions: {
    path: "/",
    maxAge: 1 * 60 * 60 * 24, //1 dia
    httpOnly: true,
    domain: "https://rex-front-pied.vercel.app",
    secure: false,
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
