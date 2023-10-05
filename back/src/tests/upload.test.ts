import request from "supertest";
import express from "express";
import uploadRouter from "../routers/uploadRouter";
import passport from "passport";
import path from "path";
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
app.use(express.json());
app.use("/upload", uploadRouter);

describe("Upload API", () => {
  let userToken: any;

  beforeAll(async () => {
    await signUpUser();
    userToken = await loginUser();
  });

  it("POST /upload/profile-image - 이미지 업로드 성공 201 반환", async () => {
    const testImagePath = path.resolve(__dirname, "test.png");
    const response = await request(app)
      .post("/upload/profile-image")
      .set("Authorization", `Bearer ${userToken}`)
      .attach("profileImage", testImagePath);
    console.log(response.statusCode);
    expect(response.statusCode).toBe(201);
  });

  afterAll(async () => {
    await deleteUser(userToken);
  });
});
