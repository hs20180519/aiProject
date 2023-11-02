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
  profileImage: UserProps | null;
};

// 처음 로그인시 유저 프롭스가 들어옴
// 프로필 사진은 어디서 들고 오나?
// 로그인 api 호출시 어떤 값이 들어는지? 
// 거기에 유저 이미지가 있나용? 없으면 추가
// 그 후 usereducer에 추가 (이미함)

// 로그인 유저 이미지가 뭘로 떨어지는지?
// profile로 떨어지고 있나 아님 다른 명칭으로?
// 

export type Event =
  | { type: "LOGIN_SUCCESS"; payload: UserProps } // 로그인 성공
  | { type: "LOGOUT" } // 로그아웃
  | { type: "CHANGE_IMAGE"; payload: UserProps };
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
      return{
        ...userState,
        profileImage: action.payload,
      };
    default:
      return userState;
  }
}
