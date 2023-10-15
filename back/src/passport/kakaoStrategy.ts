import { PrismaClient, User } from "@prisma/client";
import { Strategy as KakaoStrategy } from "passport-local";

const prisma = new PrismaClient();

/** @description local 전략*/
const kakao = new KakaoStrategy(
  {
    usernameField: "snsId",
    passwordField: "password",
  },
  async (
    snsId: string,
    password: string,
    done: (error: Error | null, user?: User | false, info?: { message: string }) => void,
  ) => {
    try {
      const user: User | null = await prisma.user.findUnique({
        where: {
          snsId: snsId,
        },
      });

      if (user) {
        return done(null, user);
      }
    } catch (error) {
      if (error instanceof Error) {
        return done(error);
      } else {
        done(new Error("Unknown Error"));
      }
    }
  },
);
export default kakao;
