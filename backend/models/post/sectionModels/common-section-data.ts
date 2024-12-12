import { Schema, Types, Document } from "mongoose";

export interface ICommonDetailData extends Document {
  createdAt: Date;
  updatedAt: Date;
  created_by: Types.ObjectId;
  contributors?: Types.ObjectId[];
  approved: boolean;
  name_of_the_post: string;
  important_links?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  application_fee?: Types.ObjectId;
  common?: Types.ObjectId;
}

const commonDataSchema = new Schema<ICommonDetailData>(
  {
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contributors: [
      {
        type: Schema.Types.ObjectId,
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
    },
    important_links: { type: Schema.Types.ObjectId, ref: "Link" },
    important_dates: { type: Schema.Types.ObjectId, ref: "Date" },
    common: { type: Schema.Types.ObjectId, ref: "Common" },
    application_fee: { type: Schema.Types.ObjectId, ref: "Fee" },
  },
  { timestamps: true }
);

export default commonDataSchema;
