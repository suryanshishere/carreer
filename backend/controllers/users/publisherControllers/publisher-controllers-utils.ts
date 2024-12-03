import HttpError from "@utils/http-errors";
import { Response, NextFunction, Request } from "express";
import crypto from "crypto";
import Result from "@models/post/sectionModel/result-model";
import Admission from "@models/post/sectionModel/admission-model";
import AdmitCard from "@models/post/sectionModel/admit-card-model";
import AnswerKey from "@models/post/sectionModel/answer-key";
import CertificateVerification from "@models/post/sectionModel/certificate-verification-model";
import PostCommon from "@models/post/overallModel/common-model";
import PostImportant from "@models/post/sectionModel/important-model";
import LatestJob from "@models/post/sectionModel/latest-job-model";
import Syllabus from "@models/post/sectionModel/syllabus-model";
import { Model } from "mongoose";
import { JWTRequest } from "@middleware/check-auth";

export const checkAuthorisedPublisher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as JWTRequest).user;
  if (user.role != "publisher") {
    return next(new HttpError("Unauthorized access!", 403));
  }
};

export const postIdGeneration = async (postCode: string): Promise<string> => {
  const hash = crypto.createHash("sha256");
  hash.update(postCode);
  const uniqueId = hash.digest("hex");
  return uniqueId.slice(0, 24);
};

export const modelMap: { [key: string]: Model<any> } = {
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
