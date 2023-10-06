import request from "supertest";
import express from "express";
import authRouter from "../routers/authRouter";
import passport from "passport";
import { jwt } from "../passport";
import { signUpUser, loginUser, deleteUser } from "./testUtils";
import session from "express-session";

const app = express();
app.use(
  session({
    secret: `${process.env.SESSION_SECRET_KEY}`,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
passport.use("jwt", jwt);
app.use(express.json());
app.use("/auth", authRouter);

describe("Authentication API", () => {
  let userToken: any;

  beforeAll(async () => {
    await signUpUser();
    userToken = await loginUser();
  });

  // 유저 상세보기 테스트
  it("GET /user - 유저 정보 가져오고 200 반환", async () => {
    const res = await request(app).get("/user").set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Test User");
    expect(res.body.nickname).toEqual("testuser");
  });

  // 유저 정보 수정 테스트
  it("PUT /auth - 유저 정보 수정하고 200 반환", async () => {
    const res = await request(app).put("/auth").set("Authorization", `Bearer ${userToken}`).send({
      // 업데이트 테스트 필드 추가 가능
      name: "Updated User",
    });
    console.log(res.statusCode);
    expect(res.statusCode).toEqual(200);

    // 업데이트 필드 추가하면 여기도 추가
    expect(res.body.name).toEqual("Updated User");
  });

  afterAll(async () => {
    await deleteUser(userToken);
  });
});
