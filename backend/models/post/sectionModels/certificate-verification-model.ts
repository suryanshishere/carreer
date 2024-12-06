import mongoose, { Schema, Types } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./section-common-data";

const certificateVerificationSchema = new Schema<ICertificateVerificationDetail>({
  how_to_fill_the_form: { type: String },
  common: { type: Schema.Types.ObjectId, ref: "Common"},
  important_dates: { type: Schema.Types.ObjectId, ref: "Date" },
  important_links: { type: Schema.Types.ObjectId, ref: "Link"},
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
  common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
}
