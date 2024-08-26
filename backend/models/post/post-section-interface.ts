import { Types } from "mongoose";

export interface IAdmission {
  createdAt?: Date;
  contributors?: Types.ObjectId[];
  name_of_the_post: string;
  last_updated?: Date;
  post_common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
}

export interface IAdmitCard {
  createdAt?: Date;
  contributors?: Types.ObjectId[];
  name_of_the_post: string;
  last_updated?: Date;
  how_to_download_admit_card?: string;
  syllabus?: Types.ObjectId;
  post_common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
  result_data?: Types.ObjectId;
}

export interface IAnswerKey {
  createdAt?: Date;
  contributors?: Types.ObjectId[];
  name_of_the_post: string;
  answer_key_link?: string;
  last_updated?: Date;
  post_common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
  syllabus?: Types.ObjectId;
}

export interface ICertificateVerification {
  createdAt?: Date;
  contributors?: Types.ObjectId[];
  name_of_the_post: string;
  last_updated?: Date;
  how_to_fill_the_form?: string;
  post_common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
}

export interface IPostImportant {
  createdAt?: Date;
  contributors?: Types.ObjectId[];
  name_of_the_post: string;
  last_updated?: Date;
  how_to_fill_the_form?: string;
  important_links?: Types.ObjectId;
  post_common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
}

export interface IPostCommon {
  createdAt?: Date;
  contributors?: Types.ObjectId[];
  name_of_the_post: string;
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

export interface ILatestJob {
  createdAt?: Date;
  contributors?: Types.ObjectId[];
  name_of_the_post: string;
  last_updated?: Date;
  how_to_do_registration?: string;
  how_to_apply?: string;
  post_common?: Types.ObjectId;
  syllabus?: Types.ObjectId;
  application_fee?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
  result_data?: Types.ObjectId;
}

export interface IResult {
  createdAt?: Date;
  contributors?: Types.ObjectId[];
  name_of_the_post: string;
  last_updated?: Date;
  how_to_download_result?: string;
  result_data?: any[]; // Use `any` if the structure of result data is unknown or varies
  post_common?: Types.ObjectId;
  important_links?: Types.ObjectId;
}

export interface ISyllabus {
  createdAt?: Date;
  contributors?: Types.ObjectId[];
  name_of_the_post: string;
  last_updated?: Date;
  syllabus_data?: any[]; // Use `any` if the structure of syllabus data is unknown or varies
  important_links?: Types.ObjectId;
}
