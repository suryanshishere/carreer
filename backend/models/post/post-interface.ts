import { Types } from "mongoose";
import { ICommonDetailData } from "./sectionModels/common-section-data";
import { ISyllabus } from "./sectionModels/syllabus-model";
import { ILatestJob } from "./sectionModels/latest-job-model";
import { IResult } from "./sectionModels/result-model";
import { IImportant } from "./sectionModels/important-model";
import { ICertificateVerification } from "./sectionModels/certificate-verification-model";
import { IAnswerKey } from "./sectionModels/answer-key-model";
import { IAdmitCard } from "./sectionModels/admit-card-model";
import { IAdmission } from "./sectionModels/admission-model";

export interface IBasePost {
  createdAt: Date;
  updatedAt: Date;
  created_by: Types.ObjectId;
  contributors?: Types.ObjectId[];
  approved: boolean;
  name_of_the_post: string;
}

export type ISection = ISyllabus &
  ILatestJob &
  IResult &
  IImportant &
  ICertificateVerification &
  IAnswerKey &
  IAdmitCard &
  IAdmission;
