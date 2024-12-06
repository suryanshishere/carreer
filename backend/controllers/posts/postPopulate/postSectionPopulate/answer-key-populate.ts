export const answerKeyPopulate = [
    { path: "common", select: " -eligibility" },
    {
      path: "important_dates",
      select:
        "answer_key_release_date result_announcement_date counseling_start_date counseling_end_date counseling_result_announcement_date",
    },
    {
      path: "important_links",
      select:
        "official_website check_answer_key get_admit_card",
    },
    { path: "syllabus", select: "syllabus" },
  ]

  export const answerKeyListPopulate = [{
    path: "important_dates",
    select:
      "answer_key_release_date result_announcement_date",
  },
  {
    path: "important_links",
    select:
      "official_website check_answer_key get_admit_card",
  },];
