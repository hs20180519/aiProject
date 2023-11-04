/* eslint-disable */
import { AxiosError } from "axios";
import * as Api from "./api";

/** 커스텀 단어장 생성 */
export async function postCustomNote(data: { title: string }) {
  const url = "/book";
  const res = await Api.post(url, data);
  return res;
}

/** 커스텀 단어장 목록 조회 */
export const getCustomNotes = async () => {
  const url = "/book";
  const res = await Api.get(url);
  return res;
};

/** 커스텀 단어장 title 수정 */
export const putCustomNoteTitle = async (data: { title: string }, note_id: string) => {
  const url = `/book/?customBookId=${note_id}`;
  const res = await Api.put(url, data);
  return res;
};

/**
 * 커스텀 단어장 삭제
 * query?customBookId=id
 */
export const delCustomNote = async (queryParams: string) => {
  const url = `/book`;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${url}?${queryString}`;
  const res = await Api.delete(fullUrl);
  return res;
};

/** 커스텀 단어장 전체 삭제 */
export const delAllCustomNote = async () => {
  const url = `/book/all`;
  const res = await Api.delete(url);
  return res;
};

/**
 * 커스텀 단어장에 단어 추가
 * query?customBookId=id
 * body { word: string, meaning: string }
 */
export const postCustomWordAdd = async (
  queryParams: string,
  data: { word: string; meaning: string },
) => {
  const url = `/book/word`;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${url}?${queryString}`;
  const res = await Api.post(fullUrl, data);
  return res;
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
 * ['customs'] = {  type: 'boolean' }
 */
export const getNoteDetail = async (queryParams: string) => {
  const url = `/book/word`;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${url}?${queryString}`;
  console.log(fullUrl);
  const res = await Api.get(fullUrl);

  return res;
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
  const res = await Api.put(fullUrl, data);
  return res;
};

/**
 * 커스텀 단어 삭제
 * query?customBookId=id?wordId=id
 */
export const delCustomWord = async (queryParams: string) => {
  const url = `/book/word`;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${url}?${queryString}`;
  const res = await Api.delete(fullUrl);
  return res;
};
