"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIdentityRegistration = void 0;
const joi_1 = __importDefault(require("joi"));
const user_role_enum_1 = require("../../utils/enums/user-role.enum");
const validateIdentityRegistration = (data) => {
    const schema = joi_1.default.object({
        userName: joi_1.default.string().min(3).max(50).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        role: joi_1.default.string()
            .valid(...Object.values(user_role_enum_1.userRole))
            .default(user_role_enum_1.userRole.USER)
    });
    return schema.validate(data);
};
exports.validateIdentityRegistration = validateIdentityRegistration;
