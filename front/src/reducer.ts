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
  profileImage: string; /*이게 추가 되는거 맞나요?*/
}

export type UserState = {
  user: UserProps | null; // Props 타입을 사용자 정보로 사용하며 null인 경우 로그아웃 상태
  // profileImage: UserProps | null;
};

export type Event =
  | { type: "LOGIN_SUCCESS"; payload: UserProps } // 로그인 성공
  | { type: "LOGOUT" } // 로그아웃
  | { type: "CHANGE_IMAGE"; payload: string };
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
    case "CHANGE_IMAGE":
      console.log("전역 상태 프로필 이미지 변경");
      return {
        user: {
        ...userState.user,
        profileImage: action.payload,
      }
    };
    default:
      return userState;
  }
}
