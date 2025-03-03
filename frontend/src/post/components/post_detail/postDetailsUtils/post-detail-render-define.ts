export const excludedKeys = [
    "_id",
    "created_by",
    "createdAt",
    "updatedAt",
    "contributors",
    "is_saved",
    "__v",
    "post_code",
    "version",
    "admit_card_ref",
    "certificate_verification_ref",
    "result_ref",
    "answer_key_ref",
    "latest_job_ref",
    "latest_job_ref",
  ];
  
  export const notDisplayKeys = [];
  
  // "common_ref"
  export const tableRequired = [
    "age_criteria",
    "result_ref.result",
    "male",
    "female",
    "other",
    "common_ref.vacancy.category_wise",
    "link_ref",
    "date_ref",
    "eligibility",
    "applicants",
    "fee_ref.category_wise",
    "common_ref.age_criteria",
    "link_ref.additional_resources",
    "result_ref.result.current_year",
    "result_ref.result.previous_year",
  ];