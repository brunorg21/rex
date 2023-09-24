import { prisma } from "../../prisma/prismaClient";
import { IUser } from "../models/user-model";
import { compare, hash } from "bcryptjs";
import { generateToken } from "../utils/generateToken";

export class UserController {
  async create(user: IUser) {
    const { email, password, username } = user;

    const passwordHash = await hash(password, 8);

    await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        username,
      },
    });
  }

  async login(userToAuth: IUser) {
    const { email, password } = userToAuth;

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });

    const passwordMatch = await compare(password, user.password);

    const token = generateToken(user.id);

    return { passwordMatch, token };
  }
}
