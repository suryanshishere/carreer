import mongoose, { Schema, Types } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./common-section-data";

const certificateVerificationSchema = new Schema<ICertificateVerificationDetail>({
  how_to_fill_the_form: { type: String },
});

certificateVerificationSchema.add(commonDataSchema);

export { certificateVerificationSchema };

const CertificateVerificationModel = mongoose.model(
  "CertificateVerification",
  certificateVerificationSchema
);

export default CertificateVerificationModel;

export interface ICertificateVerificationDetail extends ICommonDetailData {
  how_to_fill_the_form?: string;
}
