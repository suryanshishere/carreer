"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_controllers_1 = require("../../../controllers/users/auth/auth-controllers");
const env_data_1 = require("../../../shared/env-data");
const router = express_1.default.Router();
const { ALPHA_NUM_SPECIAL_CHAR, MIN_PWD_LENGTH, MAX_PWD_LENGTH, MIN_EMAIL_OTP, MAX_EMAIL_OTP, OTP_ERROR_MSG, } = env_data_1.USER_ENV_DATA;
router.post("/", [
    (0, express_validator_1.check)("email").trim().normalizeEmail().isEmail(),
    (0, express_validator_1.check)("password")
        .trim()
        .isLength({ min: Number(MIN_PWD_LENGTH), max: Number(MAX_PWD_LENGTH) }),
], auth_controllers_1.auth);
router.post("/send-password-reset-link", (0, express_validator_1.check)("email").trim().normalizeEmail().isEmail(), auth_controllers_1.sendPasswordResetLink);
router.post(["/reset-password", "/reset-password/:userId"], [
    (0, express_validator_1.check)("resetPasswordToken")
        .isInt({ min: MIN_EMAIL_OTP, max: MAX_EMAIL_OTP })
        .withMessage(OTP_ERROR_MSG),
    (0, express_validator_1.check)("password")
        .trim()
        .isLength({ min: MIN_PWD_LENGTH, max: MAX_PWD_LENGTH })
        .withMessage(`Name must be between ${MIN_PWD_LENGTH} and ${MAX_PWD_LENGTH} characters.`)
        .matches(ALPHA_NUM_SPECIAL_CHAR)
        .withMessage('Password can only contain letters, numbers, and special characters like !@#$%^&*(),.?":{}|<>_-'),
], auth_controllers_1.resetPassword);
//authenticated routes
router.post("/verify-email", (0, express_validator_1.check)("otp")
    .isInt({ min: MIN_EMAIL_OTP, max: MAX_EMAIL_OTP })
    .withMessage(OTP_ERROR_MSG), auth_controllers_1.verifyEmail);
router.post("/send-verification-otp", auth_controllers_1.sendVerificationOtp);
exports.default = router;
