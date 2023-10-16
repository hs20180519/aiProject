import * as instance from "./api";

class FetchDBWord {
  /**
   * @returns 커스텀 단어장 생성
   */
  static async postWords(title: string) {
    const url = `/book`;
    const data = {
      title,
    };
    const customWord = await instance.post(url, data);
    return customWord;
  }

  /**
   * @returns 단어 목록 조회
   */
  static async getWords() {
    const url = `/book`;
    const Words = await instance.get(url);
    return Words;
  }

  /**
   * @returns 유저가 만든 커스텀 단어장 저장
   */
  static async putWords(customBookId: string) {
    const url = `/book`;
    const data = {
      customBookId,
    };
    const customWords = await instance.put(url, data);
    return customWords;
  }

  /**
   * @returns 커스텀 유저 단어장 삭제
   * params 넣어줘야함
   */
  static async delWords() {
    const url = `/book`;
    // const params = {
    //   customBookId,
    // };
    const customWords = await instance.delete(url);
    return customWords;
  }

  /**
   * @returns 커스텀 단어장에 단어 추가
   */
  static async postWord(word: string, meaning: string) {
    const url = `/book/word`;
    const data = {
      word,
      meaning,
    };
    const customWord = await instance.post(url, data);
    return customWord;
  }

  /**
   * @returns 유저가 추가한 단어 조회
   * 미완성 || 쿼리로 넘기는 법 공부하고 완료 예정
   */
  static async getWord() {
    const url = `/book/word`;
    const customWord = await instance.get(url);
    return customWord;
  }

  /**
   * @returns 유저 커스텀 단어 수정
   * 미완성 쿼리로 넘기는 법 공부하고 완료 예정
   */
  static async putWord(word: string) {
    const url = `/book/word`;
    const data = {
      word,
    };
    const customWord = await instance.put(url, data);
    return customWord;
  }

  /**
   * @returns 커스텀 유저 단어 삭제
   */
  static async delWord() {
    const url = `/book/word`;
    const customWord = await instance.delete(url);
    return customWord;
  }
}

const fetchDBWord = new FetchDBWord();
export default fetchDBWord;
