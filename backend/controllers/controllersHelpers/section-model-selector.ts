import {
  AdmissionAdminData,
  AdmitCardAdminData,
  AnswerKeyAdminData,
  CertificateVerificationAdminData,
  LatestJobAdminData,
  PostCommonAdminData,
  PostImportantAdminData,
  ResultAdminData,
  SyllabusAdminData,
} from "@models/admin/postAdminData";
import mongoose, { Model } from "mongoose";
import { convertToSnakeCase } from "./case-convert";
import HttpError from "../../utils/http-errors";
import { Request, Response, NextFunction } from "express";
import Result from "@models/post/section/postResult";
import Admission from "@models/post/section/postAdmission";
import AdmitCard from "@models/post/section/postAdmitCard";
import AnswerKey from "@models/post/section/postAnswerKey";
import CertificateVerification from "@models/post/section/postCertificateVerification";
import PostCommon from "@models/post/section/postCommon";
import PostImportant from "@models/post/section/postImportant";
import LatestJob from "@models/post/section/postLatestJob";
import Syllabus from "@models/post/section/postSyllabus";

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

const modelMap: { [key: string]: Model<any> } = {
  result: Result,
  admission: Admission,
  admit_card: AdmitCard,
  answer_key: AnswerKey,
  certificate_verification: CertificateVerification,
  post_common: PostCommon,
  important: PostImportant,
  latest_job: LatestJob,
  syllabus: Syllabus,
};

const adminDataModelMap: { [key: string]: Model<any> } = {
  result: ResultAdminData,
  admission: AdmissionAdminData,
  admit_card: AdmitCardAdminData,
  answer_key: AnswerKeyAdminData,
  certificate_verification: CertificateVerificationAdminData,
  post_common: PostCommonAdminData,
  important: PostImportantAdminData,
  latest_job: LatestJobAdminData,
  syllabus: SyllabusAdminData,
};

export const sectionAdminModelSelector = (
  post_section: string,
  next: NextFunction
): mongoose.Model<any> | undefined => {
  // Convert post_section to snake_case
  const sectionData = convertToSnakeCase(post_section);

  // Check if the section data is valid
  if (!POST_SECTION_DATA.includes(sectionData)) {
    next(new HttpError("Invalid section", 400));
    return undefined;
  }

  // Retrieve the model corresponding to the section
  const Model = adminDataModelMap[sectionData];
  if (!Model) {
    next(new HttpError("Model not found for the specified section", 400));
    return undefined;
  }

  return Model;
};

export const modelSelector = (
  post_section: string,
  next: NextFunction
): mongoose.Model<any> | undefined => {
  // Convert post_section to snake_case
  const sectionData = convertToSnakeCase(post_section);

  // Check if the section data is valid
  if (!POST_SECTION_DATA.includes(sectionData)) {
    next(new HttpError("Invalid section", 400));
    return undefined;
  }

  // Retrieve the model corresponding to the section
  const Model = modelMap[sectionData];
  if (!Model) {
    next(new HttpError("Model not found for the specified section", 400));
    return undefined;
  }

  return Model;
};
