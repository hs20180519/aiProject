const getPaginationParams = (page?: number, limit?: number): { skip: number; take: number } => {
  const realLimit: number = limit ?? 10;
  const realPage: number = page ?? 1;

  return { skip: (realPage - 1) * realLimit, take: realLimit };
};

export default getPaginationParams;
