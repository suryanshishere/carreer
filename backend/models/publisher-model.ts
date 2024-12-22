import { ADMIN_DATA, CONTACT_US_ENV_DATA } from "@shared/env-data";
import mongoose, { Schema, Document } from "mongoose";

export interface IPublisher extends Document {
  email: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  user: Schema.Types.ObjectId; 
  expireAt: Date; 
}

const { MIN_REASON_LENGTH, MAX_REASON_LENGTH } = CONTACT_US_ENV_DATA;

export const publisherSchema: Schema = new Schema<IPublisher>(
  {
    //_id will be userid
    email: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      min: MIN_REASON_LENGTH,
      max: MAX_REASON_LENGTH,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user model
    expireAt: { type: Date, expires: ADMIN_DATA.PUBLISHER_DOC_EXPIRY}, // TTL index set to 7 days as type date
  },
  { timestamps: true }
);

const PublisherModal = mongoose.model<IPublisher>("Publisher", publisherSchema);
export default PublisherModal;
