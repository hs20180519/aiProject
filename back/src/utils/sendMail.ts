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

  let mailOptions = {
    from: process.env.NODE_MAILER_USER,
    to: email,
    subject: "[Wordy] 이메일 확인 안내",
    html: `
      <!DOCTYPE html>
      <html lang="">
      <head>
          <title>Wordy Email Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
              }
              .container {
                  width: 80%;
                  margin: auto;
              }
              .header {
                  text-align: center;
                  padding-top: 50px;
              }
              .content {
                  margin-top: 30px;
                  line-height: 1.5em;
              }
          </style>
      </head>

      <body>
          <div class="container">
            <div class="header">
                <h2>Welcome to Wordy!</h2>
            </div>

            <div class="content">
                <p>안녕하세요!</p>

                <p>Wordy 가족이 되신 것을 기쁘게 생각합니다! 회원가입을 진행하시려면 Wordy 웹사이트에 다음 인증 코드를 입력하세요.</p>

                <h3>인증 코드: ${verificationCode}</h3>

                <p>Wordy를 통해 지식과 창의력을 풍부하게 즐기시기 바랍니다.</p>

                <p>이 이메일을 요청하지 않으셨다면 무시하시기 바랍니다.</p>

                감사합니다!
                </br></br></br>
                
                🐾The Wordy Team🐾
            </div>
          </div> 
      </body>

      </html>`,
  };

  await transporter.sendMail(mailOptions);

  return;
};
