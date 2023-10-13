import { instance } from "./api2";

class FetchCustomWord {
  /**
   * @returns 유저가 추가한 단어 서버로 전송
   */
  static async postWord(word: string) {
    const url = `/customWord`;
    const data = {
      word,
    };
    const customWord = await instance.post(url, data);
    return customWord;
  }

  /**
   * @returns 유저가 추가한 단어 조회
   */
  static async getWord() {
    const url = `/customWord`;
    const customWord = await instance.get(url);
    return customWord;
  }

  /**
   * @returns 유저가 추가한 단어 목록 조회
   */
  static async getWords() {
    const url = `/customWords`;

    const customWords = await instance.get(url);
    return customWords;
  }

  /**
   * @returns 커스텀 유저 단어 삭제
   */
  static async delWord() {
    const url = `/customWord`;
    const customWord = await instance.delete(url);
    return customWord;
  }

  /**
   * @returns 커스텀 유저 단어장 삭제
   */
  static async delWords() {
    const url = `/customWords`;
    const customWords = await instance.delete(url);
    return customWords;
  }
}

const fetchCustomWord = new FetchCustomWord();
export default fetchCustomWord;
