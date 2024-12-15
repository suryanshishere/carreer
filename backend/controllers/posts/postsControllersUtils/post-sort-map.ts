const postSortMap: Record<string, string> = {
  result: "result_announcement_date",
  latest_job: "application_start_date",
  answer_key: "answer_key_release_date",
  syllabus: "application_start_date",
  certificate_verification: "certificate_verification_date",
  admission: "counseling_start_date",
  important: "important_date",
  admit_card: "admit_card_release_date",
};

export default postSortMap;

export const dateRequiredMap: Record<string, string[]> = {
  result: [
    "result_announcement_date",
    "answer_key_release_date",
    "result_announcement_date",
    "counseling_start_date",
    "counseling_end_date",
    "counseling_result_announcement_date",
  ],
  latest_job: [
    "application_start_date",
    "application_end_date",
  ],
  answer_key: ["answer_key_release_date"],
  syllabus: ["application_start_date", "application_end_date"],
  certificate_verification: ["certificate_verification_date"],
  admission: [
    "counseling_start_date",
    "counseling_end_date",
    "counseling_result_announcement_date",
  ],
  important: ["important_date"],
  admit_card: ["admit_card_release_date", "exam_date"],
};
