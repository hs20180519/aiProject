import request from "supertest";
import express from "express";
import authRouter from "../routers/authRouter";
import studyRouter from "../routers/studyRouter";
import bookRouter from "../routers/bookRouter";
import passport from "passport";
import { jwt } from "../passport";
import { signUpUser, loginUser, deleteUser } from "./testUtils";
import session from "express-session";

const app = express();
app.use(passport.initialize());
passport.use("jwt", jwt);
app.use(
  session({
    secret: `${process.env.SESSION_SECRET_KEY}`,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(express.json());
app.use("/auth", authRouter);
app.use("/study", studyRouter);
app.use("/book", bookRouter);

describe("Book and Study API", () => {
  let userToken: any;
  let customBookId: number;
  let wordId: number;

  beforeAll(async () => {
    await signUpUser();
    userToken = await loginUser();
  });

  it("POST /book - 커스텀 단어장을 생성하고 201 반환  ", async () => {
    const res = await request(app)
      .post("/book") // 적절한 경로로 변경하세요.
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "Test Book" });

    expect(res.status).toBe(201);

    customBookId = res.body.id; // 응답에서 커스텀 단어장 ID를 가져옵니다.
  });

  it("GET /book - 커스텀 단어장 목록 조회", async () => {
    const res = await request(app).get("/book").set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
  });

  it("PUT /book - 커스텀 단어장 이름 수정 후 200 반환", async () => {
    const res = await request(app)
      .put("/book")
      .query({ customBookId: customBookId })
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "Updated Book" });

    expect(res.status).toBe(200);
  });

  it("POST /book/word - 커스텀 단어장에 커스텀 단어 생성 후 201 반환", async () => {
    const res = await request(app)
      .post(`/book/word`)
      .query({ customBookId: customBookId })
      .set("Authorization", `Bearer ${userToken}`)
      .send({ word: "Test Word", meaning: "Test Meaning" });

    expect(res.status).toBe(201);

    wordId = res.body.id; // 응답에서 단어 ID를 가져옵니다.
  });

  it("GET /book/word - 커스텀 단어장에 커스텀 단어 목록 조회", async () => {
    const res = await request(app)
      .get("/book/word")
      .query({
        custom: true,
        customBookId: customBookId,
      })
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
  });

  it("PUT /book/word - 커스텀 단어장의 커스텀 단어 수정 후 200 반환", async () => {
    const res = await request(app)
      .put(`/book/word`)
      .query({
        customBookId: customBookId,
        wordId: wordId,
      })
      .set("Authorization", `Bearer ${userToken}`)
      .send({ word: "Updated Word", meaning: "Updated Meaning" });

    expect(res.status).toBe(200);
  });

  //todo
  it("GET /study/experience - 체험 학습", async () => {
    const res = await request(app).get("/study/experience");

    expect(res.status).toBe(200);
  });

  it("GET /study - 학습할 단어 조회(커스텀)", async () => {
    const res = await request(app)
      .get("/study")
      .query({
        custom: true,
        customBookId: customBookId,
      })
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
  });

  it("POST /study - 학습한 단어 저장", async () => {
    const res = await request(app).post("/study").set("Authorization", `Bearer ${userToken}`).send({
      wordId: wordId,
      correct: true,
    });

    expect(res.status).toBe(201);
  });

  it("GET /study/result - 학습 결과 조회", async () => {
    const res = await request(app).get("/study/result").set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
  });

  it("DELETE /book/word - 커스텀 단어장의 커스텀 단어 삭제", async () => {
    const res = await request(app)
      .delete(`/book/word`)
      .query({
        customBookId: customBookId,
        wordId: wordId,
      })
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
  });

  it("DELETE /book/word - 커스텀 단어장 삭제", async () => {
    const res = await request(app)
      .delete(`/book`)
      .query({
        customBookId: customBookId,
      })
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await deleteUser(userToken);
  });
});
