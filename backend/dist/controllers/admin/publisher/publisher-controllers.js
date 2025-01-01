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
exports.createNewPost = exports.createComponentPost = exports.deletePost = void 0;
const validation_error_1 = __importDefault(require("@controllers/sharedControllers/validation-error"));
const http_errors_1 = __importDefault(require("@utils/http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("@models/post/post-model"));
const post_model_map_1 = require("@controllers/sharedControllers/post-model-map");
const publisher_controllers_utils_1 = require("./publisher-controllers-utils");
const express_validator_1 = require("express-validator");
const post_sort_map_1 = require("@controllers/posts/postsControllersUtils/post-sort-map");
const admin_model_1 = __importDefault(require("@models/admin/admin-model"));
//may be used in future
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, section } = req.body;
    if (!postId) {
        return res.status(400).json({ error: "postId is required" });
    }
    try {
        if (section) {
            // Check if the section exists in MODAL_MAP
            const model = post_model_map_1.MODAL_MAP[section];
            if (!model) {
                return res.status(400).json({ error: `Invalid section: ${section}` });
            }
            // Delete the post only from the specified section
            const result = yield model.deleteOne({ _id: postId });
            if (result.deletedCount > 0) {
                console.log(`Post deleted from ${section} model`);
                return res
                    .status(200)
                    .json({ message: `Post deleted from ${section} model` });
            }
            else {
                console.log(`Post not found in ${section} model`);
                return res
                    .status(404)
                    .json({ error: `Post not found in ${section} model` });
            }
        }
        else {
            // If no section is specified, delete the post from all models
            for (const [key, model] of Object.entries(post_model_map_1.MODAL_MAP)) {
                try {
                    const result = yield model.deleteOne({ _id: postId });
                    if (result.deletedCount > 0) {
                        console.log(`Post deleted from ${key} model`);
                    }
                    else {
                        console.log(`Post not found in ${key} model`);
                    }
                }
                catch (error) {
                    console.error(`Error deleting post from ${key} model: `, error);
                }
            }
            return res
                .status(200)
                .json({ message: "Post deletion process completed!" });
        }
    }
    catch (error) {
        console.error("Error in deletePost function:", error);
        return next(new http_errors_1.default("An error occurred while deleting the post", 500));
    }
});
exports.deletePost = deletePost;
//TODO: what if one of the component exist
const createComponentPost = (postId, req, session) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userData.userId;
        const { section, name_of_the_post } = req.body;
        // Loop through the COMPONENT_POST_MODAL_MAP and execute each key in sequence
        for (const [key, model] of Object.entries(post_model_map_1.COMPONENT_POST_MODAL_MAP)) {
            try {
                if (!model) {
                    throw new http_errors_1.default(`Model not found for key: ${key}`, 400);
                }
                let schema = publisher_controllers_utils_1.COMPONENT_POST_PROMPT_SCHEMA_MAP[key];
                if (!schema) {
                    throw new http_errors_1.default(`Schema not found for key: ${key}`, 400);
                }
                schema = (0, post_sort_map_1.updateSchema)(schema, key, section);
                const existingComponent = yield model.findById(postId).session(session);
                if (existingComponent) {
                    // Remove fields related to the existing component from the schema
                    for (const field in existingComponent.toObject()) {
                        if (schema.properties[field]) {
                            console.log(`Removing field: ${field} from schema`);
                            delete schema.properties[field];
                        }
                        if (schema.required && schema.required.includes(field)) {
                            schema.required = schema.required.filter((requiredField) => requiredField !== field);
                        }
                    }
                }
                console.log("schema updated:", schema);
                // Check if schema properties are empty
                if (Object.keys(schema.properties).length === 0) {
                    console.log(`Skipping post creation for key: ${key} as schema properties are empty`);
                    continue;
                }
                const dataJson = yield (0, publisher_controllers_utils_1.postCreation)(name_of_the_post, schema);
                if (!dataJson) {
                    console.error("Post creation failed for:", key);
                    throw new http_errors_1.default("Post creation returned no data", 500);
                }
                console.log("component data generated:", dataJson);
                // Create or update the document
                yield model.findByIdAndUpdate(postId, {
                    $set: Object.assign({ created_by: userId, approved: true }, dataJson),
                }, {
                    new: true,
                    upsert: true,
                    session,
                });
            }
            catch (error) {
                console.error(`Error occurred in component post creation for key: ${key}`, error);
                throw error; // Propagate the error to abort the entire operation
            }
        }
    }
    catch (error) {
        console.error("Error in createComponentPost:", error);
        throw error; // Propagate the error to allow transaction rollback
    }
});
exports.createComponentPost = createComponentPost;
const createNewPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_errors_1.default((0, validation_error_1.default)(errors), 400));
    }
    const { section, name_of_the_post, post_code } = req.body;
    const publisherId = req.userData.userId; //since publisher id will be same as user id but just in the publisher model
    const session = yield mongoose_1.default.startSession();
    try {
        const publisher = yield admin_model_1.default.findById(publisherId)
            .select("role")
            .exec();
        if (!publisher ||
            (publisher.role != "publisher" && publisher.role != "admin")) {
            return next(new http_errors_1.default("Not authorised, request for access or approval of req!", 403));
        }
        // allow time out constraint to be removed (with transaction)
        const result = yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            const postId = yield (0, publisher_controllers_utils_1.postIdGeneration)(post_code);
            console.log("Post ID", postId);
            if (!postId) {
                throw new http_errors_1.default("Post Id generation failed, please try again.", 400);
            }
            const model = post_model_map_1.SECTION_POST_MODAL_MAP[section];
            if (!model) {
                return next(new http_errors_1.default(`No model found for the section: ${section}.`, 400));
            }
            const existingPost = yield model.findById(postId).session(session);
            if (existingPost) {
                return next(new http_errors_1.default("Post already exists!", 400));
            }
            // Create Components
            yield (0, exports.createComponentPost)(postId, req, session);
            // Adjust schema for the section
            let schema = publisher_controllers_utils_1.SECTION_POST_PROMPT_SCHEMA_MAP[section];
            schema = Object.assign(Object.assign({}, schema), { properties: Object.assign(Object.assign({}, schema.properties), { name_of_the_post: {
                        description: publisher_controllers_utils_1.SECTION_DESCRIPTIONS[section]
                            ? `${publisher_controllers_utils_1.SECTION_DESCRIPTIONS[section]} Ensure it captures the intention and provides clarity to the audience.`
                            : `A well-described and engaging name for the post, tailored to the purpose and intention of the ${section} section.`,
                        type: "string",
                    } }), required: [...(schema.required || []), "name_of_the_post"] });
            const dataJson = yield (0, publisher_controllers_utils_1.postCreation)(name_of_the_post, schema);
            if (!dataJson) {
                return new http_errors_1.default("Post creation returned no data.", 500);
            }
            // Save the new post document
            const newPost = new model(Object.assign({ _id: postId, created_by: publisherId, approved: true }, dataJson));
            yield newPost.save({ session });
            const postInPostModel = yield post_model_1.default.findById(postId).session(session);
            if (postInPostModel) {
                yield post_model_1.default.updateOne({ _id: postId }, {
                    $set: {
                        [`sections.${section}`]: { exist: true, approved: false },
                        [`created_by.${section}`]: publisherId,
                    },
                }, { session });
            }
            else {
                const newPostInPostModel = new post_model_1.default({
                    _id: postId,
                    post_code,
                    sections: {
                        [section]: {
                            exist: true,
                            approved: false,
                        },
                    },
                    created_by: {
                        [section]: publisherId,
                    },
                });
                yield newPostInPostModel.save({ session });
            }
            return { postId, newPost };
        }));
        return res
            .status(201)
            .json(Object.assign(Object.assign({}, result), { message: "Created new post successfully!" }));
    }
    catch (error) {
        console.error("Error creating new post:", error);
        return next(new http_errors_1.default("Error occurred while creating new post.", 500));
    }
    finally {
        session.endSession();
    }
});
exports.createNewPost = createNewPost;
