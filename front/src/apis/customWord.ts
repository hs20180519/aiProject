import * as Api from "./api";

/** 커스텀 단어장 생성 */
export async function postCustomNote(data: { title: string }) {
  const url = "/book";
  const addNote = await Api.post(url, data);
  return addNote;
}

/** 커스텀 단어장 목록 조회 */
export const getCustomNotes = async () => {
  const url = "/book";
  const getNoteList = await Api.get(url);
  return getNoteList;
};

/** 커스텀 단어장 title 수정 */
export const putCustomNote = async (data: { title: string }) => {
  const url = `/book`;
  const updateNote = await Api.put(url, data);
  return updateNote;
};

/**
 * 커스텀 단어장 삭제
 * query?customBookId=id
 */
export const delCustomNote = async (queryParams: string) => {
  const url = `/book`;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${url}?${queryString}`;
  const delNote = await Api.delete(fullUrl);
  return delNote;
};

/**
 * 커스텀 단어장에 단어 추가
 * query?customBookId=id
 * body { word: string, meaning: string }
 */
export const postCustomWord = async (
  queryParams: string,
  data: { word: string; meaning: string },
) => {
  const url = `/book/word`;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${url}?${queryString}`;
  const addWord = await Api.post(fullUrl, data);
  return addWord;
};

/**
 * ?????? 어떻게 써야하지?
 * 단어장 상세 조회
 * 쿼리별 단어장 조회. 커스텀 단어장 요청 시 커스텀단언장 id 추가 (?custom=true?customBookId=id)
 * ['correct'] = {  type: 'boolean' }
 * ['incorrect'] = {  type: 'boolean' }
 * ['csat'] = {  type: 'boolean' }
 * ['toeic'] = {  type: 'boolean' }
 * ['toefl'] = { type: 'boolean' }
 * ['ielts'] = {  type: 'boolean' }
 * ['custom'] = {  type: 'boolean' }
 */
export const getNoteDetail = async (queryParams: string) => {
  const url = `/book/word`;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${url}?${queryString}`;
  try {
    const getWordList = await Api.get(fullUrl);
    return getWordList;
  } catch (e) {
    console.error(e);
  }
};

/**
 * 커스텀 단어 수정
 * query?customBookId=id?wordId=id
 * body { word: string, meaning: string }
 */
export const putCustomWord = async (
  queryParams: string,
  data: { word?: string; meaning?: string },
) => {
  const url = `/book/word`;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${url}?${queryString}`;
  const updateCustomword = await Api.put(fullUrl, data);
  return updateCustomword;
};

/**
 * 커스텀 단어 삭제
 * query?customBookId=id?wordId=id
 */
export const delCustomWord = async (queryParams: string) => {
  const url = `/book/word`;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${url}?${queryString}`;
  const delWord = await Api.delete(fullUrl);
  return delWord;
};
