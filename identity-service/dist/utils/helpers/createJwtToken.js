"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJwtToken = exports.encryptRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const encryptRefreshToken = (payload) => {
    const algorithm = 'aes-256-cbc';
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const ivLength = 16;
    if (!secret || secret.length !== 64) {
        throw new Error('REFRESH_TOKEN_SECRET must be 64 hex characters (32 bytes)');
    }
    const key = Buffer.from(secret, 'hex'); // 👈 convert 64 hex chars to 32 bytes
    const iv = crypto_1.default.randomBytes(ivLength);
    const cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
    const data = JSON.stringify(payload);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};
exports.encryptRefreshToken = encryptRefreshToken;
const createJwtToken = (user) => {
    return jsonwebtoken_1.default.sign({
        userId: user._id,
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '10m' });
};
exports.createJwtToken = createJwtToken;
