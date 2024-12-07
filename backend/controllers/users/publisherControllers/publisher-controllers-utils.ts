import HttpError from "@utils/http-errors";
import { Response, NextFunction, Request } from "express";
import crypto from "crypto";
import mongoose, { Model, Schema } from "mongoose";
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
import { postOverallArray } from "@controllers/shared/post-array";
import { POST_PROMPT_SCHEMA } from "./postCreation/post-prompt-schema";
import postCreation from "./postCreation/postCreation";
import { MODAL_MAP } from "@controllers/shared/post-model-map";

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

export const checkOverall = async (
  postObjectId: mongoose.Types.ObjectId,
  userObjectId: mongoose.Types.ObjectId,
  nameOfThePost: string,
  next: NextFunction
) => {
  try {
    // Assuming postOverallArray and other variables are properly defined
    const tasks = postOverallArray.map(async (item) => {
      const itemModel = MODAL_MAP[item];
      if (!itemModel) {
        return next(new HttpError("Internal server error: Missing model", 500));
      }

      const post = await itemModel.findById(postObjectId);
      if (!post) {
        const schema = POST_PROMPT_SCHEMA[item];
        if (Object.keys(schema).length === 0) {
          return next(
            new HttpError("Internal server error: Missing schema", 500)
          );
        }

        const dataJson = await postCreation(nameOfThePost, schema, next);
        const newPost = new itemModel({
          _id: postObjectId,
          created_by: userObjectId,
          approved: true,
          ...dataJson,
        });
        await newPost.save();
      }
    });

    await Promise.all(tasks);
  } catch (err) {
    console.log("overall cool", err);
    return next(
      new HttpError("Error occur while creating for overall post", 500)
    );
  }
};
