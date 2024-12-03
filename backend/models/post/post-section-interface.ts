import { Types } from "mongoose";

// Age criteria for different categories and genders

export interface IBasePost {
  createdAt: Date;
  updatedAt: Date;
  created_by: Types.ObjectId;
  contributors?: Types.ObjectId[];
  approved:boolean;
  name_of_the_post: string;
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

export interface ICertificateVerification extends IBasePost {
  how_to_fill_the_form?: string;
  post_common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
}

export interface IPostImportant extends IBasePost {
  how_to_fill_the_form?: string;
  important_links?: Types.ObjectId;
  post_common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
}



interface HowToFillForm {
  registration: string;
  apply: string;
  video_link: string | null;
}


export interface IResult extends IBasePost {
  how_to_download_result?: string;
  result_data?: any[]; // Use `any` if the structure of result data is unknown or varies
  post_common?: Types.ObjectId;
  important_links?: Types.ObjectId;
}

export interface ISyllabus extends IBasePost {
  syllabus_data?: any[]; // Use `any` if the structure of syllabus data is unknown or varies
  important_links?: Types.ObjectId;
}
