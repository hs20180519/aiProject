import { PrismaClient, User, VerifiCode } from "@prisma/client";
import { sendMail } from "../utils/sendMail";
import * as authInterface from "../interfaces/authInterface";
import { plainToClass } from "class-transformer";
import { UserDto } from "../dtos/userDto";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email: email },
  });
};

export const getVerifyCodeByEmail = async (email: string) => {
  return prisma.verifiCode.findUnique({
    where: { email },
  });
};

export const sendVerificationCode = async (email: string): Promise<void> => {
  const verificationCode: string = Math.floor(
    Math.random() * (999999 - 100000 + 1) + 100000,
  ).toString();
  await sendMail(email, verificationCode);
  await prisma.verifiCode.create({
    data: {
      email,
      code: verificationCode,
    },
  });
  return;
};

export const resendVerificationCode = async (email: string): Promise<void> => {
  const verificationCode: string = Math.floor(
    Math.random() * (999999 - 100000 + 1) + 100000,
  ).toString();
  await sendMail(email, verificationCode);
  await prisma.verifiCode.update({
    where: { email },
    data: { code: verificationCode },
  });
  return;
};

export const verifyEmail = async (email: string, code: string): Promise<boolean> => {
  const verificationCode: VerifiCode | null = await prisma.verifiCode.findUnique({
    where: { email },
  });
  if (!verificationCode) return false;
  if (verificationCode.code === code) {
    await prisma.verifiCode.delete({
      where: { email },
    });
    return true;
  } else return false;
};

export const signUpDuplicateCheck = async (email: string): Promise<User | null> => {
  return prisma.user.findFirst({
    where: {
      email: email,
    },
  });
};

export const createUser = async (userData: authInterface.UserCreationData): Promise<UserDto> => {
  const createdUser = prisma.user.create({
    data: userData,
  });
  return plainToClass(UserDto, createdUser);
};

export const editUser = async (userId: number, updatedData: Partial<User>): Promise<UserDto> => {
  const upsertedUser: User = await prisma.user.upsert({
    where: { id: userId },
    update: updatedData,
    create: updatedData,
  });
  if (!upsertedUser) throw new Error("유저 정보를 찾을 수 없습니다.");

  return plainToClass(UserDto, upsertedUser);
};

export const deleteUser = async (userId: number): Promise<null | UserDto> => {
  const user: User | null = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (user?.profileImage)
    fs.unlinkSync(path.join(__dirname, "../../", "public", user.profileImage));
  await prisma.user.delete({
    where: { id: userId },
  });
  return plainToClass(UserDto, user);
};
