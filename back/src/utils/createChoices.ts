interface Word {
  id: number;
  meaning: string;
}

export const createChoices = (word: Word, allUnfilteredWords: Word[]) => {
  let choices = [word.meaning];

  while (choices.length < 4) {
    const randomMeaningIndex = Math.floor(Math.random() * allUnfilteredWords.length);
    const randomWordMeaning = allUnfilteredWords[randomMeaningIndex].meaning;

    if (!choices.includes(randomWordMeaning)) choices.push(randomWordMeaning);
  }

  return choices;
};
