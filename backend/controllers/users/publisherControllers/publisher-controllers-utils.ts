import HttpError from "@utils/http-errors";
import { Response, NextFunction, Request } from "express";
import crypto from "crypto";
import { Model, Schema } from "mongoose";
import { JWTRequest } from "@middleware/check-auth";
import AnswerKeyModel, {
  answerKeySchema,
} from "@models/post/sectionModels/answer-key-model";
import AdmitCardModel, {
  admitCardSchema,
} from "@models/post/sectionModels/admit-card-model";
import AdmissionModel, {
  admissionSchema,
} from "@models/post/sectionModels/admission-model";
import ResultModel, {
  resultSchema,
} from "@models/post/sectionModels/result-model";
import CertificateVerificationModel, {
  certificateVerificationSchema,
} from "@models/post/sectionModels/certificate-verification-model";
import CommonModel, {
  commonSchema,
} from "@models/post/overallModels/common-model";
import ImportantModel, {
  importantSchema,
} from "@models/post/sectionModels/important-model";
import LatestJobModel, {
  latestJobSchema,
} from "@models/post/sectionModels/latest-job-model";
import SyllabusModel, {
  syllabusSchema,
} from "@models/post/sectionModels/syllabus-model";

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
  result: ResultModel,
  admission: AdmissionModel,
  admit_card: AdmitCardModel,
  answer_key: AnswerKeyModel,
  certificate_verification: CertificateVerificationModel,
  post_common: CommonModel,
  important: ImportantModel,
  latest_job: LatestJobModel,
  syllabus: SyllabusModel,
};

export const schemaMap: { [key: string]: Schema<any> } = {
  result: resultSchema,
  admission: admissionSchema,
  admit_card: admitCardSchema,
  answer_key: answerKeySchema,
  certificate_verification: certificateVerificationSchema,
  post_common: commonSchema,
  important: importantSchema,
  latest_job: latestJobSchema,
  syllabus: syllabusSchema,
};
