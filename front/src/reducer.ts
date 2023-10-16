import { Dispatch } from "react";

export interface UserProps {
  id: number;
  name: string;
  email: string;
  nickname?: string;
  profile: string;
  snsId?: string;
  provider?: string;
  token: string;
}

export type UserState = {
  user: UserProps | null; // Props 타입을 사용자 정보로 사용하며 null인 경우 로그아웃 상태
};

export type Event =
  | { type: "LOGIN_SUCCESS"; payload: UserProps } // 로그인 성공
  | { type: "LOGOUT" }; // 로그아웃

export type DispatchEvent = Dispatch<Event>;

export function loginReducer(userState: UserState, action: Event): UserState {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      console.log("%c로그인!", "color: #d93d1a;");
      return {
        ...userState,
        user: action.payload,
      };
    case "LOGOUT":
      console.log("%c로그아웃!", "color: #d93d1a;");
      return {
        ...userState,
        user: null,
      };
    default:
      return userState;
  }
}
