"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const identity_register_controller_1 = __importDefault(require("../controllers/identity/identity.register.controller"));
const router = express_1.default.Router();
router.post('/register-identity', identity_register_controller_1.default);
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});
exports.default = router;
