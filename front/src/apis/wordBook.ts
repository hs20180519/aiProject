import * as instance from "./api";

export class FetchWordBook {
  /**
   * 커스텀 단어장 생성
   */
  static async createCustomBook(data: { title: string }) {
    const url = "/book";
    return instance.post(url, data);
  }

  /**
   * 커스텀 단어장 목록
   * 예를들어 단어장 페이지에 기본으로 있어야할 단어장들 (수능, 토익 , 학습, 틀린 등등) 후 다음 배열에 추가할 목록들
   */
  static async getCustomBookList() {
    const url = "/book";
    return instance.get(url);
  }

  /**
   * 해당 단어장 단어 조회
   * 쿼리별 단어장 조회. 커스텀 단어장 요청 시 커스텀단언장 id 추가 (?custom=true?customBookId=id)
   * ['correct'] = {  type: 'boolean' }
   * ['incorrect'] = {  type: 'boolean' }
   * ['csat'] = {  type: 'boolean' }
   * ['toeic'] = {  type: 'boolean' }
   * ['toefl'] = { type: 'boolean' }
   * ['ielts'] = {  type: 'boolean' }
   * ['custom'] = {  type: 'boolean' }
   */
  static async getBook(queryParams: string) {
    const url = `/book/word`;
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`;
    return instance.get(fullUrl);
  }

  /**
   * 커스텀 단어장 title 업데이트
   */
  static async updateCustomBook(data: { title: string }) {
    const url = `/book`;
    return instance.put(url, data);
  }

  /**
   * 커스텀 단어장 삭제
   * query?customBookId=id
   */
  static async deleteCustomBook(queryParams: string) {
    const url = `/book`;
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`;
    return instance.delete(fullUrl);
  }

  /**
   * 커스텀 단어장에 커스텀 단어 추가
   * query?customBookId=id
   * body { word: string, meaning: string }
   */
  static async createCustomBookInWord(
    queryParams: string,
    data: { word: string; meaning: string },
  ) {
    const url = `/book/word`;
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`;
    return instance.post(fullUrl, data);
  }

  /**
   * 커스텀 단어 수정
   * query?customBookId=id?wordId=id
   * body { word: string, meaning: string }
   */
  static async updateCustomBookInWord(
    queryParams: string,
    data: { word?: string; meaning?: string },
  ) {
    const url = `/book/word`;
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`;
    return instance.put(fullUrl, data);
  }

  /**
   * 커스텀 단어 삭제
   * query?customBookId=id?wordId=id
   */
  static async deleteCustomBookInWord(queryParams: string) {
    const url = `/book/word`;
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`;
    return instance.delete(fullUrl);
  }
}
