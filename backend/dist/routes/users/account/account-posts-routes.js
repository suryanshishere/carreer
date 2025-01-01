"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_posts_controllers_1 = require("@controllers/users/account/account-posts-controllers");
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.get("/saved-posts", account_posts_controllers_1.savedPosts);
const bookmarkMiddleware = [
    (0, express_validator_1.check)("post_id").trim().isLength({ min: 24, max: 24 }),
    (0, express_validator_1.check)("section").trim().notEmpty().withMessage("Section is required!"),
];
router.post("/bookmark", bookmarkMiddleware, account_posts_controllers_1.bookmarkPost);
router.post("/un-bookmark", bookmarkMiddleware, account_posts_controllers_1.unBookmarkPost);
exports.default = router;
