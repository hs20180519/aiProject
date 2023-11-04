export class FavoriteDto {
  id!: number;
  userId!: number;
  wordId!: number;
  word!: {
    id: number;
    word: string;
    meaning: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
    customBookId: number;
    isFavorite: boolean;
  };
}
