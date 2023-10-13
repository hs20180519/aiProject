import { instance } from "./gpt_api";

class FetchGpt {
  /** 유저가 학습한 단어 보내기 */
  static async postStudiedWord(words: string) {
    const url = "/explain-grammar";
    const data = {
      words,
    };
    const studiedWord = await instance.post(url, data);
    return studiedWord;
  }

  /** 에문 가져오기 */
  static async getScript() {
    const url = "/explain-grammar";
    const studiedWord = await instance.get(url);
    return studiedWord;
  }

  /** 문법 가져오기 */
  static async getGrammar() {
    const url = "/explain-grammar";
    const studiedWord = await instance.get(url);
    return studiedWord;
  }

  /** GPT를 통한 문장 해석 */
  static async getTranslation() {
    const url = "/translation";
    const translatedSentence = await instance.get(url);
    return translatedSentence;
  }
}

const fetchGpt = new FetchGpt();
export default fetchGpt;
