export const yatesShuffle = (choices: string[]) => {
  for (let i: number = choices.length - 1; i > 0; i--) {
    let j: number = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  return choices;
};
