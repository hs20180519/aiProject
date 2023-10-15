// 부활할수도..?

export const getRandomLevel = (probabilities: number[]): number => {
  let sum: number = 0;
  const r: number = Math.random();

  for (let i = 0; i < probabilities.length; i++) {
    sum += probabilities[i];
    if (r <= sum) return i;
  }

  return probabilities.length - 1;
};
