import { Exclude } from "class-transformer";
import { IsNumber, IsNotEmpty, IsObject } from "class-validator";

export class RankDto {
  @IsNumber()
  @IsNotEmpty()
  @Exclude()
  id!: number;

  @IsObject()
  @IsNotEmpty()
  @Exclude()
  user!: object;

  @IsNumber()
  @IsNotEmpty()
  @Exclude()
  userId!: number;

  @IsNumber()
  @Exclude()
  score!: number;
}
