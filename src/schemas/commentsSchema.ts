import { z } from "zod";

export const commentsSchema = z.object({
  comment: z.string(),
});

export const commentSchemaParams = z.object({
  postId: z.string(),
});
export const deleteCommentSchemaParams = z.object({
  commentId: z.string(),
});
