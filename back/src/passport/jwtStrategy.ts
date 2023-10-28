import passportJWT from "passport-jwt";
import { PrismaClient, User } from "@prisma/client";

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const prisma = new PrismaClient();

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

/** @description jwt전략*/
const jwt = new JwtStrategy(jwtOptions, async (payload, done): Promise<void> => {
  try {
    const user: User | null = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    console.error(error);
    done(error, false);
  }
});

export default jwt;
