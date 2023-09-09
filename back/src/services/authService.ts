import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const isEmailTaken = async (email: any) => {
	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});
	return !!user;
};

export const isNicknameTaken = async (nickname: string) => {
	const user = await prisma.user.findUnique({
		where: {
			nickname,
		},
	});
	return !!user;
};

export const createUser = async (userData: {
	email: any;
	name: string;
	nickname: string;
	password: string;
}) => {
	return prisma.user.create({
		data: userData,
	});
};
