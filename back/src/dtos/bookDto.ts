export class BooksDto {
  id!: number;
  title!: string;
}

export class BookDto {
  id!: number;
  title!: string;
  userId!: number;
  wordId?: number;
}
