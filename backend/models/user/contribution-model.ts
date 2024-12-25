import { POST_ENV_DATA } from "@shared/env-data";
import mongoose, { Schema, Document, model } from "mongoose";

interface ISection {
  key: string;
  value: any;
}

interface IContributeData {
  post_id: mongoose.Types.ObjectId;
  section: ISection[];
}

export interface IContribute extends Document {
  user: mongoose.Types.ObjectId;
  correction: IContributeData[];
}

const SectionSchema = new Schema<ISection>({
  key: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true },
});

const dynamicFields: Record<string, any> = {};
POST_ENV_DATA.SECTIONS.forEach((key) => {
  dynamicFields[key] = { type: [SectionSchema] };
});

const CorrectionItemSchema = new Schema<IContributeData>({
  post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  ...dynamicFields,
});

export const CorrectionSchema = new Schema<IContribute>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    correction: { type: [CorrectionItemSchema] },
  },
  { timestamps: true }
);

const CorrectionModel = model<IContribute>("Correction", CorrectionSchema);

export default CorrectionModel;
