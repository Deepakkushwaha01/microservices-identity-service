"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const chalk_1 = __importDefault(require("chalk"));
const customFormat = winston_1.default.format.printf(({ level, message, service }) => {
    const serviceLabel = chalk_1.default.cyan(`${service}:`);
    const date = new Date();
    const timeLabel = chalk_1.default.yellow(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`);
    const levelLabel = level === 'info' ? chalk_1.default.green(level) :
        level === 'error' ? chalk_1.default.red(level) :
            chalk_1.default.magenta(level);
    return `${serviceLabel} ${timeLabel} : ${levelLabel}: ${message}`;
});
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.metadata(), winston_1.default.format((info) => {
        info.service = "identity-service";
        return info;
    })(), customFormat),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: "error.log", level: "error" }),
        new winston_1.default.transports.File({ filename: "combined.log" }),
    ],
});
exports.default = logger;
