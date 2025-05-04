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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const createJwtToken_1 = require("./createJwtToken");
const generateTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const [accessToken, refreshToken] = yield Promise.all([
        (0, createJwtToken_1.createJwtToken)(user),
        (0, createJwtToken_1.encryptRefreshToken)(user)
    ]);
    return {
        accessToken,
        refreshToken
    };
});
exports.generateTokens = generateTokens;
