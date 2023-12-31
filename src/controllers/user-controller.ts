import { prisma } from "../../prisma/prismaClient";
import { IUser, IUserToAuth } from "../models/user-model";
import { compare, hash } from "bcryptjs";
import { generateToken } from "../utils/generateToken";
import { z } from "zod";
import {
  userSchema,
  userSchemaToLogin,
  userToUpdateSchema,
} from "../schemas/userSchema";
import { updateImage } from "../utils/updateImage";
import { saveImage } from "../utils/saveImage";
import { FastifyReply, FastifyRequest } from "fastify";

type UserToUpdate = z.infer<typeof userToUpdateSchema>;
export class UserController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { email, password, username } = userSchema.parse(request.body);

    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userAlreadyExists) {
      return reply.status(401).send({
        message: "Usuário já cadastrado!",
      });
    }

    const passwordHash = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        username,
      },
    });

    const token = generateToken(user.id);

    return reply.status(201).send({ token, user });
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = userSchemaToLogin.parse(request.body);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return reply.status(400).send({
        message: "Usuário ou senha inválidos ⚠️⚠️⚠️!",
      });
    }

    const passwordMatch = await compare(password, user.password);

    const token = generateToken(user.id);

    if (!passwordMatch) {
      reply.status(400).send({
        message: "Usuário ou senha inválidos ⚠️⚠️⚠️!",
      });
    }

    request.headers.authorization = token;

    reply.status(200).send({ token, user });
  }

  async update(userToUpdate: UserToUpdate, userId: number) {
    const { username, avatarUrl, email, password } = userToUpdate;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const destination = await updateImage(user?.avatar_url, avatarUrl);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
        email,
        password,
        avatar_url: destination,
      },
    });
  }
}
