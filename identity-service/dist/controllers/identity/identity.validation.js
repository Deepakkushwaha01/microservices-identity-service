"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityLoginSchema = exports.IdentitySchema = void 0;
// zod/identity.schema.ts
const zod_1 = require("zod");
const user_role_enum_1 = require("../../utils/enums/user-role.enum");
exports.IdentitySchema = zod_1.z.object({
    userName: zod_1.z.string().min(3).max(50),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(Object.values(user_role_enum_1.userRole)).optional().default(user_role_enum_1.userRole.USER)
});
exports.IdentityLoginSchema = exports.IdentitySchema.pick({
    email: true,
    password: true
});
