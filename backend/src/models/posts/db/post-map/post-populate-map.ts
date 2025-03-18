import { IOverPostRefKey, ISectionKey } from "..";

interface ISectionPopulateEntry {
  path: IOverPostRefKey;
  select?: string;
}

interface IPostEnvData {
  section_detail_populate: Record<ISectionKey, ISectionPopulateEntry[]>;
  section_list_populate: Record<ISectionKey, ISectionPopulateEntry[]>;
}

export const POST_DB: IPostEnvData = {
  section_detail_populate: {
    result: [
      {
        path: "link_ref",
        select:
          "view_results official_website additional_resources createdAt updatedAt",
      },
      {
        path: "common_ref",
        select: "-post_exam_duration -age_criteria -eligibility",
      },
      {
        path: "date_ref",
        select:
          "result_announcement_date additional_resources counseling_result_announcement_date counseling_end_date counseling_start_date  createdAt updatedAt",
      },
      { path: "result_ref" },
    ],
    admit_card: [
      {
        path: "date_ref",
        select:
          "result_announcement_date admit_card_release_date answer_key_release_date exam_date createdAt updatedAt",
      },
      {
        path: "link_ref",
        select:
          "official_website get_admit_card download_sample_papers additional_resources createdAt updatedAt",
      },
      { path: "common_ref", select: "-eligibility " },
      { path: "syllabus_ref", select: "syllabus createdAt updatedAt" },
      { path: "admit_card_ref" },
    ],
    latest_job: [
      {
        path: "link_ref",
        select:
          "apply_online register_now official_website download_sample_papers additional_resources createdAt updatedAt",
      },
      { path: "date_ref", select: "" },
      { path: "fee_ref", select: "" },
      { path: "common_ref", select: "" },
      { path: "latest_job_ref" },
    ],
    syllabus: [
      {
        path: "date_ref",
        select:
          "application_start_date application_end_date exam_date additional_resources createdAt updatedAt",
      },
      { path: "link_ref", select: "official_website createdAt updatedAt" },
      { path: "common_ref", select: "" },
      { path: "syllabus_ref" },
    ],
    answer_key: [
      { path: "common_ref", select: "-eligibility" },
      {
        path: "date_ref",
        select:
          "answer_key_release_date result_announcement_date counseling_start_date counseling_end_date counseling_result_announcement_date createdAt updatedAt",
      },
      {
        path: "link_ref",
        select:
          "official_website check_answer_key get_admit_card createdAt updatedAt",
      },
      { path: "syllabus_ref", select: "syllabus createdAt updatedAt" },
      { path: "answer_key_ref" },
    ],
    certificate_verification: [
      {
        path: "link_ref",
        select:
          "get_admit_card check_answer_key view_results official_website additional_resources createdAt updatedAt",
      },
      {
        path: "date_ref",
        select:
          "additional_resources certificate_verification_date createdAt updatedAt",
      },
      {
        path: "common_ref",
        select: "short_information department eligibility createdAt updatedAt",
      },
      { path: "certificate_verification_ref" },
    ],
    important: [
      {
        path: "common_ref",
        select: "short_information department stage_level createdAt updatedAt",
      },
      {
        path: "date_ref",
        select: "additional_resources important_date createdAt updatedAt",
      },
      {
        path: "link_ref",
        select: "official_website additional_resources createdAt updatedAt",
      },
      { path: "important_ref" },
    ],
    admission: [
      {
        path: "common_ref",
        select: "-post_exam_duration -post_exam_toughness_ranking ",
      },
      {
        path: "date_ref",
        select:
          "counseling_start_date counseling_end_date counseling_result_announcement_date additional_resources createdAt updatedAt",
      },
      {
        path: "link_ref",
        select:
          "get_admit_card additional_resources view_results counseling_portal verify_certificates createdAt updatedAt",
      },
      { path: "admission_ref" },
    ],
  },
  section_list_populate: {
    result: [
      {
        path: "link_ref",
        select: "view_results official_website createdAt updatedAt",
      },
      {
        path: "date_ref",
        select: "result_announcement_date createdAt updatedAt",
      },
      { path: "result_ref", select: "name_of_the_post createdAt updatedAt" },
    ],
    admit_card: [
      {
        path: "date_ref",
        select: "admit_card_release_date exam_date createdAt updatedAt",
      },
      {
        path: "link_ref",
        select:
          "official_website get_admit_card download_sample_papers createdAt updatedAt",
      },
      {
        path: "admit_card_ref",
        select: "name_of_the_post createdAt updatedAt",
      },
    ],
    latest_job: [
      {
        path: "link_ref",
        select:
          "apply_online register_now official_website createdAt updatedAt",
      },
      {
        path: "date_ref",
        select:
          "application_start_date application_end_date exam_date createdAt updatedAt",
      },
      {
        path: "latest_job_ref",
        select: "name_of_the_post createdAt updatedAt",
      },
    ],
    syllabus: [
      {
        path: "date_ref",
        select:
          "application_start_date additional_resources createdAt updatedAt",
      },
      { path: "link_ref", select: "official_website createdAt updatedAt" },
      { path: "syllabus_ref", select: "name_of_the_post createdAt updatedAt" },
    ],
    answer_key: [
      {
        path: "date_ref",
        select:
          "answer_key_release_date result_announcement_date createdAt updatedAt",
      },
      {
        path: "link_ref",
        select:
          "official_website check_answer_key get_admit_card createdAt updatedAt",
      },
      {
        path: "answer_key_ref",
        select: "name_of_the_post createdAt updatedAt",
      },
    ],
    certificate_verification: [
      {
        path: "link_ref",
        select: "official_website additional_resources createdAt updatedAt",
      },
      {
        path: "date_ref",
        select: "certificate_verification_date createdAt updatedAt",
      },
      {
        path: "certificate_verification_ref",
        select: "name_of_the_post createdAt updatedAt",
      },
    ],
    important: [
      {
        path: "date_ref",
        select: "additional_resources important_date createdAt updatedAt",
      },
      {
        path: "link_ref",
        select: "official_website additional_resources createdAt updatedAt",
      },
      { path: "important_ref", select: "name_of_the_post createdAt updatedAt" },
    ],
    admission: [
      {
        path: "date_ref",
        select:
          "counseling_start_date counseling_end_date counseling_result_announcement_date createdAt updatedAt",
      },
      {
        path: "link_ref",
        select: "view_results counseling_portal createdAt updatedAt",
      },
      { path: "admission_ref", select: "name_of_the_post createdAt updatedAt" },
    ],
  },
};

export default POST_DB;
