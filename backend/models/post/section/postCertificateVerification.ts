import mongoose from "mongoose";
import { ICertificateVerification } from "../post-section-interface";
import commonDataSchema from "../common/post-common";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const certificateVerificationSchema = new Schema<ICertificateVerification>({
  how_to_fill_the_form: { type: String },
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
});

certificateVerificationSchema.add(commonDataSchema);

export { certificateVerificationSchema };

const CertificateVerification = mongoose.model(
  "CertificateVerification",
  certificateVerificationSchema
);

export default CertificateVerification;
