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
const logger_1 = __importDefault(require("../../logs/logger"));
const identity_validation_1 = require("./identity.validation");
const Result_1 = require("../../utils/helpers/Result");
const global_constant_1 = require("../../utils/constants/global.constant");
const user_schema_1 = __importDefault(require("../../models/user.schema"));
const hashPassword_1 = require("../../utils/helpers/hashPassword");
const generateTokens_1 = require("../../utils/helpers/generateTokens");
const mongoose_1 = __importDefault(require("mongoose"));
const RefreshToken_schema_1 = __importDefault(require("../../models/RefreshToken.schema"));
const registerIdentity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = new Result_1.Result(res);
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { error } = (0, identity_validation_1.validateIdentityRegistration)(req.body);
        if (error) {
            logger_1.default.warn(global_constant_1.globalConstants.VALIDATION_ERROR, error.details[0].message);
            yield session.abortTransaction();
            session.endSession();
            result.badRequest({ message: error.details[0].message });
            return;
        }
        const { email, password, userName } = req.body;
        const existingUser = yield user_schema_1.default.findOne({
            email
        }).session(session);
        if (existingUser) {
            yield session.abortTransaction();
            session.endSession();
            result.conflict({ message: global_constant_1.userConstants.USER_ALREADY_EXISTS });
            return;
        }
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        const newUser = new user_schema_1.default({
            email,
            password: hashedPassword,
            userName
        });
        yield newUser.save({ session });
        try {
            const tokens = yield (0, generateTokens_1.generateTokens)({
                _id: newUser._id.toString(),
                email: newUser.email
            });
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            yield RefreshToken_schema_1.default.create({
                token: tokens.refreshToken,
                user: newUser._id,
                expiresAt
            }, { session }).catch(err => {
                throw new Error(global_constant_1.globalConstants.CREATE_REFRESH_TOKEN_ERROR);
            });
            res.cookie('accessToken', tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
        }
        catch (error) {
            logger_1.default.error(global_constant_1.globalConstants.TOKEN_GENERATION_ERROR, error);
            yield session.abortTransaction();
            session.endSession();
            result.internalServerError({ message: global_constant_1.globalConstants.TOKEN_GENERATION_ERROR });
            return;
        }
        yield session.commitTransaction();
        session.endSession();
        // Assuming successful registration logic here
        result.success({ message: global_constant_1.userConstants.USER_CREATED });
        return;
    }
    catch (error) {
        logger_1.default.error(global_constant_1.userConstants.FAILED_TO_CREATE_USER, error);
        result.badRequest({ message: global_constant_1.userConstants.FAILED_TO_CREATE_USER });
        return;
    }
});
exports.default = registerIdentity;
