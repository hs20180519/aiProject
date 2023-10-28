/** @description 다차원 객체 펼치기
 * 응답 객체 형식을 통일하기 위해 만든 유틸
 * 이었는데? DTO 패턴 적용으로 이걸 사용할 일이 있을까..?*/
export const flattenObject = (
  obj: object,
  prefix: string = "",
  res: Record<string, unknown> = {},
): Record<string, unknown> =>
  Object.entries(obj).reduce((r: Record<string, unknown>, [k, v]: [string, any]) => {
    const key: string = `${prefix}${prefix ? "." : ""}${k}`;
    return typeof v === "object" ? flattenObject(v as object, key, r) : { ...r, [key]: v };
  }, res);
