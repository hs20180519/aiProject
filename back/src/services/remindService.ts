import cron, { schedule } from "node-cron";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

const logo: string =
  "data:image/png;base64,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";
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASS,
  },
});

export const startScheduler = () =>
  cron.schedule("0 23 * * *", async (): Promise<void> => {
    console.log("⏰ :: 스케줄링 작업 실행...");

    const today = new Date();

    const daysInKorean: string[] = ["일", "월", "화", "수", "목", "금", "토"];

    let studyDays: any[] = [];

    for (let i = 6; i >= 0; i--) {
      let d: Date = new Date();
      d.setDate(today.getDate() - i);
      studyDays.push({
        day: daysInKorean[d.getDay()],
        studied: false,
      });
    }

    let hasStudiedToday: boolean = false;

    const users = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        id: true,
        wordProgress: {
          select: {
            studiedAt: true,
          },
          orderBy: {
            studiedAt: "desc",
          },
        },
      },
    });

    for (let user of users) {
      if (user.email && user.wordProgress.length > 0) {
        const lastStudiedAt: Date = new Date(user.wordProgress[0].studiedAt);
        const daysSinceLastStudy: number = Math.ceil(
          (today.getTime() - lastStudiedAt.getTime()) / (1000 * 60 * 60 * 24),
        );

        for (let progress of user.wordProgress) {
          let progressDayIndex: number =
            (today.getDate() - new Date(progress.studiedAt).getDate() + 7) % 7;
          if (progressDayIndex >= 0 && progressDayIndex < 7) {
            studyDays[progressDayIndex].studied = true;
            if (new Date(progress.studiedAt).getDate() == today.getDate()) {
              hasStudiedToday = true;
            }
          }
        }
        let subject;
        if (daysSinceLastStudy === 1) {
          subject = "[Wordy] 오늘이 끝나기 전에 보러 와주실거죠..?🥺";
        } else {
          subject = `[Wordy] ${daysSinceLastStudy}일 동안 못봤네요🥺`;
        }
        if (!hasStudiedToday) {
          let mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: user.email,
            subject: subject,
            html: `<div style="text-align:center;">
<img src=${logo} alt="Wordy Logo" />
            <h1>안녕하세요, ${user.name}님!</h1>
            <hr />
            <h3>학습 진행 상황을 알려드립니다</h3><br />
            <p>${studyDays.map((day) => `${day.day}: ${day.studied ? "😎" : "🫥"}`).join(" | ")}</p>
            ${
              hasStudiedToday
                ? "<p>오늘도 이미 학습을 완료하셨군요! 멋져요 👍</p><br />"
                : "<p>아직 오늘의 학습을 하지 않으셨다면, 지금 바로 시작해보세요!</p><br />"
            }
            <p>🙌🏻노력은 배신하지 않습니다🙌🏻</p>
            <br />
             <a href="${process.env.SERVER_URL}" style="
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #007BFF;
                color: white;
                text-decoration: none;
                border-radius: 5px;">학습하러 가기</a>
        </div>`,
          };

          transporter.sendMail(mailOptions, function (error: Error | null): void {
            if (error) {
              console.log(error);
            } else {
              console.log(`메일 전송 : ${user.email}`);
            }
          });
        }
      }
    }
  });
