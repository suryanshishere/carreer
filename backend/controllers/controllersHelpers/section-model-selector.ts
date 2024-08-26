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
import mongoose from "mongoose";
import { convertToSnakeCase } from "./case-convert";
import HttpError from "../../utils/http-errors";
import { Request, Response, NextFunction } from "express";

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

const modelMap: { [key: string]: mongoose.Model<any> } = {
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

const sectionModelSelector = (
  req: Request,
  res: Response,
  next: NextFunction
): mongoose.Model<any> | undefined => {
  const { post_section } = req.body;

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

export default sectionModelSelector;
