import mongoose, { Schema } from "mongoose";

const { ObjectId } = Schema.Types;

const commonDataSchema = new Schema(
  {
    created_by: { type: ObjectId, ref: "User", required: true },
    contributors: [{ type: ObjectId, ref: "User" }],
    approved: { type: Boolean, default: false, required: true },
    name_of_the_post: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

export default commonDataSchema;
