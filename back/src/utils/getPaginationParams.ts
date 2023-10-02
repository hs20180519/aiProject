const getPaginationParams = (page?: number, limit?: number) => {
    const realLimit = limit ?? 10;
    const realPage = page ?? 1;

    return { skip: (realPage - 1) * realLimit, take: realLimit };
};

export default getPaginationParams;
