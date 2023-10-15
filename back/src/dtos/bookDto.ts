import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class BooksDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  title!: string;
}

export class BookDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNumber()
  @IsNotEmpty()
  userId!: number;
}
