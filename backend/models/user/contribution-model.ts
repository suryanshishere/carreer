import { POST_ENV_DATA } from "@shared/env-data";
import { Schema, Document, model } from "mongoose";

// Interface for a Contribution Document
export interface IContribution extends Document {
  approved: Array<{
    approver: Schema.Types.ObjectId | string; // Reference to the Admin model
    data: Record<string, any>; // Flexible data structure
  }>;
  contribution: Map<string, Record<string, any>>; // Map: post_id -> section data
}

// Initialize dynamic fields from POST_ENV_DATA.SECTIONS
const dynamicFields = POST_ENV_DATA.SECTIONS.reduce(
  (fields: Record<string, any>, key: string) => {
    fields[key] = { type: Schema.Types.Mixed }; // Flexible structure per section
    return fields;
  },
  {}
);

// Schema for approved contributions
const ApprovedContributionSchema = new Schema(
  {
    approver: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false } // No ID for nested schema
);

// Define the Contribution Schema
export const ContributionSchema = new Schema<IContribution>(
  {
    approved: {
      type: [ApprovedContributionSchema],
      default: [], // Initialize as an empty array
    },
    contribution: {
      type: Map,
      of: new Schema(dynamicFields, { _id: false }), // Map with dynamic fields
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Add an index to improve query performance
ContributionSchema.index({ "approved.approver": 1 });

// Create and export the Contribution model
const ContributionModel = model<IContribution>("Contribution", ContributionSchema);

export default ContributionModel;
