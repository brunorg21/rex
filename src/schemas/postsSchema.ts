import { z } from "zod";

export const postsSchema = z.object({
  title: z.string(),
  content: z.string().max(280),
  attachments: z.string(),
  userId: z.number(),
  publishedAt: z.date(),
});
