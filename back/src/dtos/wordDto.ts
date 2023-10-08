import { Transform } from "class-transformer";
import { yatesShuffle } from "../utils/yatesShuffle";

export class WordWithChoicesDto {
  id!: number;
  level!: number;
  word!: string;
  meaning!: string;
  category!: string;
  @Transform(({ value }) => yatesShuffle(value))
  choices!: string[];
}
