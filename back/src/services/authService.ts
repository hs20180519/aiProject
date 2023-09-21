import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const signUpDuplicateCheck = async (email: string, nickname: string) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { nickname }],
            },
        });
        return {
            emailExists: user?.email === email,
            nicknameExists: user?.nickname === nickname,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createUser = async (userData: {
    email: string;
    name: string;
    nickname: string;
    password: string;
}) => {
    try {
        return await prisma.user.create({
            data: userData,
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const editUser = async (userId: number, updatedData: Partial<User>) => {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updatedData,
        });
        if (updatedUser) {
            const { password, ...userWithoutPassword } = updatedUser;
            return userWithoutPassword;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getUserById = async (userId: number) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteUser = async (userId: number) => {
    try {
        await prisma.user.delete({
            where: { id: userId },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};
