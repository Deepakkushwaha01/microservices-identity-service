"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_1 = __importDefault(require("./routes/route"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectToDb_1 = __importDefault(require("./DB/connectToDb"));
const logger_1 = __importDefault(require("./logs/logger"));
const chalk_1 = __importDefault(require("chalk"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const redisHandler_1 = __importDefault(require("./middlewares/redis/redisHandler"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT;
if (!PORT) {
    logger_1.default.error(chalk_1.default.bold.redBright(`Unable to identify identity service port ${PORT}`));
    process.exit(1);
}
(0, redisHandler_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 300, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    handler: (req, res) => {
        logger_1.default.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ success: false, message: 'Too many requests' });
    }
    // store: ... , // Redis, Memcached, etc. See below.
});
app.use(limiter); // Apply the rate limiting middleware to all requests
(0, connectToDb_1.default)();
// Middleware to parse incoming JSON data from client (like from frontend)
app.use(express_1.default.json());
// Middleware to parse URL-encoded data (like from HTML form submissions)
// extended: true allows parsing of nested objects
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth', route_1.default);
// Middleware to set security-related HTTP headers
// This helps protect the app from some well-known web vulnerabilities
// by setting HTTP headers appropriately
// For example, it can help prevent XSS attacks, clickjacking, etc.
// It is a good practice to use helmet in production environments
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(errorHandler_1.default); // handler for errors which are not caught by the above middleware
app.listen(PORT, () => {
    logger_1.default.info(chalk_1.default.magenta(`Identity service is running on port ${PORT}`));
});
