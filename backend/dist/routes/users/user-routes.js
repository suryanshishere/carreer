"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectCheck = void 0;
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth/auth-routes"));
const account_routes_1 = __importDefault(require("./account/account-routes"));
const express_validator_1 = require("express-validator");
const env_data_1 = require("src/shared/env-data");
const user_controllers_1 = require("@controllers/users/user-controllers");
const posts_routes_1 = require("src/routes/posts/posts-routes");
const publisher_routes_utils_1 = require("src/routes/admin/publisher/publisher-routes-utils");
const router = express_1.default.Router();
const { MIN_REASON_LENGTH, MAX_REASON_LENGTH } = env_data_1.CONTACT_US_ENV_DATA;
const objectCheck = (fieldName) => {
    return (0, express_validator_1.body)(fieldName)
        .isObject()
        .withMessage(`${fieldName} must be an object.`)
        .custom((value) => {
        if (Object.keys(value).length === 0) {
            throw new Error(`${fieldName} must not be empty.`);
        }
        return true;
    });
};
exports.objectCheck = objectCheck;
router.use("/auth", auth_routes_1.default);
router.use("/account", account_routes_1.default);
router.post("/contribute-to-post", [(0, posts_routes_1.sectionCheck)("body"), (0, publisher_routes_utils_1.postCodeCheck)("body"), (0, exports.objectCheck)("data")], user_controllers_1.contributeToPost);
router.post("/req-access", [
    (0, express_validator_1.check)("reason")
        .trim()
        .isLength({ min: MIN_REASON_LENGTH, max: MAX_REASON_LENGTH })
        .withMessage(`Reason must be between ${MIN_REASON_LENGTH} and ${MAX_REASON_LENGTH} characters.`),
    (0, express_validator_1.check)("role_applied")
        .isIn(env_data_1.ADMIN_DATA.ROLE_APPLIED)
        .withMessage(`Role applied must be among ${env_data_1.ADMIN_DATA.ROLE_APPLIED.join(", ")}`),
], user_controllers_1.reqAccess);
exports.default = router;
