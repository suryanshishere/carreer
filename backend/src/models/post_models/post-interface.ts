import { Types } from "mongoose";
import { ICommonDetailData } from "./sectionModels/common_section_data_model";
import { ISyllabus } from "./sectionModels/syllabus_model";
import { ILatestJob } from "./sectionModels/latest_job_model";
import { IResult } from "./sectionModels/result_model";
import { IImportant } from "./sectionModels/important_model";
import { ICertificateVerification } from "./sectionModels/certificate_verification_model";
import { IAnswerKey } from "./sectionModels/answer_key_model";
import { IAdmitCard } from "./sectionModels/admit_card_model";
import { IAdmission } from "./sectionModels/admission_model";

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

export interface PopulateOption {
  path: string;
  select?: string;
}

