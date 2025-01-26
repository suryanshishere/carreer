import  POST_ENV_DB  from "@models/post/post-env-db";
import { Schema, Document, model } from "mongoose";

// Interface for a Contribution Document
export interface IContribution extends Document {
  approved: Array<{
    approver: Schema.Types.ObjectId | string; // Reference to the Admin model
    data: Map<string, Record<string, any>>; // Flexible data structure
  }>;
  contribution: Map<string, Record<string, any>>; // Map: post_id -> section data
}

// Initialize dynamic fields from POST_ENV_DB.sections
const dynamicFields = POST_ENV_DB.sections.reduce(
  (fields: Record<string, any>, key: string) => {
    // Define a dynamic schema for each section where keys are strings and values are of any type
    fields[key] = { type: Schema.Types.Mixed };
    return fields;
  },
  {}
);

// Schema for approved contributions
const ApprovedContributionSchema = new Schema(
  {
    approver: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    data: {
      type: Map,
      of: new Schema(dynamicFields, { _id: false }), // Map with dynamic fields
    },
  },
  { _id: false } // No ID for nested schema
);

// Define the Contribution Schema
export const ContributionSchema = new Schema<IContribution>(
  {
    approved: {
      type: [ApprovedContributionSchema],
      default: [],
    },
    contribution: {
      type: Map,
      of: new Schema(dynamicFields, { _id: false }), 
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Contribution model
const ContributionModel = model<IContribution>(
  "Contribution",
  ContributionSchema
);

export default ContributionModel;
