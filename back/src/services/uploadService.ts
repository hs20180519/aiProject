import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export const uploadProfileImage = async (userId: number, imageUrl: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) throw new Error("유저를 찾을 수 없습니다.");

    if (user.profileImage) {
        const absoluteImagePath = path.join(
            __dirname,
            "../..",
            "public",
            user.profileImage,
        );
        fs.unlinkSync(absoluteImagePath);
    }
    await prisma.user.update({
        where: { id: userId },
        data: { profileImage: imageUrl },
    });
    return imageUrl;
};
