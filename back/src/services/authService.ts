import { PrismaClient } from "@prisma/client";

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
