"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modelsUtils_1 = require("../modelsUtils");
const env_data_1 = require("../../shared/env-data");
const mongoose_1 = require("mongoose");
const { MIN_NAME_LENGTH, MAX_NAME_LENGTH, MIN_REASON_LENGTH, MAX_REASON_LENGTH, } = env_data_1.CONTACT_US_ENV_DATA;
const contactUsSchema = new mongoose_1.Schema({
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "approved", "rejected"],
        required: true,
        index: true,
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
        min: MIN_NAME_LENGTH,
        max: MAX_NAME_LENGTH,
    },
    email: modelsUtils_1.emailSchema,
    reason: {
        type: String,
        required: true,
        min: MIN_REASON_LENGTH,
        max: MAX_REASON_LENGTH,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("ContactUs", contactUsSchema);
