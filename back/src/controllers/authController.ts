import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import { User } from "@prisma/client";

interface AuthenticatedRequest extends Request {
	user?: User;
	token?: string;
}

export const createUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email, password, name, nickname } = req.body;
		const emailDuplicateCheck = await authService.isEmailTaken(email);
		const nicknameDuplicateCheck = await authService.isNicknameTaken(
			nickname,
		);
		if (emailDuplicateCheck)
			return res
				.status(409)
				.json({ message: "이미 존재하는 이메일입니다." });
		if (nicknameDuplicateCheck)
			return res
				.status(409)
				.json({ message: "이미 존재하는 닉네임입니다." });
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await authService.createUser({
			email,
			name,
			nickname,
			password: hashedPassword,
		});
		return res.status(201).json({
			message: `회원가입에 성공했습니다 :: ${newUser.nickname}`,
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
};

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user)
			return res
				.status(401)
				.json({ message: "유효하지 않은 사용자 정보입니다." });
		const loginUser = {
			token: authReq.token,
			user: authReq.user.name,
			nickname: authReq.user.nickname,
		};
		res.status(200).json({
			message: `어서오세요 ${loginUser.nickname}님!`,
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
};
