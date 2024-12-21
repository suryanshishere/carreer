export const certificateVerificationPopulate = [
  {
    path: "important_links",
    select:
      "get_admit_card check_answer_key view_results official_website additional_resources",
  },
  { path: "important_dates", select: "additional_resources" },
  { path: "common", select: "short_information department eligibility" },
];

export const certificateVerificationListPopulate = [
  {
    path: "important_links",
    select: "official_website additional_resources",
  },
  { path: "important_dates", select: "certificate_verification_date" },
];
