import { Document, ObjectId, Schema, Types } from "mongoose";

export interface ICommonDetailData extends Document {
  createdAt: Date;
  updatedAt: Date;
  created_by: ObjectId;
  contributors?: ObjectId[];
  approved: boolean;
  name_of_the_post: string;
}

const commonDataSchema = new Schema<ICommonDetailData>(
  {
    created_by: { type: Types.ObjectId, ref: "User", required: true },
    contributors: [{ type: Types.ObjectId, ref: "User" }],
    approved: { type: Boolean, default: false, required: true },
    name_of_the_post: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

export default commonDataSchema;
