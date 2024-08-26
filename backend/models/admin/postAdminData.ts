import mongoose, { Schema } from "mongoose";
import { admissionSchema } from "@models/post/section/postAdmission";
import { admitCardSchema } from "@models/post/section/postAdmitCard";
import { answerKeySchema } from "@models/post/section/postAnswerKey";
import { certificateVerificationSchema } from "@models/post/section/postCertificateVerification";
import { postCommonSchema } from "@models/post/section/postCommon";
import { postImportantSchema } from "@models/post/section/postImportant";
import { latestJobSchema } from "@models/post/section/postLatestJob";
import { resultSchema } from "@models/post/section/postResult";
import { syllabusSchema } from "@models/post/section/postSyllabus";

// Generic function to create admin data schema and model
const createAdminDataModel = (name: string, schemaDefinition: Schema) => {
  const adminDataSchema = new Schema({
    approved: { type: Boolean }, // undefined means not approved!
  });

  // Add fields from the passed schema to the adminDataSchema
  adminDataSchema.add(schemaDefinition);

  return mongoose.model(name, adminDataSchema);
};

// Creating all admin data models using .add() for schema fields
export const ResultAdminData = createAdminDataModel(
  "ResultAdminData",
  resultSchema
);

export const AdmissionAdminData = createAdminDataModel(
  "AdmissionAdminData",
  admissionSchema
);

export const AdmitCardAdminData = createAdminDataModel(
  "AdmitCardAdminData",
  admitCardSchema
);

export const AnswerKeyAdminData = createAdminDataModel(
  "AnswerKeyAdminData",
  answerKeySchema
);

export const CertificateVerificationAdminData = createAdminDataModel(
  "CertificateVerificationAdminData",
  certificateVerificationSchema
);

export const PostCommonAdminData = createAdminDataModel(
  "PostCommonAdminData",
  postCommonSchema
);

export const PostImportantAdminData = createAdminDataModel(
  "PostImportantAdminData",
  postImportantSchema
);

export const LatestJobAdminData = createAdminDataModel(
  "LatestJobAdminData",
  latestJobSchema
);

export const SyllabusAdminData = createAdminDataModel(
  "SyllabusAdminData",
  syllabusSchema
);
