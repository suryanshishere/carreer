"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewPostValidators = exports.postCodeCheck = void 0;
const express_validator_1 = require("express-validator");
const lodash_1 = __importDefault(require("lodash"));
const env_data_1 = require("@shared/env-data");
const posts_routes_1 = require("@routes/posts/posts-routes");
const { ALPHA_NUM_UNDERSCORE, MIN_POST_NAME_PUBLISHER, MAX_POST_NAME, MIN_POST_CODE, MAX_POST_CODE, } = env_data_1.POST_ENV_DATA;
const postCodeCheck = (source) => {
    const validator = source === "param" ? (0, express_validator_1.param)("postCode") : (0, express_validator_1.body)("post_code");
    return validator
        .trim()
        .customSanitizer((value) => {
        return lodash_1.default.toUpper(lodash_1.default.snakeCase(value)); // Convert to snake_case and uppercase
    })
        .isLength({
        min: MIN_POST_CODE,
        max: MAX_POST_CODE,
    })
        .withMessage(`Post code must be between ${MIN_POST_CODE} and ${MAX_POST_CODE} characters.`)
        .matches(ALPHA_NUM_UNDERSCORE)
        .withMessage("Post code can only contain letters, numbers, and underscores, with no spaces.");
};
exports.postCodeCheck = postCodeCheck;
exports.createNewPostValidators = [
    (0, posts_routes_1.sectionCheck)("body"),
    (0, express_validator_1.check)("name_of_the_post")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Name of the post is required.")
        .isLength({
        min: MIN_POST_NAME_PUBLISHER,
        max: MAX_POST_NAME,
    })
        .withMessage(`Name of the post must be between ${MIN_POST_NAME_PUBLISHER} and ${MAX_POST_NAME} characters.`),
    exports.postCodeCheck,
];
