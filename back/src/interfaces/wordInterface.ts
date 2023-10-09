export interface Word {
  id: number;
  meaning: string;
  category: string;
  correct: boolean | null;
}

export interface WordWithChoices extends Word {
  choices: string[];
}
