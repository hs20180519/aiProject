"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./src/app"));
const PORT = process.env.SERVER_PORT;
app_1.default.listen(PORT, () => {
    console.log(`🚀 :: Server connection |  http://localhost:${PORT}`);
});
