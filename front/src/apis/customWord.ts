import * as Api from "./api";

/** 커스텀 단어장 목록 조회 */
export const getCustomNoteList = async () => {
  const url = "/book";
  const getNoteList = await Api.get(url);
  return getNoteList;
};

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
export const getNoteDetail = async (queryParams: string) => {
  const url = `/book/word`;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${url}?${queryString}`;
  try {
    const getNoteDetail = await Api.get(fullUrl);
    return getNoteDetail;
  } catch (e) {
    console.error(e);
  }
};

/** 커스텀 단어장 생성 */
export const createCustomNote = async (data: { title: string }) => {
  const url = "/book";
  const newNote = await Api.post(url, data);
  return newNote;
};

/** 커스텀 단어장 title 업데이트 */
export const updateCustomNote = async (data: { title: string }) => {
  const url = `/book`;
  return await Api.put(url, data);
};

/**
 * 커스텀 단어장에 커스텀 단어 추가
 * query?customBookId=id
 * body { word: string, meaning: string }
 */
export const addCustomWord = async (
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
 * 커스텀 단어 수정
 * query?customBookId=id?wordId=id
 * body { word: string, meaning: string }
 */
export const updateCustomWordInBook = async (
  queryParams: string,
  data: { word?: string; meaning?: string },
) => {
  const url = `/book/word`;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${url}?${queryString}`;
  return await Api.put(fullUrl, data);
};

/**
 * 커스텀 단어장 삭제
 * query?customBookId=id
 */
export const deleteCustomBook = async (queryParams: string) => {
  const url = `/book`;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${url}?${queryString}`;
  const delNote = await Api.delete(fullUrl);
  return delNote;
};

/**
 * 커스텀 단어 삭제
 * query?customBookId=id?wordId=id
 */
export const deleteCustomWordInBook = async (queryParams: string) => {
  const url = `/book/word`;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${url}?${queryString}`;
  const delWord = await Api.delete(fullUrl);
  return delWord;
};
