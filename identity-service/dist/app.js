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
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT || 3001;
(0, connectToDb_1.default)();
// Middleware to parse incoming JSON data from client (like from frontend)
app.use(express_1.default.json());
// Middleware to parse URL-encoded data (like from HTML form submissions)
// extended: true allows parsing of nested objects
app.use(express_1.default.urlencoded({ extended: true }));
app.use(route_1.default);
app.listen(PORT, () => {
    logger_1.default.info(chalk_1.default.magenta(`Identity service is running on port ${PORT}`));
});
