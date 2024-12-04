// import {
//   AdmissionAdminData,
//   AdmitCardAdminData,
//   AnswerKeyAdminData,
//   CertificateVerificationAdminData,
//   LatestJobAdminData,
//   PostCommonAdminData,
//   PostImportantAdminData,
//   ResultAdminData,
//   SyllabusAdminData,
// } from "@models/admin/postAdminData";
import mongoose, { Model } from "mongoose";
import { convertToSnakeCase } from "./case-convert";
import HttpError from "../../utils/http-errors";
import { Request, Response, NextFunction } from "express";
import Result from "@models/post/sectionModels/result-model";
import Admission from "@models/post/sectionModels/admission-model";
import AdmitCard from "@models/post/sectionModels/admit-card-model";
import AnswerKey from "@models/post/sectionModels/answer-key-model";
import CertificateVerification from "@models/post/sectionModels/certificate-verification-model";
import PostCommon from "@models/post/overallModels/common-model";
import PostImportant from "@models/post/sectionModels/important-model";
import LatestJob from "@models/post/sectionModels/latest-job-model";
import Syllabus from "@models/post/sectionModels/syllabus-model";

// export const POST_SECTION_DATA = [
//   "common",
//   "result",
//   "admit_card",
//   "latest_job",
//   "answer_key",
//   "syllabus",
//   "certificate_verification",
//   "admission",
//   "important",
// ];

// const modelMap: { [key: string]: Model<any> } = {
//   result: Result,
//   admission: Admission,
//   admit_card: AdmitCard,
//   answer_key: AnswerKey,
//   certificate_verification: CertificateVerification,
//   common: PostCommon,
//   important: PostImportant,
//   latest_job: LatestJob,
//   syllabus: Syllabus,
// };

// const adminDataModelMap: { [key: string]: Model<any> } = {
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

// export const sectionAdminModelSelector = (
//   post_section: string,
//   next: NextFunction
// ): mongoose.Model<any> | undefined => {
//   // Convert post_section to snake_case
//   const sectionData = convertToSnakeCase(post_section);

//   // Check if the section data is valid
//   if (!POST_SECTION_DATA.includes(sectionData)) {
//     return undefined;
//   }

//   // Retrieve the model corresponding to the section
//   const Model = adminDataModelMap[sectionData];
//   if (!Model) {
//     return undefined;
//   }

//   return Model;
// };

// export const sectionModelSelector = (
//   post_section: string,
//   next: NextFunction
// ): mongoose.Model<any> | undefined => {
//   // Convert post_section to snake_case
//   const sectionData = convertToSnakeCase(post_section);

//   // Check if the section data is valid
//   if (!POST_SECTION_DATA.includes(sectionData)) {
//     return undefined;
//   }

//   // Retrieve the model corresponding to the section
//   const Model = modelMap[sectionData];
//   if (!Model) {
//     return undefined;
//   }

//   return Model;
// };
