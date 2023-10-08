export interface Word {
  id: number;
  meaning: string;
  level: number;
  category: string;
  correct: boolean | null;
}

export interface WordWithChoices extends Word {
  choices: string[];
}
