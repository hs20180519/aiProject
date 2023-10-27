// 여기 안쓰는 거임
import * as Api from "./customWord";
// import { useToast } from "@chakra-ui/react";

// const toast = useToast();
// const TOAST_TIMEOUT_INTERVAL = 700;

/** 커스텀 단어장 생성 */
export const fetchAddCustomNote = async (title) => {
  try {
    const res = await Api.postCustomNote(title);
    if (res.status === 201) {
      console.log(res, `단어장 생성 완료! 단어를 추가해 보세요`);
      // toast({
      //   title: `단어장 생성 완료! 단어를 추가해 보세요`,
      //   status: "success",
      //   isClosable: true,
      //   duration: TOAST_TIMEOUT_INTERVAL,
      // });
    }
  } catch (e) {
    console.error(e);
  }
};

/** 커스텀 단어장 목록 조회 */
export const fetchCustomNotes = async () => {
  try {
    // fetch
    const res = await Api.getCustomNotes();
    if (res.status === 200) {
      // res.status(200).json(data);
      console.log(res.data);
      console.log("------넘어왔다!!------");
      return res.data;
    } else if (res.status === 204) {
      console.log(`데이터가 없습니다.`, res);
    }
  } catch (e) {
    // error
    console.error(e);
  }
};

/** 단어장 이름 수정 */
export const fetchUpdateCustomNote = async (title) => {
  try {
    const res = await Api.putCustomNote(title);
    console.log(res);
    if (res.status === 200) {
      console.log(res.data, `단어장 이름 수정 완료!`);
      // toast({
      //   title: `단어장 이름 수정 완료!`,
      //   status: "success",
      //   isClosable: true,
      //   duration: TOAST_TIMEOUT_INTERVAL,
      // });
    } else if (res.status === 400) {
      console.log("잘못된 요청입니다.");
    }
  } catch (e) {
    console.error(e);
  }
};
/** 커스텀 단어장 삭제 */
export const fetchDeleteNote = async (params) => {
  try {
    const res = await Api.delCustomNote(params);
    if (res.status === 200) {
      console.log(res.data, `단어장 삭제 완료!`);
      // toast({
      //   title: `단어장 삭제 완료!`,
      //   status: "success",
      //   isClosable: true,
      //   duration: TOAST_TIMEOUT_INTERVAL,
      // });
    }
  } catch (e) {
    console.error(e);
  }
};

/** 커스텀 단어장에 단어 추가 */
export const fetchAddWord = async (prams, data) => {
  try {
    const res = await Api.postCustomWord(prams, data);
    if (res.status === 201) {
      console.log(res);
    } else if (res.status === 400) {
      console.log("잘못된 요청입니다.", res);
    }
  } catch (e) {
    console.error(e);
  }
};

/** 단어장 상세 조회 */
export const fetchWordList = async (prams) => {
  try {
    const res = await Api.getNoteDetail(prams);
    if (res.status === 200) {
      console.log("성공적으로 단어 목록을 가져왔습니다", res);
    }
  } catch (e) {
    console.error(e);
  }
};

/** 커스텀 단어장 단어 수정 */
export const fetchUpdateWord = async (prams, data) => {
  try {
    const res = await Api.putCustomWord(prams, data);
    if (res.status === 200) {
      console.log("성공적으로 단어가 업데이트 되었습니다.", res);
    }
  } catch (e) {
    console.error(e);
  }
};

/** 커스텀 단어장 단어 삭제 */
export const fetchDelWord = async (prams) => {
  try {
    const res = await Api.delCustomWord(prams);
    if (res.status === 200) {
      console.log(res.data, `단어 삭제 완료!`);
      // toast({
      //   title: `단어 삭제 완료!`,
      //   status: "success",
      //   isClosable: true,
      //   duration: TOAST_TIMEOUT_INTERVAL - 200,
      // });
    } else if (res.status === 400) {
      console.log(res, `잘못된 요청입니다.`);
      // toast({
      //   title: `잘못된 요청입니다.`,
      //   status: "error",
      //   isClosable: true,
      //   duration: TOAST_TIMEOUT_INTERVAL - 200,
      // });
    }
  } catch (e) {
    console.error(e);
  }
};
