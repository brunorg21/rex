import { z } from "zod";

export const postsSchema = z.object({
  title: z.string(),
  content: z.string().max(280),
  attachments: z.string().array().optional(),
  publishedAt: z.date().optional(),
  file: z
    .any()
    .optional()
    .refine((file) => !!file && file.mimetype.startsWith("image"), {
      message: "Somente arquivos de imagem são permitidos",
    }),
});
