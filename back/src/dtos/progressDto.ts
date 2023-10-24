import { IsObject, IsString } from "class-validator";

export class ProgressDto {
  @IsString()
  OverallPercentage!: string | null | undefined;

  @IsObject()
  CategoryPercentage!: Record<string, string | null>;
}
