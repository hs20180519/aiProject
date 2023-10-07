import { PrismaClient, User } from "@prisma/client";
import { sendMail } from "../utils/sendMail";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email: email },
  });
};

export const sendVerificationCode = async (email: string) => {
  const verificationCode = Math.floor(Math.random() * 1000000).toString();
  await sendMail(email, verificationCode);
  await prisma.verifiCode.create({
    data: {
      email,
      code: verificationCode,
    },
  });
  return;
};

export const verifyEmail = async (email: string, code: string) => {
  const verificationCode = await prisma.verifiCode.findUnique({
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

export const getUserByNickname = async (nickname: string) => {
  return prisma.user.findUnique({
    where: { nickname },
  });
};

export const signUpDuplicateCheck = async (email: string, nickname: string) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { nickname }],
    },
  });
  return {
    emailExists: user?.email === email,
    nicknameExists: user?.nickname === nickname,
  };
};

export const createUser = async (userData: {
  password: string;
  level: number;
  name: any;
  nickname: any;
  email: any;
}) => {
  return prisma.user.create({
    data: userData,
  });
};

export const editUser = async (userId: number, updatedData: Partial<User>) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updatedData,
  });
  if (updatedUser) {
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
};

export const deleteUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (user?.profileImage)
    fs.unlinkSync(path.join(__dirname, "../../", "public", user.profileImage));
  await prisma.user.delete({
    where: { id: userId },
  });
  return user;
};
