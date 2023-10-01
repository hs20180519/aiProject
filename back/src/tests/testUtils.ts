import request from "supertest";
import express from "express";
import authRouter from "../routers/authRouter";
import passport from "passport";
import { jwt, local } from "../passport";
import session from "express-session";

const app = express();
app.use(passport.initialize());
app.use(
    session({
        secret: `${process.env.SESSION_SECRET_KEY}`,
        resave: false,
        saveUninitialized: true,
    }),
);
passport.use("local", local);
passport.use("jwt", jwt);
app.use(express.json());
app.use("/auth", authRouter);

export async function signUpUser() {
    const res = await request(app).post("/auth/signup").send({
        email: "tests@example.com",
        password: "password",
        name: "Test User",
        nickname: "testuser",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toContain("회원가입에 성공했습니다");
}

export async function loginUser() {
    const res = await request(app).post("/auth").send({
        email: "tests@example.com",
        password: "password",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toEqual("Test User");
    expect(res.body.nickname).toEqual("testuser");

    const cookie = res.headers["set-cookie"][0];
    return cookie.split(";")[0].split("=")[1];
}

export async function deleteUser(userToken: string) {
    const res = await request(app)
        .delete("/auth")
        .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(204);
}
