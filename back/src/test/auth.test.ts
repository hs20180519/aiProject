import request from "supertest";
import express from "express";
import authRouter from "../routers/authRouter";
import passport from "passport";
import { local } from "../passport";
import { jwt } from "../passport";

const app = express();
app.use(passport.initialize());
passport.use("local", local);
passport.use("jwt", jwt);
app.use(express.json());
app.use("/auth", authRouter);

describe("Authentication API", () => {
    let userToken: any; // 로그인 이후 발급되는 토큰을 저장할 변수

    // 회원가입 테스트
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

    // 로그인 테스트
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

    // 유저 상세보기 테스트
    it("GET /auth - 유저 정보 가져오고 200 반환", async () => {
        const res = await request(app)
            .get("/auth")
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual("Test User");
        expect(res.body.nickname).toEqual("testuser");
    });

    // 유저 정보 수정 테스트
    it("PUT /auth - 유저 정보 수정하고 201 반환", async () => {
        const res = await request(app)
            .put("/auth")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                // 업데이트할 필드를 자유롭게 추가
                name: "Updated User",
            });
        console.log(res.statusCode);
        expect(res.statusCode).toEqual(201);

        // 업데이트된 필드만 추가
        expect(res.body.name).toEqual("Updated User");
    });

    // 회원 탈퇴 테스트
    it("DELETE /auth - 유저 삭제하고 204 반환", async () => {
        const res = await request(app)
            .delete("/auth")
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(204);
    });
});
