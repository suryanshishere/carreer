import { emailSchema } from "@models/modelsUtils";
import { Schema, model } from "mongoose";

const MIN_NAME_LENGTH = Number(process.env.MIN_NAME_LENGTH) || 3;
const MAX_NAME_LENGTH = Number(process.env.MAX_NAME_LENGTH) || 100;
const MIN_REASON_LENGTH = Number(process.env.MIN_REASON_LENGTH) || 100;
const MAX_REASON_LENGTH = Number(process.env.MAX_REASON_LENGTH) || 500;

const contactUsSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["not_initiated", "in_process", "completed"],
      default: "not_initiated",
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      min: MIN_NAME_LENGTH,
      max: MAX_NAME_LENGTH,
    },
    email: emailSchema,
    reason: {
      type: String,
      required: true,
      min: MIN_REASON_LENGTH,
      max: MAX_REASON_LENGTH,
    },
  },
  {
    timestamps: true,
  }
);

export default model("ContactUs", contactUsSchema);
