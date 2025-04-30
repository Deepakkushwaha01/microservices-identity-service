"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const refreshTokenSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// expiresAt: 1 – You’re creating an index on the expiresAt field.
// expireAfterSeconds: 0 – Tells MongoDB to delete the document immediately after expiresAt is reached.
const RefreshToken = mongoose_1.default.model('RefreshToken', refreshTokenSchema);
exports.default = RefreshToken;
