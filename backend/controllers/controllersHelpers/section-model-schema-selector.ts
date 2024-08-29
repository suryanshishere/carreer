import mongoose, { Schema } from "mongoose";
import { convertToSnakeCase } from "./case-convert";
import HttpError from "../../utils/http-errors";
import { NextFunction } from "express";
import { resultSchema } from "@models/post/section/postResult";
import { admissionSchema } from "@models/post/section/postAdmission";
import { admitCardSchema } from "@models/post/section/postAdmitCard";
import { answerKeySchema } from "@models/post/section/postAnswerKey";
import { certificateVerificationSchema } from "@models/post/section/postCertificateVerification";
import { postCommonSchema } from "@models/post/section/postCommon";
import { postImportantSchema } from "@models/post/section/postImportant";
import { latestJobSchema } from "@models/post/section/postLatestJob";
import { syllabusSchema } from "@models/post/section/postSyllabus";

export const POST_SECTION_DATA = [
  "post_common",
  "result",
  "admit_card",
  "latest_job",
  "answer_key",
  "syllabus",
  "certificate_verification",
  "admission",
  "important",
];

const modelSchemaMap: { [key: string]: Schema<any> } = {
  result: resultSchema,
  admission: admissionSchema,
  admit_card: admitCardSchema,
  answer_key: answerKeySchema,
  certificate_verification: certificateVerificationSchema,
  post_common: postCommonSchema,
  important: postImportantSchema,
  latest_job: latestJobSchema,
  syllabus: syllabusSchema,
};

export const modelSchemaSelector = (
  post_section: string,
  next: NextFunction
): Schema<any> | undefined => {
  // Convert post_section to snake_case
  const sectionData = convertToSnakeCase(post_section);

  // Check if the section data is valid
  if (!POST_SECTION_DATA.includes(sectionData)) {
    next(new HttpError("Invalid section", 400));
    return undefined;
  }

  // Retrieve the model corresponding to the section
  const ModelSchema = modelSchemaMap[sectionData];
  if (!ModelSchema) {
    next(
      new HttpError("Model Schema not found for the specified section", 400)
    );
    return undefined;
  }

  return ModelSchema;
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
