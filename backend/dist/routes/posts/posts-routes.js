"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionCheck = void 0;
const express_1 = __importDefault(require("express"));
const posts_controllers_1 = require("../../controllers/posts/posts-controllers");
const express_validator_1 = require("express-validator");
const lodash_1 = require("lodash");
const env_data_1 = require("../../shared/env-data");
const router = express_1.default.Router();
const sectionCheck = (source) => {
    const validator = source === "param" ? (0, express_validator_1.param)("section") : (0, express_validator_1.body)("section");
    return validator
        .customSanitizer((value) => (0, lodash_1.snakeCase)(value))
        .isIn(env_data_1.POST_ENV_DATA.SECTIONS)
        .withMessage(`Section must be one of the following: ${env_data_1.POST_ENV_DATA.SECTIONS.join(", ")}.`);
};
exports.sectionCheck = sectionCheck;
router.get(["/", "/home"], posts_controllers_1.home);
router.get("/sections/:section", (0, exports.sectionCheck)("param"), posts_controllers_1.section);
router.get("/sections/:section/:postId", [
    (0, exports.sectionCheck)("param"),
    (0, express_validator_1.param)("postId")
        .isMongoId()
        .withMessage("Post ID must be a valid MongoDB ObjectId."),
], posts_controllers_1.postDetail);
exports.default = router;
