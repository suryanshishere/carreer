"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDetail = exports.section = exports.home = exports.helpless = void 0;
const http_errors_1 = __importDefault(require("@utils/http-errors"));
const lodash_1 = require("lodash");
const check_auth_1 = require("@middleware/check-auth");
const common_model_1 = __importDefault(require("@models/post/componentModels/common-model"));
const fee_model_1 = __importDefault(require("@models/post/componentModels/fee-model"));
const date_model_1 = __importDefault(require("@models/post/componentModels/date-model"));
const link_model_1 = __importDefault(require("@models/post/componentModels/link-model"));
const post_model_1 = __importDefault(require("@models/post/post-model"));
const posts_controllers_utils_1 = require("./postsControllersUtils/posts-controllers-utils");
const post_model_map_1 = require("@controllers/sharedControllers/post-model-map");
const validation_error_1 = __importStar(require("@controllers/sharedControllers/validation-error"));
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("@models/user/user-model"));
// const HOME_LIMIT = Number(process.env.NUMBER_OF_POST_SEND_HOMELIST) || 12;
//todo
const CATEGORY_LIMIT = Number(process.env.NUMBER_OF_POST_SEND_CATEGORYLIST) || 25;
// Example utility function (unused)
const helpless = () => {
    const cool = link_model_1.default.find({});
    const cool1 = date_model_1.default.find({});
    const cool2 = fee_model_1.default.find({});
    const cool3 = common_model_1.default.find({});
    const cool5 = post_model_1.default.find({});
};
exports.helpless = helpless;
const home = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = (0, check_auth_1.getUserIdFromRequest)(req);
        const user = yield user_model_1.default.findById(userId);
        const savedPost = (user === null || user === void 0 ? void 0 : user.saved_posts) || null;
        const dataPromises = Object.keys(post_model_map_1.SECTION_POST_MODAL_MAP).map((key) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const snakeKey = (0, lodash_1.snakeCase)(key);
            const savedIds = ((_a = savedPost === null || savedPost === void 0 ? void 0 : savedPost[snakeKey]) === null || _a === void 0 ? void 0 : _a.map(String)) || [];
            const posts = yield (0, posts_controllers_utils_1.fetchPostList)(snakeKey, false, next);
            //todo: improve error handling
            return {
                [snakeKey]: posts === null || posts === void 0 ? void 0 : posts.map((_a) => {
                    var { _id } = _a, rest = __rest(_a, ["_id"]);
                    return (Object.assign({ _id, is_saved: savedIds.includes(String(_id)) }, rest));
                }),
            };
        }));
        const dataArray = yield Promise.all(dataPromises);
        const response = dataArray.reduce((acc, curr) => {
            return Object.assign(Object.assign({}, acc), curr);
        }, {});
        return res.status(200).json({ data: response });
    }
    catch (err) {
        console.log(err);
        return next(new http_errors_1.default("An error occurred while fetching posts", 500));
    }
});
exports.home = home;
const section = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { section } = req.params;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return next(new http_errors_1.default((0, validation_error_1.default)(errors), 400));
        }
        const userId = (0, check_auth_1.getUserIdFromRequest)(req);
        const user = yield user_model_1.default.findById(userId);
        let savedIds = [];
        if (user) {
            if ((_a = user === null || user === void 0 ? void 0 : user.saved_posts) === null || _a === void 0 ? void 0 : _a[section]) {
                savedIds = user.saved_posts[section].map(String);
            }
        }
        const response = yield (0, posts_controllers_utils_1.fetchPostList)(section, true, next);
        //todo: if null them better
        const postsWithSavedStatus = response === null || response === void 0 ? void 0 : response.map((_a) => {
            var { _id } = _a, rest = __rest(_a, ["_id"]);
            return (Object.assign(Object.assign({ _id }, rest), { is_saved: savedIds.includes(String(_id)) }));
        });
        const responseData = {
            data: { [section]: postsWithSavedStatus },
        };
        return res.status(200).json(responseData);
    }
    catch (err) {
        return next(new http_errors_1.default("An error occurred while fetching posts!", 500));
    }
});
exports.section = section;
// Get the detailed information of a specific post
const postDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { section, postId } = req.params;
    try {
        (0, validation_error_1.handleValidationErrors)(req, next);
        const response = yield (0, posts_controllers_utils_1.getSectionPostDetails)(section, postId);
        if (!response) {
            return next(new http_errors_1.default("Post not found!", 404));
        }
        let isSaved = false;
        const userId = (0, check_auth_1.getUserIdFromRequest)(req);
        const user = yield user_model_1.default.findById(userId);
        const { Types } = require("mongoose");
        if (user && (user === null || user === void 0 ? void 0 : user.saved_posts)) {
            const savedPosts = user.saved_posts[section] || [];
            const postIdObj = new Types.ObjectId(postId);
            isSaved = savedPosts.some((savedPost) => savedPost.equals(postIdObj));
        }
        const responseWithSavedStatus = {
            data: response,
            is_saved: isSaved,
        };
        return res.status(200).json(responseWithSavedStatus);
    }
    catch (err) {
        // console.log(err);
        return next(new http_errors_1.default("An error occurred while fetching the post.", 500));
    }
});
exports.postDetail = postDetail;
