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
  origin: "*",
  methods: ["PUT", "POST", "GET", "DELETE", "HEAD"],
});

app.register(cookie, {
  secret: "my-secret",
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
app.register(followerRoute);

const PORT = Number(process.env.PORT);
const DATABASE = Number(process.env.DATABASE_URL);

app
  .listen({
    port: PORT,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("Server is running..." + PORT + DATABASE);
  });
