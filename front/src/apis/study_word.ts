import * as instance from "./api";

class FetchStudyWords {
  /**
   * 유저가 학습할 단어 불러오기
   * 미완성 || 쿼리 설정(?)
   */
  static async getStudyWord() {
    const url = `/study`;
    const word = await instance.get(url, {});
    return word;
  }

  /** 단어 목록 조회 */
  static async getExperienceEdu() {
    const url = `/study/experience`;
    const wordList = await instance.get(url, {});
    return wordList;
  }
}

export default FetchStudyWords;
