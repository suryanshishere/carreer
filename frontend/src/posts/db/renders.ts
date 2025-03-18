export const excludedKeys: Record<string, boolean> = {
  _id: true,
  created_by: true,
  createdAt: true,
  // updatedAt: true,
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



export const tableRequired: Record<string, boolean> = {
  age_criteria: true,
  "result_ref.result": true,
  male: true,
  female: true,
  other: true,
  "common_ref.vacancy.category_wise": true,
  link_ref: true,
  date_ref: true,
  eligibility: true,
  applicants: true,
  "fee_ref.category_wise": true,
  "common_ref.age_criteria": true,
  "link_ref.additional_resources": true,
  "result_ref.result.current_year": true,
  "result_ref.result.previous_year": true,
};

//content which you want to be expandable but at first collapse to make it interactive and clutter free.
export const collapsible: { [key: string]: boolean } = {
  "result_ref.result.previous_year": true,
};

export const renamingData: {
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
  post_exam_toughness_ranking: "ranked",
  post_exam_duration: "minutes",
  minimum_age: "year old",
  maximum_age: "year old",
};
