import * as crypto from "crypto";
import Admission from "@models/post/sectionModel/admission-model";
import AdmitCard from "@models/post/sectionModel/admit-card-model";
import CertificateVerification from "@models/post/sectionModel/certificate-verification-model";
import Important from "@models/post/sectionModel/important-model";
import LatestJob from "@models/post/sectionModel/latest-job-model";
import Result from "@models/post/sectionModel/result-model";
import Syllabus from "@models/post/sectionModel/syllabus-model";
import AnswerKey from "@models/post/sectionModel/answer-key";
import { Model } from "mongoose";

// Define the PostModel interface
interface PostModel extends Model<any> {}

// Define the type for models
type Models = {
  [key: string]: PostModel;
};

// Fetch posts function
export const fetchPosts = async (Model: PostModel, limit: number) => {
  return Model.find({})
    .sort({ last_updated: -1 })
    .limit(limit)
    .select("name_of_the_post post_code _id")
    .exec();
};

export const MODEL_DATA: Models = {
  result: Result,
  admit_card: AdmitCard,
  latest_job: LatestJob,
  syllabus: Syllabus,
  answer_key: AnswerKey,
  certificate_verification: CertificateVerification,
  important: Important,
  admission: Admission,
};

// Define the type for the populate options
interface PopulateOption {
  path: string;
  select?: string; // Optional field, as not all paths need a select
}

// Define the type for the populate models object
interface PopulateModels {
  [key: string]: PopulateOption[]; // Keys are categories, values are arrays of PopulateOption
}

export const populateModels: PopulateModels = {
  result: [
    {
      path: "important_links",
      select: "result_download_link official_website custom_links",
    },
    {
      path: "post_common",
      select: "-post_code -post_exam_duration -age_criteria -eligibility",
    },
  ],
  admit_card: [
    {
      path: "important_dates",
      select:
        "result_release_date answer_key_release_date exam_date admit_card_release_date ",
    },
    {
      path: "important_links",
      select:
        "official_website admit_card_download_link sample_paper_download_link custom_links",
    },
    { path: "post_common", select: "-post_code -eligibility" },
    { path: "result_data", select: "result_data" },
    { path: "syllabus", select: "syllabus_data" },
  ],
  latest_job: [
    { path: "result_data", select: "result_data" },
    {
      path: "important_links",
      select:
        "application_link registration_link official_website sample_paper_download_link custom_links",
    },
    { path: "important_dates", select: "-post_code" },
    { path: "application_fee", select: "-post_code" },
    { path: "syllabus", select: "syllabus_data" },
    { path: "post_common", select: "-post_code" },
  ],
  syllabus: [{ path: "important_links", select: "official_website" }],
  answer_key: [
    { path: "post_common", select: "-post_code -eligibility" },
    {
      path: "important_dates",
      select:
        "answer_key_release_date result_release_date counseling_start_date counseling_deadline counseling_result_release_date",
    },
    {
      path: "important_links",
      select:
        "official_website answer_key_download_link admit_card_download_link",
    },
    { path: "syllabus", select: "syllabus_data" },
  ],
  certificate_verification: [
    {
      path: "important_links",
      select:
        "admit_card_download_link answer_key_download_link result_download_link official_website custom_links",
    },
    { path: "important_dates", select: "custom_dates" },
    { path: "post_common", select: "eligibility" },
  ],
  important: [
    { path: "post_common", select: "department stage_level" },
    { path: "important_dates", select: "custom_dates" },
    { path: "important_links", select: "official_website custom_links" },
  ],
  admission: [
    {
      path: "post_common",
      select:
        "-post_code -age_criteria -eligibility -post_exam_duration -post_exam_toughness_ranking",
    },
    {
      path: "important_dates",
      select:
        "counseling_start_date counseling_deadline counseling_result_release_date",
    },
  ],
};
