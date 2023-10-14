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
  const icon: string | undefined = process.env.WORDY_ICON;
  let mailOptions = {
    from: process.env.NODE_MAILER_USER,
    to: email,
    subject: "[Wordy] 이메일 확인 안내",
    html: `<div style="text-align:center;">
<img src=${icon} alt="Wordy Icon" />
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
