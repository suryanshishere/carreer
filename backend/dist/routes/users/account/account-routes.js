"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const account_posts_routes_1 = __importDefault(require("./account-posts-routes"));
const setting_routes_1 = __importDefault(require("./setting-routes"));
router.use("/post", account_posts_routes_1.default);
router.use("/setting", setting_routes_1.default);
exports.default = router;
