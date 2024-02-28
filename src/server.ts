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
  origin: "*",
  methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

app.register(fastifyStatic, {
  root: join(__dirname, "../uploads"),
  prefix: "/uploads/",
});

app.register(fastifyMultipart, {
  attachFieldsToBody: "keyValues",
  onFile: (part: any) => {
    part.value = {
      filename: part.filename,
      mimetype: part.mimetype,
      data: part.toBuffer(),
    };
  },
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
    host: process.env.PORT !== "development" ? "0.0.0.0" : "",
  })
  .then(() => {
    console.log("Server is running... ");
  });
