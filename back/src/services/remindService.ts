import cron from "node-cron";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const logo: string | undefined = process.env.WORDY_ICON;

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

    const today: Date = new Date();

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
            from: process.env.NODE_MAILER_USER,
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
