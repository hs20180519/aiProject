import { Transform } from "class-transformer";
import { yatesShuffle } from "../utils/yatesShuffle";
import { Exclude } from "class-transformer";
export class WordDto {
  id!: number;
  word!: string;
  meaning!: string;
  category!: string;
  custom!: boolean;
  customId?: number;
}

export class WordWithChoicesDto {
  id!: number;
  word!: string;
  meaning!: string;
  category!: string;
  custom!: boolean;
  customId?: number;
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
