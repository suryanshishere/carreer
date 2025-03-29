import { ISectionKey } from ".";

export const excludedKeys: Record<string, boolean> = {
  _id: true,
  created_by: true,
  createdAt: true,
  updatedAt: true,
  contributors: true,
  is_saved: true,
  __v: true,
  post_code: true,
  version: true,
  admit_card_ref: true,
  result_ref: true,
  certificate_verification_ref: true,
  admission_ref: true,
  latest_job_ref: true,
  answer_key_ref: true,
  syllabus_ref: true,
  important_ref: true,
  admit_card_approved: true,
  result_approved: true,
  certificate_verification_approved: true,
  admission_approved: true,
  latest_job_approved: true,
  answer_key_approved: true,
  syllabus_approved: true,
  important_approved: true,
  name_of_the_post: true,
  approved: true,
  tag: true,
};

export const TABLE_REQUIRED: Record<string, boolean> = {
  age_criteria: true,
  "result_ref.result": true,
  male: true,
  female: true,
  other: true,
  "common_ref.vacancy.category_wise": true,
  "common_ref.vacancy.detail[0]": true,
  link_ref: true,
  date_ref: true,
  eligibility: true,
  applicants: true,
  "fee_ref.category_wise": true,
  "common_ref.age_criteria": true,
  "link_ref.additional_resources": true,
  "result_ref.result.current_year": true,
  "result_ref.result.previous_year": true,
  "syllabus_ref.syllabus": true,
};

//content which you want to be expandable but at first collapse to make it interactive and clutter free.
export const collapsible: { [key: string]: boolean } = {
  "result_ref.result.previous_year": true,
};

export const RENAMING_DATA: {
  [key: string]: string | { [key: string]: string };
} = {
  date_ref: "Important Dates",
  link_ref: "Important Links",
  common_ref: "Common Information",
  fee_ref: "Application Fees",
  stage_level: {
    national:
      "National Level - Open to participants across the entire country, fostering large-scale competition.",
    state:
      "State Level - Limited to a particular state, ensuring more localized participation.",
    district:
      "District Level - Open only within a specific district, often for more focused recruitment.",
    regional:
      "Regional Level - Covers multiple districts but stays within a specific geographic region.",
    local:
      "Local Level - Restricted to a city, town, or specific locality for niche opportunities.",
    international:
      "International Level - Open globally, inviting competition beyond national borders.",
  },
  applicants_gender_that_can_apply: {
    male: "Male - This position is open exclusively for male applicants.",
    female: "Female - Only female candidates are eligible for this post.",
    other:
      "Other - Open to applicants identifying as non-binary or other genders.",
    all: "All - Inclusive opportunity for everyone, regardless of gender.",
  },
  post_exam_mode: {
    online:
      "Online - The exam will be conducted over the internet, accessible remotely.",
    offline_paper_based:
      "Offline (Paper-Based) - Candidates must attend a physical test center to take a written paper exam.",
    offline_computer_based:
      "Offline (Computer-Based) - Conducted at a designated center where candidates take the test on computers.",
  },
  job_type: {
    permanent:
      "Permanent - A full-time job with long-term employment benefits and stability.",
    temporary:
      "Temporary - Short-term employment for a fixed duration, often project-based.",
    contractual:
      "Contractual - Fixed-period employment based on a contractual agreement.",
    part_time: "Part-Time - Work with reduced hours, offering flexibility.",
    internship:
      "Internship - Learning-based job experience for students or freshers, usually for a limited period.",
  },
  "common_ref.post_exam_toughness_ranking": "ranked",
  "common_ref.post_exam_duration": "minutes",
  "common_ref.age_criteria.minimum_age": "year old",
  "common_ref.age_criteria.maximum_age": "year old",
  "fee_ref.male": "Rs/-",
  "fee_ref.female": "Rs/-",
  "fee_ref.other": "Rs/-",
  "fee_ref.category_wise.general": "Rs/-",
  "fee_ref.category_wise.obc": "Rs/-",
  "fee_ref.category_wise.ews": "Rs/-",
  "fee_ref.category_wise.sc": "Rs/-",
  "fee_ref.category_wise.st": "Rs/-",
  "fee_ref.category_wise.ph_dviyang": "Rs/-",
  "common_ref.vacancy.category_wise.general": "vacancies",
  "common_ref.vacancy.category_wise.obc": "vacancies",
  "common_ref.vacancy.category_wise.sc": "vacancies",
  "common_ref.vacancy.category_wise.st": "vacancies",
  "common_ref.vacancy.category_wise.ph_dviyang": "vacancies",
  "common_ref.vacancy.category_wise.ews": "vacancies",
};

export const QUICK_ACCESS_RENDER: Record<
  ISectionKey,
  null | Record<string, boolean>
> = {
  result: { "result_ref.result": true, "common_ref.applicants": true },
  admit_card: { "common_ref.job_type": true, "common_ref.applicants": true },
  certificate_verification: null,
  admission: null,
  latest_job: { "common_ref.eligibility": true, fee_ref: true },
  answer_key: {
    "common_ref.post_exam_mode": true,
    "common_ref.applicants": true,
  },
  syllabus: { "syllabus_ref.syllabus": true, "common_ref.applicants": true },
  important: null,
};

export const NON_REQUIRED_FIELD: Record<string, boolean> = {
  "latest_job_ref.how_to_fill_the_form.video_link": true,
  "result_ref.result.current_year": true,
  "common_ref.vacancy.category_wise.general": true,
  "common_ref.vacancy.category_wise.obc": true,
  "common_ref.vacancy.category_wise.ews": true,
  "common_ref.vacancy.category_wise.sc": true,
  "common_ref.vacancy.category_wise.st": true,
  "common_ref.vacancy.category_wise.ph_dviyang": true,
  "common_ref.post_exam_duration": true,
  "common_ref.eligibility.other_qualification": true,
  "date_ref.exam_fee_payment_end_date": true,
  "date_ref.form_correction_start_date": true,
  "date_ref.form_correction_end_date": true,
  "date_ref.exam_date": true,
  "date_ref.exam_city_details_release_date": true,
  "date_ref.counseling_result_announcement_date": true,
  "fee_ref.male": true,
  "fee_ref.female": true,
  "fee_ref.category_wise.general": true,
  "fee_ref.category_wise.obc": true,
  "fee_ref.category_wise.ews": true,
  "fee_ref.category_wise.sc": true,
  "fee_ref.category_wise.st": true,
  "fee_ref.category_wise.ph_dviyang": true,
  "link_ref.apply_online":true,
  "link_ref.register_now":true,
  "link_ref.download_sample_papers":true,
  "link_ref.admit_card":true,
  "link_ref.view_results":true,
  "link_ref.check_answer_key":true,
  "link_ref.conseling_portal":true,
  "link_ref.verify_certificates":true,
};
