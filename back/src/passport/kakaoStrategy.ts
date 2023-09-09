import { Strategy as KakaoStrategy } from "passport-kakao";
import { PrismaClient, User } from "@prisma/client";

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
		done: (error: any, user?: User | undefined) => void,
	) => {
		try {
			const exUser = await prisma.user.findUnique({
				where: {
					snsId: profile.id,
				},
			});
			if (exUser) {
				done(null, exUser);
			} else {
				const newUser = await prisma.user.create({
					data: {
						nickname: profile.displayName,
						snsId: profile.id,
						snsProvider: "kakao",
					},
				});
				done(null, newUser);
			}
		} catch (error) {
			console.error(error);
			done(error);
		}
	},
);

export default kakao;
