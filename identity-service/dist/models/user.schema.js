"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_role_enum_1 = require("../utils/enums/user-role.enum");
const model_enums_1 = require("../utils/enums/model.enums");
const userSchema = new mongoose_1.default.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: Object.values(user_role_enum_1.userRole),
        required: true,
        default: user_role_enum_1.userRole.USER,
    },
}, { timestamps: true });
userSchema.index({ email: 1 }, { unique: true });
const User = mongoose_1.default.model(model_enums_1.Models.USER, userSchema);
exports.default = User;
