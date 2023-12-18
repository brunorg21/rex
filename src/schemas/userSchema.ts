import { z } from "zod";

export const userSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().max(10).min(6),
});

export const userSchemaToLogin = z.object({
  email: z.string().email(),
  password: z.string().max(10).min(6),
});

export const userToUpdateSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  email: z.string().optional(),
  avatarUrl: z.any().optional(),
});
