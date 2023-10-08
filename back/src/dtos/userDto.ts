import { Exclude } from "class-transformer";

export class UserDto {
  id!: number;
  email?: string;
  name?: string;
  nickname?: string;
  @Exclude()
  password?: string;
  snsId?: string;
  snsProvider?: string;
  profileImage?: string;
  level?: number;
  manager?: boolean;
}
