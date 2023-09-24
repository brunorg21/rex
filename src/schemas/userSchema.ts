import { z } from "zod";

export const userSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().max(10).min(6),
});
