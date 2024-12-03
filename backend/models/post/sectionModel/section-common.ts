import { Document, Schema, Types } from "mongoose";

const { ObjectId } = Schema.Types;

export interface ICommonData extends Document {
  createdAt: Date;
  updatedAt: Date;
  created_by: Types.ObjectId;
  contributors?: Types.ObjectId[];
  approved: boolean;
  name_of_the_post: string;
}

const commonDataSchema = new Schema<ICommonData>(
  {
    created_by: { type: ObjectId, ref: "User", required: true },
    contributors: [{ type: ObjectId, ref: "User" }],
    approved: { type: Boolean, default: false, required: true },
    name_of_the_post: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

export default commonDataSchema;
