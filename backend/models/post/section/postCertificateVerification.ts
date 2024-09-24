import mongoose from "mongoose";
import { ICertificateVerification } from "../post-section-interface";
import createCommonDataModel from "../post-common";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const certificateVerificationSchema =
  new Schema<ICertificateVerification>({
    how_to_fill_the_form: { type: String },
    post_common: { type: ObjectId, ref: "PostCommon" },
    important_dates: { type: ObjectId, ref: "PostDate" },
    important_links: { type: ObjectId, ref: "PostLink" },
  });

const CertificateVerification = createCommonDataModel(
  "CertificateVerification",
  certificateVerificationSchema
);

export default CertificateVerification;
