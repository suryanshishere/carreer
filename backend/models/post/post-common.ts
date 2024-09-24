import mongoose, { Schema } from "mongoose";

const { ObjectId } = Schema.Types;

const commonDataSchema = new Schema(
  {
    createdBy: { type: ObjectId, ref: "User" },
    contributors: [{ type: ObjectId, ref: "User" }],
    post_code: { type: String, unique: true, required: true },
    name_of_the_post: { type: String, unique: true },
  },
  { timestamps: true }
);

export default commonDataSchema;
