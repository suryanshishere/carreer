import mongoose, { Schema, Model, Document } from "mongoose";
import { admissionSchema } from "@models/post/section/postAdmission";
import { admitCardSchema } from "@models/post/section/postAdmitCard";
import { answerKeySchema } from "@models/post/section/postAnswerKey";
import { certificateVerificationSchema } from "@models/post/section/postCertificateVerification";
import { postCommonSchema } from "@models/post/section/postCommon";
import { postImportantSchema } from "@models/post/section/postImportant";
import { latestJobSchema } from "@models/post/section/postLatestJob";
import { resultSchema } from "@models/post/section/postResult";
import { syllabusSchema } from "@models/post/section/postSyllabus";
import { IPostDetail } from "./IPostDetail";

const { ObjectId } = Schema.Types;

export interface IPostAdminData extends Document {
  approved?: boolean;
  contributors?: mongoose.Types.ObjectId[];
  data: IPostDetail;
}

// Generic function to create admin data schema and model
const createAdminDataModel = <T extends Document>(
  name: string,
  schemaDefinition: any
): Model<T> => {
  const adminDataSchema = new Schema({
    approved: { type: Boolean }, //undefined means not approved!
    contributors: [{ type: ObjectId, ref: "User" }],
    data: { type: schemaDefinition, require: true },
  });

  return mongoose.model<T>(name, adminDataSchema);
};

// Creating all admin data models
export const ResultAdminData = createAdminDataModel<IPostAdminData>(
  "ResultAdminData",
  resultSchema
);

export const AdmissionAdminData = createAdminDataModel<IPostAdminData>(
  "AdmissionAdminData",
  admissionSchema
);

export const AdmitCardAdminData = createAdminDataModel<IPostAdminData>(
  "AdmitCardAdminData",
  admitCardSchema
);

export const AnswerKeyAdminData = createAdminDataModel<IPostAdminData>(
  "AnswerKeyAdminData",
  answerKeySchema
);

export const CertificateVerificationAdminData = createAdminDataModel<IPostAdminData>(
  "CertificateVerificationAdminData",
  certificateVerificationSchema
);

export const PostCommonAdminData = createAdminDataModel<IPostAdminData>(
  "PostCommonAdminData",
  postCommonSchema
);

export const PostImportantAdminData = createAdminDataModel<IPostAdminData>(
  "PostImportantAdminData",
  postImportantSchema
);

export const LatestJobAdminData = createAdminDataModel<IPostAdminData>(
  "LatestJobAdminData",
  latestJobSchema
);

export const SyllabusAdminData = createAdminDataModel<IPostAdminData>(
  "SyllabusAdminData",
  syllabusSchema
);
