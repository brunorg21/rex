import { z } from "zod";

export const likesSchema = z.object({
  postId: z.number(),
});
export const likesParamsSchema = z.object({
  postId: z.string(),
});
export const likeUpdateSchema = z.object({
  likeId: z.number(),
});
