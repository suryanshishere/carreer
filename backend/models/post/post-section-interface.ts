import { Types } from "mongoose";

export interface IBasePost {
  createdAt?: Date;
  createdBy: Types.ObjectId;
  contributors?: Types.ObjectId[];
  post_code: string;
  name_of_the_post: string;
  updatedAt?: Date;
}

export interface IAdmission extends IBasePost {
  post_common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
}

export interface IAdmitCard extends IBasePost {
  how_to_download_admit_card?: string;
  syllabus?: Types.ObjectId;
  post_common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
  result_data?: Types.ObjectId;
}

export interface IAnswerKey extends IBasePost {
  answer_key_link?: string;
  post_common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
  syllabus?: Types.ObjectId;
}

export interface ICertificateVerification extends IBasePost{
  how_to_fill_the_form?: string;
  post_common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
}

export interface IPostImportant extends IBasePost{
  how_to_fill_the_form?: string;
  important_links?: Types.ObjectId;
  post_common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
}

export interface IPostCommon extends IBasePost {
  short_information?: string;
  department?: string;
  stage_level?: string;
  applicants?: {
    number_of_applicants_each_year?: number;
    number_of_applicants_selected?: number;
  };
  post_importance?: string;
  post_exam_toughness_ranking?: number;
  job_type?: string;
  post_exam_duration?: number;
  age_criteria?: {
    minimum_age?: number;
    maximum_age?: number;
    age_relaxation?: string;
    other_age_limits?: string;
  };
  vacancy?: {
    post_name?: string;
    total_post?: number;
    post_eligibility?: string;
  }[];
  eligibility?: {
    minimum_qualification?: string;
    other_qualification?: string;
  };
  post_exam_mode?: "online" | "offline_paper_based" | "offline_computer_based";
  applicants_gender?: "male" | "female" | "both";
}

export interface ILatestJob extends IBasePost{
  how_to_do_registration?: string;
  how_to_apply?: string;
  post_common?: Types.ObjectId;
  syllabus?: Types.ObjectId;
  application_fee?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
  result_data?: Types.ObjectId;
}

export interface IResult extends IBasePost{
  how_to_download_result?: string;
  result_data?: any[]; // Use `any` if the structure of result data is unknown or varies
  post_common?: Types.ObjectId;
  important_links?: Types.ObjectId;
}

export interface ISyllabus extends IBasePost{
  syllabus_data?: any[]; // Use `any` if the structure of syllabus data is unknown or varies
  important_links?: Types.ObjectId;
}
