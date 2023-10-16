import * as instance from "./api";

export class FetchExperience {
  /** 학습 체험
   * 10개 단어 + 각 단어 사지선다
   * 클라에서 핸들링하고 결과 반출 해야함 */
  static async getExperienceEdu() {
    const url = `/study/experience`;
    return instance.get(url);
  }
}
