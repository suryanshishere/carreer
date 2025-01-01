"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const other_controllers_1 = require("@controllers/other/other-controllers");
const env_data_1 = require("src/shared/env-data");
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const { MIN_NAME_LENGTH, MAX_NAME_LENGTH, MIN_REASON_LENGTH, MAX_REASON_LENGTH, } = env_data_1.CONTACT_US_ENV_DATA;
router.post("/contact-us", [
    (0, express_validator_1.check)("email").trim().normalizeEmail().isEmail(),
    (0, express_validator_1.check)("name")
        .trim()
        .isLength({
        min: MIN_NAME_LENGTH,
        max: MAX_NAME_LENGTH,
    })
        .withMessage(`Name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters.`),
    (0, express_validator_1.check)("reason")
        .trim()
        .isLength({
        min: MIN_REASON_LENGTH,
        max: MAX_REASON_LENGTH,
    })
        .withMessage(`Reason must be between ${MIN_REASON_LENGTH} and ${MAX_REASON_LENGTH} characters.`),
], other_controllers_1.contactUs);
exports.default = router;
