import request from "supertest";
import express from "express";
import authRouter from "../routers/authRouter";
import passport from "passport";
import { jwt } from "../passport";
import { signUpUser, loginUser, deleteUser } from "./testUtils";
import postRouter from "../routers/postRouter";
import commentRouter from "../routers/commentRouter";
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
app.use("/post", postRouter);
app.use("/comment", commentRouter);

describe("post and comment API", () => {
  let userToken: any;
  let postId: any;
  let parentId: any;

  beforeAll(async () => {
    await signUpUser();
    userToken = await loginUser();
  });

  it("POST /post - 게시글을 작성하고 201과 생성된 객체 반환", async () => {
    const res = await request(app).post("/post").set("Authorization", `Bearer ${userToken}`).send({
      title: "Test Post",
      content: "Test Content",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toEqual("Test Post");
    expect(res.body.content).toEqual("Test Content");
    postId = res.body.id;
  });

  it("POST /comment - 댓글을 작성하고 201과 생성된 객체와 작성자 닉네임 반환", async () => {
    const res = await request(app)
      .post("/comment")
      .set("Authorization", `Bearer ${userToken}`)
      .query({
        postId: postId,
      })
      .send({
        content: "Test Comment",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.content).toEqual("Test Comment");
    parentId = res.body.id;
  });

  it("POST /comment - 대댓글 테스트", async () => {
    const res = await request(app)
      .post("/comment")
      .set("Authorization", `Bearer ${userToken}`)
      .query({
        postId: postId,
        parentId: parentId,
      })
      .send({
        content: "Test Comment",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.content).toEqual("Test Comment");
  });

  it("PUT /comment - 댓글을 수정하고 200과 수정된 댓글 객체 반환", async () => {
    const res = await request(app)
      .put(`/comment/${parentId}`)
      .set("Authorization", `bearer ${userToken}`)
      .send({ content: "Updated Comment" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.content).toEqual("Updated Comment");
  });

  it("DELETE /comment - 해당 댓글과 모든 하위댓글을 삭제하고 204 반환", async () => {
    const res = await request(app)
      .delete(`/comment/${parentId}`)
      .set("Authorization", `bearer ${userToken}`);

    expect(res.statusCode).toEqual(204);
  });

  it("GET /post - postId로 게시글을 조회하고 200과 게시글 객체 반환", async () => {
    const res = await request(app).get("/post").query({
      postId: postId,
      page: 1,
      limit: 10,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(postId);
  });

  it("GET /post - userId로 게시글을 조회하고 200과 게시글 객체 반환", async () => {
    const res = await request(app).get("/post").query({
      userId: userToken.id,
      page: 1,
      limit: 10,
    });
    expect(res.statusCode).toEqual(200);
  });

  it("GET /post - 모든 게시글을 조회하고 200과 게시글 객체 반환", async () => {
    const res = await request(app).get("/post").query({
      page: 1,
      limit: 10,
    });
    expect(res.statusCode).toEqual(200);
  });

  it("PUT /post - 게시글을 수정하고 200과 수정된 게시글 객체 반환", async () => {
    const res = await request(app)
      .put(`/post/${postId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "Updated Post" });

    console.log(res.statusCode);
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual("Updated Post");
  });

  it("DELETE /post - 게시글과 포함된 댓글을 삭제하고 204 반환", async () => {
    const res = await request(app)
      .delete(`/post/${postId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(204);
  });

  afterAll(async () => {
    await deleteUser(userToken);
  });
});
