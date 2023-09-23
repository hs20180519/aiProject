import request from "supertest";
import express from "express";
import authRouter from "../routers/authRouter";
import passport from "passport";
import { jwt } from "../passport";
import { signUpUser, loginUser, deleteUser } from "./testUtils";
import postRouter from "../routers/postRouter";
import commentRouter from "../routers/commentRouter";

const app = express();
app.use(passport.initialize());
passport.use("jwt", jwt);
app.use(express.json());
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);

describe("post and comment API", () => {
    let userToken: any;
    let postId: any;

    beforeAll(async () => {
        await signUpUser();
        userToken = await loginUser();
    });

    it("POST /post - 게시글을 작성하고 201과 생성된 객체 반환", async () => {
        const res = await request(app)
            .post("/post")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                title: "Test Post",
                content: "Test Content",
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.title).toEqual("Test Post");
        expect(res.body.content).toEqual("Test Content");
        postId = res.body.id;
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

    it("PUT /post - 게시글을 수정하고 201과 수정된 게시글 객체 반환", async () => {
        const res = await request(app)
            .put(`/post/${postId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ title: "Updated Post" });

        console.log(res.statusCode);
        expect(res.statusCode).toEqual(201);
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
