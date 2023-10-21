import { Request } from "express";
import { User } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
  user?: User;
  token?: string;
}

export interface UserCreationData {
  password: string;
  name: string;
  nickname?: string;
  email: string;
}
