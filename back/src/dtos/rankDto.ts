import { Exclude } from "class-transformer";
import { IsNumber, IsNotEmpty, IsObject } from "class-validator";
import { User } from "@prisma/client";

export class RankDto {
  @IsNumber()
  @IsNotEmpty()
  @Exclude()
  id!: number;

  rank?: number;

  @IsNumber()
  @IsNotEmpty()
  @Exclude()
  userId!: number;

  @IsNumber()
  score!: number;

  @Exclude()
  user!: User;

  currentPages?: number;
  totalPage?: number;
}
