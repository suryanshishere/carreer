"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_data_1 = require("@shared/env-data");
const mongoose_1 = require("mongoose");
const applyDefaultId = function () {
    return this._id; // Set the reference to the document's _id
};
const commonDataSchema = new mongoose_1.Schema({
    created_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    contributors: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    approved: {
        type: Boolean,
        default: false,
        required: true,
    },
    name_of_the_post: {
        type: String,
        unique: true,
        required: true,
        minlength: [
            env_data_1.POST_ENV_DATA.MIN_POST_NAME,
            `Post name must be at least ${env_data_1.POST_ENV_DATA.MIN_POST_NAME} characters long.`,
        ],
        maxlength: [
            env_data_1.POST_ENV_DATA.MAX_POST_NAME,
            `Post name must be at least ${env_data_1.POST_ENV_DATA.MAX_POST_NAME} characters long.`,
        ],
    },
    important_links: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Link",
        default: applyDefaultId,
        required: true,
    },
    important_dates: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Date",
        default: applyDefaultId,
        required: true,
    },
    common: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Common",
        default: applyDefaultId,
        required: true,
    },
    application_fee: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Fee",
        default: applyDefaultId,
        required: true,
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
        default: applyDefaultId,
    },
}, { timestamps: true });
exports.default = commonDataSchema;
