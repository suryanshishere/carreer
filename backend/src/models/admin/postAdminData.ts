// import mongoose, { Schema } from "mongoose";
// import { admissionSchema } from "@models/post/sectionModel/admission-model";
// import { admitCardSchema } from "@models/post/sectionModel/admit-card-model";
// import { answerKeySchema } from "@models/post/sectionModel/answer-key";
// import { certificateVerificationSchema } from "@models/post/sectionModel/certificate-verification-model";
// import { postCommonSchema } from "@models/post/overallModel/common-model";
// import { importantSchema } from "@models/post/sectionModel/important-model";
// import { latestJobSchema } from "@models/post/sectionModel/latest-job-model";
// import { resultSchema } from "@models/post/sectionModel/result-model";
// import { syllabusSchema } from "@models/post/sectionModel/syllabus-model";

// // Generic function to create admin data schema and model
// const createAdminDataModel = (name: string, schemaDefinition: Schema) => {
//   const adminDataSchema = new Schema({
//     approved: { type: Boolean }, // undefined means not approved!
//   });

//   // Add fields from the passed schema to the adminDataSchema
//   adminDataSchema.add(schemaDefinition);

//   return mongoose.model(name, adminDataSchema);
// };

// // Creating all admin data models using .add() for schema fields
// export const ResultAdminData = createAdminDataModel(
//   "ResultAdminData",
//   resultSchema
// );

// export const AdmissionAdminData = createAdminDataModel(
//   "AdmissionAdminData",
//   admissionSchema
// );

// export const AdmitCardAdminData = createAdminDataModel(
//   "AdmitCardAdminData",
//   admitCardSchema
// );

// export const AnswerKeyAdminData = createAdminDataModel(
//   "AnswerKeyAdminData",
//   answerKeySchema
// );

// export const CertificateVerificationAdminData = createAdminDataModel(
//   "CertificateVerificationAdminData",
//   certificateVerificationSchema
// );

// export const PostCommonAdminData = createAdminDataModel(
//   "PostCommonAdminData",
//   postCommonSchema
// );

// export const PostImportantAdminData = createAdminDataModel(
//   "PostImportantAdminData",
//   importantSchema
// );

// export const LatestJobAdminData = createAdminDataModel(
//   "LatestJobAdminData",
//   latestJobSchema
// );

// export const SyllabusAdminData = createAdminDataModel(
//   "SyllabusAdminData",
//   syllabusSchema
// );
