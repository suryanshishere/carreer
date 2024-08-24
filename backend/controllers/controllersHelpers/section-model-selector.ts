import {
  AdmissionAdminData,
  AdmitCardAdminData,
  AnswerKeyAdminData,
  CertificateVerificationAdminData,
  IPostAdminData,
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

const modelMap: { [key: string]: mongoose.Model<IPostAdminData> } = {
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
): mongoose.Model<IPostAdminData> | undefined => {
  const { post_section } = req.body;

  const sectionData = convertToSnakeCase(post_section);

  if (!POST_SECTION_DATA.includes(sectionData)) {
    next(new HttpError("Invalid section", 400));
    return undefined;
  }

  // Get the model for the section
  const Model = modelMap[sectionData];
  if (!Model) {
    next(new HttpError("Model not found for the specified section", 400));
    return undefined;
  }

  return Model;
};

export default sectionModelSelector;
