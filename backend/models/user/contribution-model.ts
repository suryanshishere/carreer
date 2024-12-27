import { POST_ENV_DATA } from "@shared/env-data";
import { Schema, Document, model } from "mongoose";

// Interface for a Contribution Document
export interface IContribute extends Document {
  user: Schema.Types.ObjectId;
  contribution: Map<string, { [key: string]: any }>; //string (post_id) : {string (section): {}}
}

// Define dynamic fields based on sections from POST_ENV_DATA
const dynamicFields: Record<string, any> = {};

POST_ENV_DATA.SECTIONS.forEach((key) => {
  dynamicFields[key] = { type: Schema.Types.Mixed };
});

// Define the Contribution Schema
export const ContributionSchema = new Schema<IContribute>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contribution: {
      type: Map,
      of: new Schema(dynamicFields, { _id: false }),
    },
  },
  { timestamps: true }
);

// Create and export the Contribution model
const ContributionModel = model<IContribute>(
  "Contribution",
  ContributionSchema
);

export default ContributionModel;
