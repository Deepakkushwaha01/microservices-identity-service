"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const identity_register_controller_1 = __importDefault(require("../controllers/identity/identity.register.controller"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const identity_login_controller_1 = __importDefault(require("../controllers/identity/identity.login.controller"));
const router = express_1.default.Router();
// Register route without auth middleware
router.post('/register-identity', identity_register_controller_1.default);
router.post('/login-identity', identity_login_controller_1.default);
// Apply auth middleware to everything below
router.use(authMiddleware_1.default);
// Example of errorhandler in middleware
// This is a sample route that throws an error to demonstrate the error handling middleware
router.get('/cause-error', (req, res, next) => {
    throw new Error('This is a sample error!');
});
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Identity service is up and running',
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
