"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("../config/logger"));
const resLogingMiddleware = (0, morgan_1.default)((tokens, req, res) => {
    const logMessage = `[${tokens.method(req, res)}] ${tokens.url(req, res)} | ${tokens.status(req, res)} | ${tokens.res(req, res, "content-length")} - ${tokens["response-time"](req, res)} ms | [Response] ${JSON.stringify(req.body)}`;
    if (res.statusCode < 400) {
        logger_1.default.info(logMessage);
    }
    return null;
});
exports.default = resLogingMiddleware;
