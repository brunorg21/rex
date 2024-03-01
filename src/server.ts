import { fastify } from "fastify";
import cors from "@fastify/cors";
import { userRoutes } from "./routes/user-routes";
import { postRoutes } from "./routes/post-routes";
import { commentRoutes } from "./routes/comment-routes";
import { emailRoute } from "./routes/email-route";
import fastifyStatic from "@fastify/static";
import { join } from "path";
import { followerRoute } from "./routes/follower-route";
import fastifyMultipart from "@fastify/multipart";

const app = fastify();

app.register(cors, {
  origin: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
  ],
  methods: ["POST", "DELETE", "PUT", "GET", "OPTIONS"],
});

app.register(commentRoutes);
app.register(userRoutes);
app.register(postRoutes);
app.register(emailRoute);
app.register(followerRoute);

const PORT = Number(process.env.PORT);

app
  .listen({
    port: PORT,
    host: process.env.NODE_ENV !== "development" ? "0.0.0.0" : "",
  })
  .then(() => {
    console.log("Server is running... " + PORT);
  });
