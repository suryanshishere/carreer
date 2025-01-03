// Importing shared dependencies
import { IDates } from "models/postModels/overallInterfaces/IDates";
import { ILinks } from "models/postModels/overallInterfaces/ILinks";
import { ICommon } from "./overallInterfaces/ICommon";
import { IFees } from "./overallInterfaces/IFees";

// Interface for IResultCategory
interface IResultCategory {
  general?: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  ph_dviyang?: number;
}

// Interface for ISyllabusList
export interface ISyllabusList {
  important_links?: ILinks;
  important_dates?: IDates;
}

// Interface for IResultList
export interface IResultList {
  result?: IResultCategory;
  important_links?: ILinks;
}

// Interface for ILatestJobList
export interface ILatestJobList {
  important_links?: ILinks;
  important_dates?: IDates;
}

// Interface for IImportantList
export interface IImportantList {
  important_links?: ILinks;
  important_dates?: IDates;
}

// Interface for ICertificateVerificationList
export interface ICertificateVerificationList {
  important_links?: ILinks;
  important_dates?: IDates;
}

// Interface for IAdmitCardList
export interface IAdmitCardList {
  important_links?: ILinks;
  important_dates?: IDates;
}

// Common interface for list data with basic fields
export interface ICommonListData {
  name_of_the_post: string;
  updatedAt: string;
  _id: string;
  is_saved: boolean;
  post: { post_code: string };
}

// Interface for IAdmissionList
export interface IAdmissionList {
  important_links?: ILinks;
  important_dates?: IDates;
}

// Interface for ISyllabusData
interface ISyllabusData {
  section: string;
  topics: string;
}

// Interface for ISyllabusDetail
export interface ISyllabus {
  syllabus?: ISyllabusData[];
  important_links?: ILinks;
  important_dates?: IDates;
  common?: ICommon;
}

// Interface for IResult
export interface IResult {
  how_to_download_result?: string;
  result?: IResultCategory;
  common?: ICommon;
  important_links?: ILinks;
  important_dates?: IDates;
}

// Interface for IHowToFillForm
export interface IHowToFillForm {
  registration: string;
  apply: string;
  video_link: string | null;
}

// Interface for ILatestJob
export interface ILatestJob {
  how_to_fill_the_form?: IHowToFillForm;
  common?: ICommon;
  application_fee?: IFees;
  important_dates?: IDates;
  important_links?: ILinks;
}

// Interface for ICommonDetailData
export interface ICommonDetailData {
  createdAt: string;
  updatedAt: string;
  created_by: string;
  contributors?: string[]; //todo: for better user presentation convert to populate
  approved: boolean;
  name_of_the_post: string;
}

// Interface for ICertificateVerification
export interface ICertificateVerification {
  how_to_fill_the_form?: string;
  common?: ICommon;
  important_dates?: IDates;
  important_links?: ILinks;
}

// Interface for IAdmitCard
export interface IAdmitCard {
  how_to_download_admit_card?: string;
  common?: ICommon;
  important_dates?: IDates;
  important_links?: ILinks;
}

// Interface for IAdmission
export interface IAdmission {
  post_common?: ICommon;
  important_dates?: IDates;
  important_links?: ILinks;
}

// Interface for IImportant
export interface IImportant {
  how_to_fill_the_form?: string;
  important_links?: ILinks;
  important_dates?: IDates;
  common?: ICommon;
}

// Interface for IAnswerKey
export interface IAnswerKey {
  how_to_download_answer_key?: string;
  common?: ICommon;
  important_dates?: IDates;
  important_links?: ILinks;
  syllabus?: ISyllabus;
}
