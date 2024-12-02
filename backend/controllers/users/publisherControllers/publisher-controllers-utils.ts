import HttpError from "@utils/http-errors";
import { Response, NextFunction, Request } from "express";
import crypto from "crypto";
import Result from "@models/post/section/postResult";
import Admission from "@models/post/section/postAdmission";
import AdmitCard from "@models/post/section/postAdmitCard";
import AnswerKey from "@models/post/section/postAnswerKey";
import CertificateVerification from "@models/post/section/postCertificateVerification";
import PostCommon from "@models/post/common/postCommon";
import PostImportant from "@models/post/section/postImportant";
import LatestJob from "@models/post/section/postLatestJob";
import Syllabus from "@models/post/section/postSyllabus";
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
