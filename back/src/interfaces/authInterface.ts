import { Request } from "express";
import { User } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
  user?: User;
  token?: string;
}

export interface UserCreationData {
  password: string;
  level: number;
  name: string;
  nickname: string;
  email: string;
}

export interface DuplicateCheckResult {
  emailExists: boolean;
  nicknameExists: boolean;
}
