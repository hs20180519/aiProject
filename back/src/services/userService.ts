import { PrismaClient, User } from "@prisma/client";
import { UserDto } from "../dtos/userDto";
import { plainToInstance } from "class-transformer";

const prisma = new PrismaClient();

export const getUserById = async (userId: number): Promise<UserDto> => {
  const user: User | null = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("유저를 찾을 수 없습니다.");
  }

  return plainToInstance(UserDto, user);
};
