"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const publisher_controllers_1 = require("../../../controllers/admin/publisher/publisher-controllers");
const express_1 = __importDefault(require("express"));
const publisher_routes_utils_1 = require("./publisher-routes-utils");
const router = express_1.default.Router();
router.post("/create-new-post", publisher_routes_utils_1.createNewPostValidators, publisher_controllers_1.createNewPost);
exports.default = router;
