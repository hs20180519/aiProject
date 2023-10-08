import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserById = async (userId: number): Promise<Partial<User>> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("유저를 찾을 수 없습니다.");
  }

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};
