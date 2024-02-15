import { prisma } from "../../prisma/prismaClient";

interface CreateFollowerData {
  userId: number;
  followerUsername: string;
}
interface GetFollowerData {
  userId: string;
}

export class FollowerController {
  async createFollower({ followerUsername, userId }: CreateFollowerData) {
    const follower = await prisma.follower.create({
      data: {
        follower_username: followerUsername,
        userId,
        follower_avatar_url: null,
      },
    });

    return follower;
  }
  async getFollowers({ userId }: GetFollowerData) {
    const followers = await prisma.follower.findMany({
      where: {
        userId: Number(userId),
      },
    });

    return followers;
  }
}
