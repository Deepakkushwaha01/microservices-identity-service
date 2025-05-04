"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logs/logger"));
const errorHandler = (err, req, res, next) => {
    logger_1.default.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error'
    });
};
exports.default = errorHandler;
// This error handler middleware is used to catch errors that occur during the request-response cycle
// and send a JSON response with the error message and status code.
// It logs the error stack for debugging purposes and sends a response with the appropriate status code
// and message.
// It is typically placed at the end of the middleware stack in an Express application.
// This allows it to catch any errors that were not handled by previous middleware or route handlers.
