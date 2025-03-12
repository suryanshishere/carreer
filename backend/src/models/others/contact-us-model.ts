import { emailSchema } from "@models/model-utils";
import { CONTACT_US_ENV_DATA } from "@shared/env-data";
import { Schema, model } from "mongoose";

const {
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  MIN_REASON_LENGTH,
  MAX_REASON_LENGTH,
} = CONTACT_US_ENV_DATA;

const contactUsSchema = new Schema(
  {
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
      required: true,
      index: true,
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
