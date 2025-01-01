"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post("/forgot-password", [(0, express_validator_1.check)("email").trim().normalizeEmail().isEmail()]);
router.post("/reset-password", [
    (0, express_validator_1.check)("email").trim().not().isEmpty(),
    (0, express_validator_1.check)("otp").trim().isLength({ min: 6, max: 6 }).isNumeric(),
    (0, express_validator_1.check)("password").trim().isLength({ min: 5 }),
]);
router.post("/reset-password/timer");
exports.default = router;
