// 이거 안씀
import { Strategy as KakaoStrategy } from "passport-kakao";
import { PrismaClient, User } from "@prisma/client";
import axios from 'axios';

const prisma = new PrismaClient();

interface KakaoProfile {
  id: string | undefined;
  displayName: string;
}

const kakaoOptions = {
  clientID: process.env.KAKAO_ID!,
  callbackURL: "/auth/kakao/callback",
};

const kakao = new KakaoStrategy(
  kakaoOptions,
  async (
    accessToken: string,
    refreshToken: string,
    profile: KakaoProfile,
    done: (error?: Error | null, user?: User | undefined) => void,
  ) => {
    try {
      console.log("------kakao profile------");
      console.log(profile);

     const url =`https://kauth.kakao.com/oauth/authorize?client_id=${kakaoOptions.clientID}&redirect_uri=${kakaoOptions.callbackURL}&response_type=code&scope=account_email,gender`

     const res = await axios.post(url);
     console.log('------응답--------');
     console.log(res);
      const exUser = await prisma.user.findUnique({
        where: {
          snsId: profile.id?.toString(),
        },
      });
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await prisma.user.create({
          data: {
            nickname: profile.displayName,
            // 만약 만들고자 하는 서비스가 전반적으로 유저의 닉네임 노출도가 높고 필수적이라면
            // 그리고 sns로그인에서 닉네임 추출이 어렵다면 리다이렉트 주소에서 닉네임을 새로 받아서 저장해야 할 수도..
            // 하단에 예시 라우터핸들러 주석처리 참고
            snsId: profile.id?.toString(),
            provider: "kakao",
            // level: 0,
          },
        });
        done(null, newUser);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        done(error);
      } else {
        done(new Error("error"));
      }
    }
  },
);

export default kakao;

// 예시 라우터 핸들러⭐️
// app.get(
//     "/auth/kakao/callback",
//     passport.authenticate("kakao", { failureRedirect: "/login" }),
//
//		// 이 부분은 컨트롤러 함수로 분리
//     (req, res) => {
//         if (!req.user.nickname) {
//             // 닉네임이 없다면 닉네임을 설정하는 페이지로 리다이렉트
//             res.redirect("/settings/nickname");
//         } else {
//             // 닉네임이 있다면 메인페이지로 리다이렉트
//             res.redirect("/");
//         }
//     },
// );
