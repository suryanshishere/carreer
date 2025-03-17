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
        select: "view_results official_website additional_resources",
      },
      {
        path: "common_ref",
        select: "-post_exam_duration -age_criteria -eligibility",
      },
      {
        path: "date_ref",
        select:
          "result_announcement_date additional_resources counseling_result_announcement_date counseling_end_date counseling_start_date",
      },
      { path: "result_ref" },
    ],
    admit_card: [
      {
        path: "date_ref",
        select:
          "result_announcement_date admit_card_release_date answer_key_release_date exam_date",
      },
      {
        path: "link_ref",
        select:
          "official_website get_admit_card download_sample_papers additional_resources",
      },
      { path: "common_ref", select: "-eligibility" },
      { path: "syllabus_ref", select: "syllabus" },
      { path: "admit_card_ref" },
    ],
    latest_job: [
      {
        path: "link_ref",
        select:
          "apply_online register_now official_website download_sample_papers additional_resources",
      },
      { path: "date_ref" },
      { path: "fee_ref" },
      { path: "common_ref" },
      { path: "latest_job_ref" },
    ],
    syllabus: [
      {
        path: "date_ref",
        select:
          "application_start_date application_end_date exam_date additional_resources",
      },
      { path: "link_ref", select: "official_website" },
      { path: "common_ref" },
      { path: "syllabus_ref" },
    ],
    answer_key: [
      { path: "common_ref", select: "-eligibility" },
      {
        path: "date_ref",
        select:
          "answer_key_release_date result_announcement_date counseling_start_date counseling_end_date counseling_result_announcement_date",
      },
      {
        path: "link_ref",
        select: "official_website check_answer_key get_admit_card",
      },
      { path: "syllabus_ref", select: "syllabus" },
      { path: "answer_key_ref" },
    ],
    certificate_verification: [
      {
        path: "link_ref",
        select:
          "get_admit_card check_answer_key view_results official_website additional_resources",
      },
      {
        path: "date_ref",
        select: "additional_resources certificate_verification_date",
      },
      {
        path: "common_ref",
        select: "short_information department eligibility",
      },
      { path: "certificate_verification_ref" },
    ],
    important: [
      {
        path: "common_ref",
        select: "short_information department stage_level",
      },
      { path: "date_ref", select: "additional_resources important_date" },
      { path: "link_ref", select: "official_website additional_resources" },
      { path: "important_ref" },
    ],
    admission: [
      {
        path: "common_ref",
        select: "-post_exam_duration -post_exam_toughness_ranking",
      },
      {
        path: "date_ref",
        select:
          "counseling_start_date counseling_end_date counseling_result_announcement_date additional_resources",
      },
      {
        path: "link_ref",
        select:
          "get_admit_card additional_resources view_results counseling_portal verify_certificates",
      },
      { path: "admission_ref" },
    ],
  },
  section_list_populate: {
    result: [
      { path: "link_ref", select: "view_results official_website" },
      { path: "date_ref", select: "result_announcement_date" },
      { path: "result_ref", select: "name_of_the_post" },
    ],
    admit_card: [
      { path: "date_ref", select: "admit_card_release_date exam_date" },
      {
        path: "link_ref",
        select: "official_website get_admit_card download_sample_papers",
      },
      { path: "admit_card_ref", select: "name_of_the_post" },
    ],
    latest_job: [
      {
        path: "link_ref",
        select: "apply_online register_now official_website",
      },
      {
        path: "date_ref",
        select: "application_start_date application_end_date exam_date",
      },
      { path: "latest_job_ref", select: "name_of_the_post" },
    ],
    syllabus: [
      {
        path: "date_ref",
        select: "application_start_date additional_resources",
      },
      { path: "link_ref", select: "official_website" },
      { path: "syllabus_ref", select: "name_of_the_post" },
    ],
    answer_key: [
      {
        path: "date_ref",
        select: "answer_key_release_date result_announcement_date",
      },
      {
        path: "link_ref",
        select: "official_website check_answer_key get_admit_card",
      },
      { path: "answer_key_ref", select: "name_of_the_post" },
    ],
    certificate_verification: [
      { path: "link_ref", select: "official_website additional_resources" },
      { path: "date_ref", select: "certificate_verification_date" },
      { path: "certificate_verification_ref", select: "name_of_the_post" },
    ],
    important: [
      { path: "date_ref", select: "additional_resources important_date" },
      { path: "link_ref", select: "official_website additional_resources" },
      { path: "important_ref", select: "name_of_the_post" },
    ],
    admission: [
      {
        path: "date_ref",
        select:
          "counseling_start_date counseling_end_date counseling_result_announcement_date",
      },
      { path: "link_ref", select: "view_results counseling_portal" },
      { path: "admission_ref", select: "name_of_the_post" },
    ],
  },
};

export default POST_DB;
