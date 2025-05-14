"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./logs/logger"));
const chalk_1 = __importDefault(require("chalk"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const expressHandler_1 = require("./middlewares/express/expressHandler");
const proxyOptions_1 = require("./middlewares/proxy/proxyOptions");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
if (!PORT) {
    process.exit(1);
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(expressHandler_1.limiter);
app.use('/v1/auth', proxyOptions_1.identityServiceProxy);
app.use(errorHandler_1.default);
app.listen(PORT, () => {
    logger_1.default.info(chalk_1.default.magenta(`Identity service is running on port ${PORT}`));
});
