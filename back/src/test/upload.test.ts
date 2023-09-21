import request from "supertest";
import express from "express";
import uploadRouter from "../routers/uploadRouter";
import authRouter from "../routers/authRouter";
import passport from "passport";
import { local } from "../passport";
import { jwt } from "../passport";
import multer from "multer";
import storage from "../utils/storage";
import path from "path";
import fs from "fs";

const upload = multer({ storage });

const app = express();
app.use(passport.initialize());
passport.use("local", local);
passport.use("jwt", jwt);
app.use(express.json());
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);

describe("Upload API", () => {
    let userToken: any;

    it("POST /auth/signup - 새 유저를 생성하고 201을 반환", async () => {
        const res = await request(app).post("/auth/signup").send({
            email: "test@example.com",
            password: "password",
            name: "Test User",
            nickname: "testuser",
        });

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toContain("회원가입에 성공했습니다");
    });
    it("POST /auth - 로그인 성공하고 200을 반환", async () => {
        const res = await request(app).post("/auth").send({
            email: "test@example.com",
            password: "password",
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.user).toEqual("Test User");
        expect(res.body.nickname).toEqual("testuser");
        userToken = res.body.token;
    });

    it("POST /upload/profile-image - 이미지 업로드 성공 201 반환", async () => {
        const testImagePath = path.resolve(__dirname, "test.png");
        const response = await request(app)
            .post("/upload/profile-image")
            .set("Authorization", `Bearer ${userToken}`)
            .attach("profileImage", testImagePath);
        console.log(response.statusCode);
        expect(response.statusCode).toBe(201);

        const uploadedImagePath = path.join(
            __dirname,
            "..",
            "..",
            "public",
            "images",
            response.body,
        );
    });

    it("DELETE /auth - 유저 삭제하고 204 반환", async () => {
        const res = await request(app)
            .delete("/auth")
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(204);
    });
});
