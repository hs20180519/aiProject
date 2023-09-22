import { PrismaClient, User } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

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
    email: string;
    name: string;
    nickname: string;
    password: string;
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

export const getUserById = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
};

export const deleteUser = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (user?.profileImage)
        fs.unlinkSync(
            path.join(__dirname, "../../", "public", user.profileImage),
        );
    await prisma.user.delete({
        where: { id: userId },
    });
};
