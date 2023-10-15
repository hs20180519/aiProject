import { Exclude } from "class-transformer";
import { IsString, IsNumber, IsBoolean, IsEmail, IsOptional, IsNotEmpty } from "class-validator";

export class UserDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @Exclude()
  password?: string;

  @IsString()
  @IsOptional()
  snsId?: string;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsBoolean()
  @IsNotEmpty()
  manager!: boolean;
}
