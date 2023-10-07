import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserById = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};
