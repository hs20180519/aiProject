import cron, { schedule } from "node-cron";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASS,
  },
});

export const startScheduler = () =>
  cron.schedule("0 23 * * * ", async () => {
    console.log("⏰ :: 스케줄링 작업 실행...");

    const today = new Date();

    // 한글 요일 배열
    const daysInKorean = ["일", "월", "화", "수", "목", "금", "토"];

    let studyDays = [];

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
        const lastStudiedAt = new Date(user.wordProgress[0].studiedAt);
        const daysSinceLastStudy = Math.ceil(
          (today.getTime() - lastStudiedAt.getTime()) / (1000 * 60 * 60 * 24),
        );

        for (let progress of user.wordProgress) {
          let progressDayIndex = (today.getDate() - new Date(progress.studiedAt).getDate() + 7) % 7;
          if (progressDayIndex >= 0 && progressDayIndex < 7) {
            studyDays[progressDayIndex].studied = true;
            if (new Date(progress.studiedAt).getDate() == today.getDate()) {
              hasStudiedToday = true;
            }
          }
        }

        if (!hasStudiedToday) {
          let mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: user.email,
            subject: `[Wordy] ${daysSinceLastStudy}일 동안 못봤네요🥲`,
            html:
              `<h1>안녕하세요, ${user.name}님!</h1>` +
              "<hr />" +
              "<h3>단어 학습 진행 상황을 알려드립니다:)</h3>" +
              studyDays.map((day) => `${day.day}: ${day.studied ? "😎" : "🫥"}`).join(" | ") +
              (hasStudiedToday
                ? "<p>오늘도 이미 단어 학습을 완료하셨군요! 멋져요 👍</p>"
                : "<p>아직 오늘의 단어 학습을 하지 않으셨다면, 지금 바로 시작해보세요!</p>") +
              "<p>Wordy는 회원님을 믿어요🙌🏻 노력은 배신하지 않습니다!</p>" +
              "<p>감사합니다!</p><br />" +
              "<hr />" +
              "<hr />" +
              `<div style="font-size:12px;color:#888;margin-top:30px;">🐾TEAM Wordy🐾</div>`,
          };

          transporter.sendMail(mailOptions, function (error) {
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
