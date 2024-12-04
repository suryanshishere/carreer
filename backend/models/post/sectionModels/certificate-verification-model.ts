import mongoose, { Schema, ObjectId, Types } from "mongoose";
import commonDataSchema, { ICommonData } from "./section-common-data";

const certificateVerificationSchema = new Schema<ICertificateVerification>({
  how_to_fill_the_form: { type: String },
  common: { type: Types.ObjectId, ref: "Common" },
  important_dates: { type: Types.ObjectId, ref: "Date" },
  important_links: { type: Types.ObjectId, ref: "Link" },
});

certificateVerificationSchema.add(commonDataSchema);

export { certificateVerificationSchema };

const CertificateVerificationModel = mongoose.model(
  "CertificateVerification",
  certificateVerificationSchema
);

export default CertificateVerificationModel;

export interface ICertificateVerification extends ICommonData {
  how_to_fill_the_form?: string;
  common?: ObjectId;
  important_dates?: ObjectId;
  important_links?: ObjectId;
}
