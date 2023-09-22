import { z } from "zod";
import { postsSchema } from "./postsSchema";

export const userSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().max(10).min(6),
  posts: z.array(postsSchema),
});
