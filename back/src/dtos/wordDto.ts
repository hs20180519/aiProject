import { Transform } from "class-transformer";
import { yatesShuffle } from "../utils/yatesShuffle";
import { Exclude } from "class-transformer";
import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, IsNotEmpty } from "class-validator";

export class WordDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  word!: string;

  @IsString()
  @IsNotEmpty()
  meaning!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsNumber()
  @IsOptional()
  customBookId?: number;
}

export class WordWithChoicesDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  word!: string;

  @IsString()
  @IsNotEmpty()
  meaning!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsNumber()
  @IsOptional()
  customBookId?: number;

  @Exclude()
  createdAt?: Date;
  @Exclude()
  updatedAt?: Date;

  @Transform(({ value }) => yatesShuffle(value))
  @IsArray()
  choices!: string[];
}

export class WordProgressDto {
  @Exclude()
  id!: number;
  @Exclude()
  userId!: number;
  @Exclude()
  wordId!: number;
  @Exclude()
  studiedAt!: Date;

  @IsString()
  @IsNotEmpty()
  word!: WordDto;

  @IsBoolean()
  @IsNotEmpty()
  correct!: boolean;
}
