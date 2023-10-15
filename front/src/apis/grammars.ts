import * as instance from "./api";

/** 아래 코드는 임시 endpoint url입니다. */
class FetchGrammars {
  /**
   * @returns 유저가 입력한 문장 서버로 전송
   */
  static async postSentence(sentence: string) {
    const url = `/ai/correct`;
    const data = {
      sentence,
    };
    const userSentence = await instance.post(url, data);
    return userSentence;
  }

  /**
   * @returns AI모델이 고쳐준 문장
   */
  static async getResult() {
    const url = `/ai/correct`;
    const FixedSentence = await instance.get(url, {});
    return FixedSentence;
  }
}

const fetchGrammers = new FetchGrammars();
export default fetchGrammers;
