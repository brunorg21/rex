import { z } from "zod";

export const userSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().max(20).min(6),
  name: z.string(),
});

export const userSchemaToLogin = z.object({
  email: z.string().email(),
  password: z.string().max(20).min(6),
});

export const userToUpdateSchema = z.object({
  username: z.string().optional(),
  avatarUrl: z
    .any()
    .refine((file) => !!file && file.mimetype.startsWith("image"), {
      message: "Somente arquivos de imagem são permitidos",
    }),
  bio: z.string().optional(),
  name: z.string(),
});

export const getUniqueUserRequestParams = z.object({
  userId: z.string(),
});
