"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.identityServiceProxy = exports.IdentityServiceProxyOptions = void 0;
const logger_1 = __importDefault(require("../../logs/logger"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const commonProxyOptions = {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers["Content-Type"] = "application/json";
        return proxyReqOpts;
    },
};
exports.IdentityServiceProxyOptions = Object.assign(Object.assign({}, commonProxyOptions), { proxyReqPathResolver: (req) => {
        return req.originalUrl.replace(/^\/v1/, "/api");
    }, userResDecorator: (proxyRes, proxyResData) => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.default.info(`Response received from Identity service: ${proxyRes.statusCode}`);
        return proxyResData;
    }), onError: (err, req, res) => {
        logger_1.default.error(`Proxy error: ${err.message}`);
        res.status(500).json({
            message: `Internal server error`,
            error: err.message,
        });
    } });
if (!process.env.IDENTITY_SERVICE_URL) {
    throw new Error("IDENTITY_SERVICE_URL is not defined in the environment variables.");
}
exports.identityServiceProxy = (0, express_http_proxy_1.default)(process.env.IDENTITY_SERVICE_URL, exports.IdentityServiceProxyOptions);
