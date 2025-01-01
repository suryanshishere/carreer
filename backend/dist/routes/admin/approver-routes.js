"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const approver_controllers_1 = require("@controllers/admin/approver/approver-controllers");
const posts_routes_1 = require("src/routes/posts/posts-routes");
const express_1 = __importDefault(require("express"));
const publisher_routes_utils_1 = require("./publisher/publisher-routes-utils");
const express_validator_1 = require("express-validator");
const user_routes_1 = require("src/routes/users/user-routes");
const router = express_1.default.Router();
router.post("/apply-contri", [
    (0, posts_routes_1.sectionCheck)("body"),
    (0, publisher_routes_utils_1.postCodeCheck)("body"),
    (0, user_routes_1.objectCheck)("data"),
    (0, express_validator_1.body)("contributor_id")
        .isMongoId()
        .withMessage("Contributor ID must be a valid MongoDB ObjectId."),
], approver_controllers_1.applyContri);
router.get("/contri-post-codes/:section", (0, posts_routes_1.sectionCheck)("param"), approver_controllers_1.getContriPostCodes);
router.get("/contri-post-codes/:section/:postCode", [(0, posts_routes_1.sectionCheck)("param"), (0, publisher_routes_utils_1.postCodeCheck)("param")], approver_controllers_1.getContriPost);
exports.default = router;
