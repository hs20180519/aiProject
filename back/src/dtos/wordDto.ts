import { Transform } from "class-transformer";
import { yatesShuffle } from "../utils/yatesShuffle";
import { Exclude } from "class-transformer";
export class WordDto {
  id!: number;
  word!: string;
  meaning!: string;
  category!: string;
}

export class WordWithChoicesDto {
  id!: number;
  word!: string;
  meaning!: string;
  category!: string;
  @Transform(({ value }) => yatesShuffle(value))
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

  word?: WordDto;
  correct!: boolean;
}
