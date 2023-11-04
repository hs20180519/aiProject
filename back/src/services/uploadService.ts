import { PrismaClient, User } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export const uploadProfileImage = async (userId: number, imageUrl: string): Promise<string> => {
  const user: User | null = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) throw new Error("유저를 찾을 수 없습니다.");

  if (user.profileImage) {
    const serverUrl = process.env.SERVER_URL || "http://localhost:8000";
    const relativeImagePath = user.profileImage.replace(serverUrl, "").replace(/^\//, "");
    const absoluteImagePath = path.join(__dirname, "../..", "public", relativeImagePath);
    if (fs.existsSync(absoluteImagePath)) {
      fs.unlinkSync(absoluteImagePath);
    }
  }

  // 역슬래시를 슬래시로 변경
  const webFriendlyUrl = imageUrl.replace(/\\/g, "/");

  // 환경변수에서 서버 URL을 가져오고 끝의 /를 제거
  const serverUrl = (process.env.SERVER_URL || "").replace(/\/$/, "");

  // 최종 URL
  const finalUrl = `${serverUrl}${webFriendlyUrl.startsWith("/") ? "" : "/"}${webFriendlyUrl}`;
  await prisma.user.update({
    where: { id: userId },
    data: { profileImage: finalUrl },
  });

  return finalUrl;
};
