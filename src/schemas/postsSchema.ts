import { z } from "zod";

export const postsSchema = z.object({
  title: z.string(),
  content: z.string().max(460),
  publishedAt: z.date().optional(),
  file: z
    .any()
    .optional()
    .refine((file) => !!file && file.mimetype.startsWith("image"), {
      message: "Somente arquivos de imagem são permitidos",
    }),
  tags: z.any().optional(),
});

export const uniquePostSchema = z.object({
  id: z.string(),
});
export const postsByUserSchema = z.object({
  userId: z.string(),
});

export const postToUpdateSchema = z.object({
  title: z
    .string()
    .max(20, {
      message: "Título deve conter no máximo 20 caracteres!",
    })
    .optional(),
  content: z.string().optional(),
  file: z
    .any()
    .optional()
    .refine((file) => !!file && file.mimetype.startsWith("image"), {
      message: "Somente arquivos de imagem são permitidos",
    }),
});

export const postToUpdateParamsSchema = z.object({
  postId: z.string(),
});
export const likeOnPostParamsSchema = z.object({
  postId: z.string(),
});
