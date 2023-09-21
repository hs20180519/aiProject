import request from "supertest";
import express from "express";
import authRouter from "./authRouter";

const app = express();
app.use(express.json());
app.use("/auth", authRouter);

describe("POST /signup", () => {
    it("새 유저를 생성하고 201을 반환", async () => {
        const res = await request(app).post("/auth/signup").send({
            email: "test@example.com",
            password: "password",
            name: "Test User",
            nickname: "testuser",
        });

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toContain("회원가입에 성공했습니다");
    });
});
