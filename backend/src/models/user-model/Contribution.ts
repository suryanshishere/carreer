import POST_DB from "@models/post-model/post-db";
import { Schema, Document, model } from "mongoose";

// Interface for a Contribution Document
export interface IContribution extends Document {
  createdAt: Date;
  updatedAt: Date;
  approved: Array<{
    approver: Schema.Types.ObjectId | string;
    data: Map<string, Record<string, any>>;
  }>;
  contribution: Map<string, Record<string, any>>;
}

// Initialize dynamic fields from POST_DB.sections
const dynamicFields = POST_DB.sections.reduce(
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
