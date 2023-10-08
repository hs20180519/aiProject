export interface Word {
  id: number;
  meaning: string;
  level: number;
  category: string;
}

export interface WordWithChoices extends Word {
  choices: string[];
}
