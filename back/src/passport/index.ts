import localStrategy from "./localStrategy";
import jwtStrategy from "./jwtStrategy";
import kakaoStrategy from "./kakaoStrategy";

export const kakao = kakaoStrategy;
export const local = localStrategy;
export const jwt = jwtStrategy;
