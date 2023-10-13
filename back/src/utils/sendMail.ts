import nodemailer from "nodemailer";

export const sendMail = async (email: string, verificationCode: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODE_MAILER_USER,
      pass: process.env.NODE_MAILER_PASS,
    },
  });
  const logo: string =
    "data:image/png;base64,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";
  let mailOptions = {
    from: process.env.NODE_MAILER_USER,
    to: email,
    subject: "[Wordy] 이메일 확인 안내",
    html: `<div style="text-align:center;">
<img src=${logo} alt="Wordy Logo" />
            <h1>안녕하세요, Wordy 에요!</h1>
            <hr />
            <h3>회원가입을 진행하시려면 Wordy 웹사이트에 다음 인증 코드를 입력해주세요🥳</h3><br />
            <h2>인증 코드: ${verificationCode}</h2><br />
            <p>Wordy를 통해 지식과 창의력을 풍부하게 즐기시기 바랍니다</p>
            <div style="font-size:12px;color:#888;margin-top:30px;">이 이메일을 요청하지 않으셨다면 무시하시기 바랍니다</div>
        </div>`,
  };

  await transporter.sendMail(mailOptions);

  return;
};
