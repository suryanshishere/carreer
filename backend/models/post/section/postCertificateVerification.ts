import mongoose from "mongoose";
import { ICertificateVerification } from "../post-section-interface";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const certificateVerificationSchema =
  new Schema<ICertificateVerification>({
    createdAt: { type: Date },
    contributors: [{ type: ObjectId, ref: "User" }],
    post_code: { type: String, unique: true, required: true },
    name_of_the_post: { type: String, unique: true },
    last_updated: { type: Date, require: true },
    how_to_fill_the_form: { type: String },
    post_common: { type: ObjectId, ref: "PostCommon" },
    important_dates: { type: ObjectId, ref: "PostDate" },
    important_links: { type: ObjectId, ref: "PostLink" },
  });

const CertificateVerification = mongoose.model(
  "CertificateVerification",
  certificateVerificationSchema
);

export default CertificateVerification;
