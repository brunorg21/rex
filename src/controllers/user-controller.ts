import { prisma } from "../../prisma/prismaClient";
import { IUser, IUserToAuth } from "../models/user-model";
import { compare, hash } from "bcryptjs";
import { generateToken } from "../utils/generateToken";
import { z } from "zod";
import { userToUpdateSchema } from "../schemas/userSchema";
import { updateImage } from "../utils/updateImage";
import { saveImage } from "../utils/saveImage";

type UserToUpdate = z.infer<typeof userToUpdateSchema>;
export class UserController {
  async create(user: IUser) {
    const { email, password, username } = user;

    const passwordHash = await hash(password, 8);

    const userCreated = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        username,
      },
    });

    const token = generateToken(userCreated.id);

    return { token, userCreated };
  }

  async login(userToAuth: IUserToAuth) {
    const { email, password } = userToAuth;

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });

    const passwordMatch = await compare(password, user.password);

    const token = generateToken(user.id);

    return { passwordMatch, token, user };
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
