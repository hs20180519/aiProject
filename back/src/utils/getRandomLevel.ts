export const getRandomLevel = (probabilities: number[]): number => {
  let sum = 0;
  const r = Math.random();

  for (let i = 0; i < probabilities.length; i++) {
    sum += probabilities[i];
    if (r <= sum) return i;
  }

  return probabilities.length - 1;
};
