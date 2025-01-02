"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContributionSchema = void 0;
const env_data_1 = require("../../shared/env-data");
const mongoose_1 = require("mongoose");
// Initialize dynamic fields from POST_ENV_DATA.SECTIONS
const dynamicFields = env_data_1.POST_ENV_DATA.SECTIONS.reduce((fields, key) => {
    // Define a dynamic schema for each section where keys are strings and values are of any type
    fields[key] = { type: mongoose_1.Schema.Types.Mixed };
    return fields;
}, {});
// Schema for approved contributions
const ApprovedContributionSchema = new mongoose_1.Schema({
    approver: { type: mongoose_1.Schema.Types.ObjectId, ref: "Admin", required: true },
    data: {
        type: Map,
        of: new mongoose_1.Schema(dynamicFields, { _id: false }), // Map with dynamic fields
    },
}, { _id: false } // No ID for nested schema
);
// Define the Contribution Schema
exports.ContributionSchema = new mongoose_1.Schema({
    approved: {
        type: [ApprovedContributionSchema],
        default: [],
    },
    contribution: {
        type: Map,
        of: new mongoose_1.Schema(dynamicFields, { _id: false }),
    },
}, {
    timestamps: true,
});
// Create and export the Contribution model
const ContributionModel = (0, mongoose_1.model)("Contribution", exports.ContributionSchema);
exports.default = ContributionModel;
