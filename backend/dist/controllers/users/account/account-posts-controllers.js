"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unBookmarkPost = exports.bookmarkPost = exports.savedPosts = void 0;
const user_model_1 = __importDefault(require("src/models/user/user-model"));
const http_errors_1 = __importDefault(require("src/utils/http-errors"));
const check_auth_1 = require("src/middleware/check-auth");
const posts_populate_1 = require("@controllers/posts/postsControllersUtils/postPopulate/posts-populate");
const sectionPostListSelect_1 = require("@controllers/posts/postsControllersUtils/postSelect/sectionPostListSelect");
const env_data_1 = require("src/shared/env-data");
const postSectionsArray = env_data_1.POST_ENV_DATA.SECTIONS;
const savedPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userData.userId;
    try {
        const query = user_model_1.default.findById(userId).select("saved_posts -_id");
        postSectionsArray.forEach((section) => {
            const selectFields = [
                sectionPostListSelect_1.COMMON_SELECT_FIELDS,
                sectionPostListSelect_1.sectionPostListSelect[section] || "",
            ]
                .filter(Boolean)
                .join(" ");
            query.populate({
                path: `saved_posts.${section}`,
                select: selectFields,
                populate: posts_populate_1.sectionListPopulate[section] || null,
            });
        });
        const userSavedPost = yield query;
        // .populate([
        //   "saved_posts.answer_key_ref",
        //   "saved_posts.admit_card_ref",
        //   "saved_posts.latest_job_ref",
        //   "saved_posts.admission_ref",
        //   "saved_posts.certificate_verification_ref",
        //   "saved_posts.important_ref",
        //   "saved_posts.syllabus_ref",
        //   "saved_posts.result_ref",
        // ]);
        if (!userSavedPost) {
            return next(new http_errors_1.default("No user saved post found!", 404));
        }
        return res.status(200).json({ data: userSavedPost });
    }
    catch (error) {
        return next(new http_errors_1.default("Fetching saved posts failed, please try again.", 500));
    }
});
exports.savedPosts = savedPosts;
const bookmarkPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { section, post_id } = req.body;
        const userId = (0, check_auth_1.getUserIdFromRequest)(req);
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return next(new http_errors_1.default("User not found!", 404));
        }
        const currentPosts = ((_a = user.saved_posts) === null || _a === void 0 ? void 0 : _a[section]) || [];
        // Avoid bookmarking the same post_id if it's already present
        if (!currentPosts.includes(post_id)) {
            user.saved_posts = Object.assign(Object.assign({}, user.saved_posts), { [section]: [...currentPosts, post_id] });
            yield user.save();
        }
        const message = user.isEmailVerified
            ? "Post bookmarked successfully!"
            : "Post bookmarked successfully! Verify your email to save it permanently.";
        return res.status(200).json({ message });
    }
    catch (error) {
        console.error("Error bookmarking post:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});
exports.bookmarkPost = bookmarkPost;
const unBookmarkPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { section, post_id } = req.body;
        const userId = (0, check_auth_1.getUserIdFromRequest)(req);
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return next(new http_errors_1.default("User not found!", 404));
        }
        const currentPosts = ((_a = user.saved_posts) === null || _a === void 0 ? void 0 : _a[section]) || [];
        // Remove the post_id from the saved posts if it exists
        const updatedPosts = currentPosts.filter((id) => id.toString() !== post_id);
        if (updatedPosts.length < currentPosts.length) {
            user.saved_posts = Object.assign(Object.assign({}, user.saved_posts), { [section]: updatedPosts });
            yield user.save();
            return res.status(200).json({ message: "Post Un-bookmarked!" });
        }
        else {
            return next(new http_errors_1.default("Post not found in saved posts.", 404));
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Un-bookmarking failed, try again!" });
    }
});
exports.unBookmarkPost = unBookmarkPost;
