import { Request, Response, NextFunction } from "express";
import HttpError from "../../utils/http-errors";
import { POST_SECTION_DATA } from "./admin-public-helpers";
import { convertToSnakeCase } from "@controllers/helper-controllers";
import { validationResult } from "express-validator";
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

export const cool = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cool1 = ResultAdminData.find();
    const cool2 = AdmissionAdminData.find();
    const cofsdoasdfl1 = AdmitCardAdminData.find();
    const cosfdoasdfl1 = AnswerKeyAdminData.find();
    const cosol1 = CertificateVerificationAdminData.find();
    const cfsooasdfl1 = PostCommonAdminData.find();
    const csfooasdfl1 = PostImportantAdminData.find();
    const csooasdfl1 = LatestJobAdminData.find();
    const coosdfl1 = SyllabusAdminData.find();
  } catch (error) {
    return next(
      new HttpError(
        "Fetching post admin data failed, please try again later.",
        500
      )
    );
  }
};

export const postAdminData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError("The input field cannot be left empty.", 422));
    }

    const { post_section } = req.body;

    const sectionData = convertToSnakeCase(post_section);

    if (!POST_SECTION_DATA.includes(sectionData)) {
      return next(new HttpError("Invalid category", 400));
    }

    // Get the model for the section
    const Model = modelMap[sectionData];
    if (!Model) {
      return next(
        new HttpError("Model not found for the specified section", 400)
      );
    }

    // Find documents where `approved` is `undefined` or `false`
    const documents = await Model.find({
      approved: { $ne: true },
    }).select("_id data.name_of_the_post");

    res.status(200).json({ [sectionData]: documents });
  } catch (error) {
    return next(
      new HttpError(
        "Fetching post admin data failed, please try again later.",
        500
      )
    );
  }
};
