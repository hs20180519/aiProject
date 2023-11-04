export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + char;
  }
  return hash.toString();
}

// 모든 키를 순회하면서 괄호와 공백을 제거
export const cleanKey = (key: string) => key.replace(/\s*\(.*?\)\s*/g, "").trim();

// 정규 표현식 객체 생성 단계
export const createRegex = (words: string[]) => {
  // 1) 이스케이프 처리: 특수문자를 정규 표현식에서 인식할 수 있게 만듦
  //    - 예시 입력: ['apple$', 'bana.na', 'Cherry+']
  //    - 예시 결과: ['apple\\$', 'bana\\.na', 'Cherry\\+']
  const escapedWords = words.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  // 2) 단어 결합: 이스케이프 처리된 단어들을 '|'로 결합 (or 연산)
  //    - 예시 결과: 'apple\\$|bana\\.na|Cherry\\+'
  // --------------------------------------------------------------
  // 3) 정규 표현식 객체 생성: 전역 검색('g')과 대소문자 무시('i') 옵션 사용
  //    - 최종 정규 표현식: /apple\$|bana\.na|Cherry\+/gi
  return new RegExp(escapedWords.join("|"), "gi");
};
