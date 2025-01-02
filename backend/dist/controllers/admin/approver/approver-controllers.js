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
exports.applyContri = exports.getContriPost = exports.getContriPostCodes = void 0;
const contribution_model_1 = __importDefault(require("../../../models/user/contribution-model"));
const publisher_controllers_utils_1 = require("../publisher/publisher-controllers-utils");
const http_errors_1 = __importDefault(require("../../../utils/http-errors"));
const approver_controllers_utils_1 = require("./approver-controllers-utils");
const mongoose_1 = __importDefault(require("mongoose"));
const validation_error_1 = require("../../sharedControllers/validation-error");
const posts_controllers_utils_1 = require("../../posts/postsControllersUtils/posts-controllers-utils");
const getContriPostCodes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { section } = req.params;
    try {
        (0, validation_error_1.handleValidationErrors)(req, next);
        const result = yield contribution_model_1.default.aggregate([
            {
                // Step 1: Convert the 'contribution' field to an array of key-value pairs
                $project: {
                    contribution: { $objectToArray: "$contribution" },
                },
            },
            {
                // Step 2: Unwind the contribution array
                $unwind: "$contribution",
            },
            {
                // Step 3: Filter documents where the specified section exists in the contribution data
                $match: {
                    [`contribution.v.${section}`]: { $exists: true },
                },
            },
            {
                // Step 4: Group by the contribution key ('k'), counting occurrences
                $group: {
                    _id: "$contribution.k", // Use the key (post_code) as the group ID
                    contribution_submission: { $sum: 1 }, // Count occurrences
                },
            },
            {
                // Step 5: Rename _id to post_code in the output
                $project: {
                    post_code: "$_id", // Rename _id to post_code
                    contribution_submission: 1, // Retain the count field
                },
            },
        ]);
        // If no contributions are found, return a 404 response
        if (!result.length) {
            return res
                .status(404)
                .json({ message: "No contributions found for the given section." });
        }
        // Send the reshaped result to the client
        return res.status(200).json({
            data: result,
            message: "Contribution post codes fetched successfully!",
        });
    }
    catch (error) {
        return next(new http_errors_1.default("Error fetching contribution post codes", 500));
    }
});
exports.getContriPostCodes = getContriPostCodes;
const getContriPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { section, postCode } = req.params;
    try {
        (0, validation_error_1.handleValidationErrors)(req, next);
        const postId = yield (0, publisher_controllers_utils_1.postIdGeneration)(postCode);
        // Retrieve the post document
        const post = yield (0, posts_controllers_utils_1.getSectionPostDetails)(section, postId);
        if (!post) {
            return next(new http_errors_1.default("Post not found!", 404));
        }
        // Find the contribution posts for the specified section and postCode
        const contributionPosts = yield contribution_model_1.default.find({
            [`contribution.${postCode}.${section}`]: { $exists: true },
        })
            .select(`contribution.${postCode}.${section}`)
            .limit(5)
            .exec();
        // Flatten each contribution entry and add it to the response
        const flattenedPosts = contributionPosts.map((contri) => {
            var _a;
            const contributionData = (_a = contri.contribution.get(postCode)) === null || _a === void 0 ? void 0 : _a[section]; /// Safe access
            // Check if contributionData exists before flattening
            if (contributionData) {
                const flattenedContribution = (0, approver_controllers_utils_1.flattenContributionData)(contributionData);
                return Object.assign({ _id: contri._id }, flattenedContribution);
            }
            // Return the contribution without flattening if contributionData doesn't exist
            return {
                _id: contri._id,
                message: "No contribution data found for the specified section",
            };
        });
        // Return the response with the cleaned-up flattened data
        return res.status(200).json({
            data: flattenedPosts,
            post_data: post,
            message: "Contributed post fetched successfully!",
        });
    }
    catch (error) {
        console.log(error);
        return next(new http_errors_1.default("Fetching contribution post failed, please try again!", 500));
    }
});
exports.getContriPost = getContriPost;
const applyContri = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { post_code, data, section, contributor_id } = req.body;
    const approverId = req.userData.userId;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        (0, validation_error_1.handleValidationErrors)(req, next);
        const postId = yield (0, publisher_controllers_utils_1.postIdGeneration)(post_code);
        let post = yield (0, posts_controllers_utils_1.getSectionPostDetails)(section, postId);
        if (!post) {
            return next(new http_errors_1.default("Post not found or not approved.", 404));
        }
        // Update post data
        // This function is being updated, no session required here as it's just modifying the in-memory post object
        yield (0, approver_controllers_utils_1.updatePostData)(post, data, contributor_id);
        const contributor = yield contribution_model_1.default.findById(contributor_id)
            .select(`contribution.${post_code}.${section} approved`)
            .session(session); // Pass the session
        if (!contributor)
            return next(new http_errors_1.default("Contributor not found!", 400));
        // Update contributor contribution
        yield (0, approver_controllers_utils_1.updateContributorContribution)(contributor, post_code, section, data, session);
        // Update contributor approval
        yield (0, approver_controllers_utils_1.updateContributorApproval)(contributor, approverId, post_code, section, data, session);
        // Save post and contributor data inside the transaction
        yield contributor.save({ session });
        yield post.save({ session });
        // Commit the transaction if all steps are successful
        yield session.commitTransaction();
        // End the session
        session.endSession();
        return res
            .status(200)
            .json({ message: "Post updated and configured successfully!" });
    }
    catch (error) {
        // Rollback the transaction in case of any error
        yield session.abortTransaction();
        session.endSession();
        return next(new http_errors_1.default("Something went wrong. Please try again.", 500));
    }
});
exports.applyContri = applyContri;
