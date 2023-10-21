import dotenv from "dotenv";
import app from "./src/app";

dotenv.config();

const PORT = process.env.SERVER_PORT || 8000;

app.listen(PORT, () => {
  console.log(`🦮 :: Server connection :: ${process.env.SERVER_URL}`);
});
