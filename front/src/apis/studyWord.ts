import * as instance from "./api";

export class FetchStudyWords {
  /**
   * 쿼리별 유저가 학습할 단어+사지선다 조회. 커스텀 단어장 학습 요청 시 커스텀단언장 id 추가 (?custom=true?customBookId=id)
   * ['correct'] = {  type: 'boolean' }
   * ['incorrect'] = {  type: 'boolean' }
   * ['csat'] = {  type: 'boolean' }
   * ['toeic'] = {  type: 'boolean' }
   * ['toefl'] = { type: 'boolean' }
   * ['ielts'] = {  type: 'boolean' }
   * ['custom'] = {  type: 'boolean' }
   */
  static async getStudyWord(queryParams: string) {
    const url = `study/`;
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`;
    return instance.get(fullUrl);
  }

  /** 학습 중간 저장
   * 해당 단어의 아이디와 정답 유무(correct=boolean) 같이 보내주세요 */
  static async saveLearn(data: { wordId: number; correct: boolean }) {
    const url = `study/`;
    return instance.post(url, data);
  }

  /** 학습 결과 조회
   * 마지막 학습 시점에서 학습한 10개의 단어와 정답 유무 반환 */
  static async getLearnResult() {
    const url = `/study/result`;
    return instance.get(url);
  }
}
