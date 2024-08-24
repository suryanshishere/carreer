import { Request, Response, NextFunction } from "express";
import HttpError from "../../utils/http-errors";
import { validationResult } from "express-validator";
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
import sectionModelSelector from "@controllers/controllersHelpers/section-model-selector";

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
    const modelSelected = sectionModelSelector(req, res, next);

    // Find documents where `approved` is `undefined` or `false`
    if (modelSelected !== undefined) {
      const documents = await modelSelected
        .find({
          approved: { $ne: true },
        })
        .select("_id data.name_of_the_post");

      res.status(200).json({ [post_section]: documents });
    }
  } catch (error) {
    return next(
      new HttpError(
        "Fetching post admin data failed, please try again later.",
        500
      )
    );
  }
};
