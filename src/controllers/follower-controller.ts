import { prisma } from "../../prisma/prismaClient";

interface CreateFollowerData {
  userId: number;
  follower_username: string;
}
interface GetFollowerData {
  userId: string;
}

export class FollowerController {
  async createFollower({ follower_username, userId }: CreateFollowerData) {
    const follower = await prisma.follower.create({
      data: {
        follower_username,
        userId,
        follower_avatar_url: null,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: follower.userId!,
      },
    });

    return {
      follower,
      username: user?.username,
    };
  }
  async getFollowers({ userId }: GetFollowerData) {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    const followersRelated = await prisma.follower.findMany({
      where: {
        userId: Number(userId),
      },
    });

    const followers = await prisma.follower.findMany();

    const followingCount = followers.filter(
      (follower) => follower.follower_username === currentUser?.username
    ).length;
    return {
      followersCount: followersRelated.length,
      followingCount,
      followersRelated,
    };
  }
}
