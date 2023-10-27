import localStrategy from "./localStrategy";
import jwtStrategy from "./jwtStrategy";
import { Strategy } from "passport";

export const local: Strategy = localStrategy;
export const jwt: Strategy = jwtStrategy;
