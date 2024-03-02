import { prisma } from "../../prisma/prismaClient";

import { compare, hash } from "bcryptjs";
import { generateToken } from "../utils/generateToken";
import { z } from "zod";
import {
  userSchema,
  userSchemaToLogin,
  userToUpdateSchema,
} from "../schemas/userSchema";

import { FastifyReply, FastifyRequest } from "fastify";
import { uploadImage } from "../utils/upload-image";

type UserToUpdate = z.infer<typeof userToUpdateSchema>;
export class UserController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { email, password, username, name } = userSchema.parse(request.body);

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
        name,
      },
      select: {
        name: true,
        avatarUrlId: true,
        email: true,
        username: true,
        id: true,
      },
    });

    const token = generateToken(user.id);

    request.headers.auth = token;

    return reply.status(201).send({ token, user });
  }

  async login(req: FastifyRequest, res: FastifyReply) {
    const { email, password } = userSchemaToLogin.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).send({
        message: "Usuário ou senha inválidos!",
      });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).send({
        message: "Usuário ou senha inválidos!",
      });
    }

    const token = generateToken(user.id);

    req.headers.auth = token;

    const userToSend = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
      select: {
        email: true,
        name: true,
        avatarUrlId: true,
        username: true,
        id: true,
      },
    });

    res.status(200).send({ token, user: userToSend });
  }

  async update(userToUpdate: UserToUpdate, userId: number) {
    const { username, avatarUrl, bio, name } = userToUpdate;

    const buffer: Buffer = await avatarUrl.data;

    const avatarId = await uploadImage(avatarUrl, buffer);

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
        avatarUrlId: avatarId,
        bio,
        name,
      },
      select: {
        email: true,
        name: true,
        avatarUrlId: true,
        username: true,
        id: true,
        bio: true,
      },
    });

    return updatedUser;
  }

  async getUniqueUser(userId: number) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        name: true,
        avatarUrlId: true,
        username: true,
        id: true,
        bio: true,
      },
    });

    return user;
  }
  async getAll() {
    const users = await prisma.user.findMany({
      orderBy: {
        name: "desc",
      },
      select: {
        email: true,
        name: true,
        avatarUrlId: true,
        username: true,
        id: true,
      },
    });

    return users;
  }
}
