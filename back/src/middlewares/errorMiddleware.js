"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../config/logger"));
function errorMiddleware(error, req, res, next) {
    var _a, _b;
    if (error.status)
        res.status(error.status).send(error.message);
    else
        res.status(500).send("서버 에러");
    const stackLines = (_b = (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split("\n")) !== null && _b !== void 0 ? _b : [];
    const truncatedStack = stackLines.slice(0, 5).join("\n");
    const reqBodyString = JSON.stringify(req.body);
    logger_1.default.error(`[${req.method}] ${req.path} | ${error.status} | [REQUEST] ${reqBodyString} | ${truncatedStack}`);
}
exports.default = errorMiddleware;
