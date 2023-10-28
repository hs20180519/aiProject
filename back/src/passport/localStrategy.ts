import { PrismaClient, User } from "@prisma/client";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

/** @description local 전략*/
const local: LocalStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (
    email: string,
    password: string,
    done: (error: Error | null, user?: User | false, info?: { message: string }) => void,
  ) => {
    try {
      const user: User | null = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user?.password) {
        return done(null, false, {
          message: "이메일 또는 비밀번호가 일치하지 않습니다.",
        });
      }
      const result = await bcrypt.compare(password, user.password);
      if (!result) {
        return done(null, false, {
          message: "이메일 또는 비밀번호가 일치하지 않습니다.",
        });
      }
      return done(null, user);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        return done(error);
      } else {
        done(new Error("Unknown Error"));
      }
    }
  },
);
export default local;
