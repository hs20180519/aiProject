import { AxiosError } from "axios";
import * as Api from "./api";

/** 커스텀 단어장 생성 */
export async function postCustomNote(data: { title: string }) {
  const url = "/book";
  try {
    const res = await Api.post(url, data);
    const status = res.status;
    if (status === 201) {
      console.log(`단어장 생성 완료! 단어를 추가해 보세요.`, res);
      return res;
    } else if (status === 400) {
      console.log(`잘못된 요청입니다.`, res);
    }
  } catch (e) {
    console.error(e);
  }
}

/** 커스텀 단어장 목록 조회 */
export const getCustomNotes = async () => {
  const url = "/book";
  try {
    const res = await Api.get(url);
    const status = res.status;
    if (status === 200) {
      return res;
    } else if (status === 204) {
      console.log(`커스텀 단어장 리스트가 없습니다.`);
    }
  } catch (e) {
    console.error(e);
  }
};

/** 커스텀 단어장 title 수정 */
export const putCustomNote = async (data: { title: string }) => {
  const url = `/book`;
  try {
    const res = await Api.put(url, data);
    const status = res.status;
    if (status === 200) {
      console.log(status, `단어장 이름 수정 완료!`);
      return res;
    } else if (status === 400) {
      console.log("잘못된 요청입니다.", status);
    }
  } catch (e) {
    console.error(e as AxiosError);
  }
};

/**
 * 커스텀 단어장 삭제
 * query?customBookId=id
 */
export const delCustomNote = async (queryParams: string) => {
  const url = `/book`;
  try {
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`;
    const res = await Api.delete(fullUrl);
    if (res.status === 200) {
      console.log(`----삭제완료----`);
      return res;
    }
  } catch (e) {
    console.error(e);
  }
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
  try {
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`;
    const res = await Api.post(fullUrl, data);
    if (res.status === 201) {
      console.log(`단어 추가 완료`, res);
      return res;
    } else if (res.status === 400) {
      console.log(`잘못된 요청입니다.`, res.status);
    }
  } catch (e) {
    console.error(e);
  }
};

/**
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
  console.log(fullUrl);
  try {
    const res = await Api.get(fullUrl);
    if (res.status === 200) {
      console.log(`성공적으로 단어 목록을 가져왔습니다.`, res);
      return res;
    }
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
  try {
    const res = await Api.put(fullUrl, data);
    if (res.status === 200) {
      console.log(`성공적으로 단어가 업데이트 되었습니다.`, res);
      return res;
    }
  } catch (e) {
    console.error(e);
  }
};

/**
 * 커스텀 단어 삭제
 * query?customBookId=id?wordId=id
 */
export const delCustomWord = async (queryParams: string) => {
  const url = `/book/word`;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${url}?${queryString}`;
  try {
    const res = await Api.delete(fullUrl);
    if (res.status === 200) {
      console.log(`단어 삭제 완료!`, res);
      return res;
    } else if (res.status === 400) {
      console.log(`잘못된 요청입니다.`, res);
    }
  } catch (e) {
    console.log(e);
  }
};
