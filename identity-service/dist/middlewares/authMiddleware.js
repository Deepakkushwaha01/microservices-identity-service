"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Result_1 = require("../utils/helpers/Result");
const logger_1 = __importDefault(require("../logs/logger"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const result = new Result_1.Result(res);
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        logger_1.default.warn("Access attempt without valid token!");
        result.unauthorized({ message: "Unauthorized access. Please provide a valid token." });
        return;
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        logger_1.default.error("JWT_SECRET is not defined in environment variables!");
        result.internalServerError({ message: "Internal server error." });
        return;
    }
    jsonwebtoken_1.default.verify(token, jwtSecret, (err) => {
        if (err) {
            logger_1.default.warn("Invalid token!");
            result.unauthorized({ message: "Invalid token!" });
            return;
        }
        next();
    });
    next();
};
exports.default = authMiddleware;
