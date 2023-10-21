import dotenv from "dotenv";
import app from "./src/app";
import cron from "node-cron";
import { rankService } from "./src/services/rankService";
dotenv.config();

const PORT = process.env.SERVER_PORT || 8000;

app.listen(PORT, () => {
  console.log(`🦮 :: Server connection :: ${process.env.SERVER_URL}`);
  cron.schedule("0 0 * * 1", () => {
    rankService;
    //todo 해당 표현식이 좋은방법은 아닌거같은데 인트로페이지 진입시 클라이언트에서 별도로 요청을 보내는 방법이 좋지 않을까요?
  });
});
