// 만드는 중 에러안나게 잠시 텍스트로 바꿔둠
import { instance } from "./api2";

class FetchDBWords {
  /** 단어 목록 조회 */
  static async getWords() {
    const url = `/auth/words`;
    const wordList = await instance.get(url);
    return wordList;
  }

  static async getWord() {
    const url = `/auth/word`;
    const word = await instance.get(url);
    return word;
  }
}

export default FetchDBWords;
