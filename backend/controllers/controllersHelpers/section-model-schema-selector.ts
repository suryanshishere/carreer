import mongoose, { Schema } from "mongoose";
import { convertToSnakeCase } from "./case-convert";
import HttpError from "../../utils/http-errors";
import { NextFunction } from "express";
import { resultSchema } from "@models/post/sectionModels/result-model";
import { admissionSchema } from "@models/post/sectionModels/admission-model";
import { admitCardSchema } from "@models/post/sectionModels/admit-card-model";
import { answerKeySchema } from "@models/post/sectionModels/answer-key-model";
import { certificateVerificationSchema } from "@models/post/sectionModels/certificate-verification-model";
import { commonSchema } from "@models/post/overallModels/common-model";
import { importantSchema } from "@models/post/sectionModels/important-model";
import { latestJobSchema } from "@models/post/sectionModels/latest-job-model";
import { syllabusSchema } from "@models/post/sectionModels/syllabus-model";

export const POST_SECTION_DATA = [
  "common",
  "result",
  "admit_card",
  "latest_job",
  "answer_key",
  "syllabus",
  "certificate_verification",
  "admission",
  "important",
];

export const sectionModelSchemaSelector = (
  post_section: string,
  next: NextFunction
): Schema<any> | undefined => {
  // Convert post_section to snake_case
  // const sectionData = convertToSnakeCase(post_section);

  // // Check if the section data is valid
  // if (!POST_SECTION_DATA.includes(sectionData)) {
  //   next(new HttpError("Invalid section", 400));
  //   return undefined; // Return immediately after calling next()
  // }

  // // Retrieve the model corresponding to the section
  // const ModelSchema = modelSchemaMap[sectionData];
  // if (!ModelSchema) {
  //   return undefined; // Return immediately after calling next()
  // }

  // return ModelSchema;
  return undefined;
};

// const adminDataModelMap: { [key: string]: Schema<any> } = {
//   result: ResultAdminData,
//   admission: AdmissionAdminData,
//   admit_card: AdmitCardAdminData,
//   answer_key: AnswerKeyAdminData,
//   certificate_verification: CertificateVerificationAdminData,
//   post_common: PostCommonAdminData,
//   important: PostImportantAdminData,
//   latest_job: LatestJobAdminData,
//   syllabus: SyllabusAdminData,
// };

// export const sectionAdminModelSchemaSelector = (
//   post_section: string,
//   next: NextFunction
// ): mongoose.Model<any> | undefined => {
//   // Convert post_section to snake_case
//   const sectionData = convertToSnakeCase(post_section);

//   // Check if the section data is valid
//   if (!POST_SECTION_DATA.includes(sectionData)) {
//     next(new HttpError("Invalid section", 400));
//     return undefined;
//   }

//   // Retrieve the model corresponding to the section
//   const Model = adminDataModelMap[sectionData];
//   if (!Model) {
//     next(new HttpError("Model not found for the specified section", 400));
//     return undefined;
//   }

//   return Model;
// };
