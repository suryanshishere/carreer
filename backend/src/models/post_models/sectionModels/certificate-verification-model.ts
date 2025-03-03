import mongoose, { Schema, Types } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./common-section-data";
import { POST_LIMITS_DB } from "@models/post_models/posts_db";

const certificateVerificationSchema = new Schema<ICertificateVerification>({
  how_to_fill_the_form: {
    type: String,
    minlength: POST_LIMITS_DB.long_char_limit.min,
    maxlength: POST_LIMITS_DB.long_char_limit.max,
    required: true,
  },
});

certificateVerificationSchema.add(commonDataSchema);
export { certificateVerificationSchema };
const CertificateVerificationModel = mongoose.model(
  "CertificateVerification",
  certificateVerificationSchema
);
export default CertificateVerificationModel;

// ---------------------------------------------

export interface ICertificateVerification extends ICommonDetailData {
  how_to_fill_the_form: string;
}
