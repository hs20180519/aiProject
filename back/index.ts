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
  });
});
