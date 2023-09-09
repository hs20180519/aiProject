"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
// 로그를 저장할 디렉토리 생성. 없으면 생성
const logDirectory = path_1.default.join(__dirname, "../logs");
if (!fs_1.default.existsSync(logDirectory)) {
    fs_1.default.mkdirSync(logDirectory);
}
// 로그 레벨 정의
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};
// 구성 정의
const logger = winston_1.default.createLogger({
    levels: logLevels,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    })),
    transports: [
        // winston-daily-rotate-file을 사용하여 각 로그 수준에 대한 파일 전송
        new winston_daily_rotate_file_1.default({
            level: "error",
            dirname: path_1.default.join(logDirectory, "error"),
            filename: "error-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "30d",
            format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ level, message, timestamp }) => {
                return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
            })),
        }),
        new winston_daily_rotate_file_1.default({
            level: "warn",
            dirname: path_1.default.join(logDirectory, "warn"),
            filename: "warning-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "30d",
            format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ level, message, timestamp }) => {
                return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
            })),
        }),
        new winston_daily_rotate_file_1.default({
            level: "info",
            dirname: path_1.default.join(logDirectory, "info"),
            filename: "info-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "30d",
            format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ level, message, timestamp }) => {
                return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
            })),
        }),
        new winston_daily_rotate_file_1.default({
            level: "debug",
            dirname: path_1.default.join(logDirectory, "debug"),
            filename: "debug-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "30d",
            format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ level, message, timestamp }) => {
                return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
            })),
        }),
    ],
    exceptionHandlers: [
        // 캐치되지 않은 (정의되지 않은 레벨) 예외를 기록하는 예외 처리기
        new winston_daily_rotate_file_1.default({
            dirname: path_1.default.join(logDirectory, "except"),
            filename: "except-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "30d",
            format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ level, message, timestamp }) => {
                return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
            })),
        }),
    ],
    exitOnError: false, //캐치되지 않은 예외를 기록한 후 애플리케이션 실행을 계속합니다.
});
exports.default = logger;
