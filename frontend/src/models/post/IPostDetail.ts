interface YearlyDate {
  current_year?: string; // ISO date string for the current year
  previous_year?: string; // ISO date string for the previous year
}

interface IImportantDates {
  _id?: string; // MongoDB ObjectId as a string
  post_code?: string;
  application_start_date?: YearlyDate;
  application_deadline?: YearlyDate;
  exam_fee_payment_deadline?: YearlyDate;
  form_correction_start_date?: YearlyDate;
  form_correction_end_date?: YearlyDate;
  exam_date?: YearlyDate;
  admit_card_release_date?: YearlyDate;
  exam_city_details_release_date?: YearlyDate;
  answer_key_release_date?: YearlyDate;
  result_release_date?: YearlyDate;
  counseling_start_date?: YearlyDate;
  counseling_deadline?: YearlyDate;
  counseling_result_release_date?: YearlyDate;
  custom_dates?: {
    additional_information?: string;
  };
}

interface ICustomLinks {
  faq?: string;
  contact_us?: string;
  important_dates?: string;
}

interface IImportantLinks {
  _id?: string;
  post_code?: string;
  official_website?: string;
  registration?: string;
  apply?: string;
  sample_paper_download?: string;
  admit_card_download?: string;
  result_download?: string;
  answer_key_download?: string;
  councelling_apply?: string;
  certificate_verify?: string;
  custom_links?: ICustomLinks | any;
}

interface ISyllabusTopic {
  section?: string;
  topics?: string[];
}

interface Cutoff {
  category?: string;
  cutoff?: number; // Represents the cutoff value as a number
}

interface AgeCriteria {
  minimum_age?: number;
  maximum_age?: number;
  age_relaxation?: string;
  other_age_limits?: string;
}

interface Vacancy {
  post_name?: string;
  total_post?: number;
  post_eligibility?: string;
}

interface Eligibility {
  minimum_qualification?: string;
  other_qualification?: string;
}

export interface IPostCommon {
  post_code?: string;
  department?: string;
  stage_level?: string;
  applicants?: {
    number_of_applicants_each_year?: number;
    number_of_applicants_selected?: number;
  };
  post_importance?: string;
  post_exam_toughness_ranking?: number;
  job_type?: string;
  post_exam_duration?: number; // Duration in minutes
  age_criteria?: AgeCriteria;
  vacancy?: Vacancy[];
  eligibility?: Eligibility;
}

interface IExamFee {
  exam_fee?: number;
}

interface ICustomFees {
  general_category?: IExamFee;
  sc_st_category?: IExamFee;
  additional_information?: string;
}

interface IApplicationFee {
  _id?: string;
  post_code?: string;
  custom_fees?: ICustomFees;
}

interface ISyllabusData {
  section?: string;
  topics?: string[];
}

interface ISyllabus {
  _id?: string;
  post_code?: string;
  name_of_the_post?: string;
  last_updated?: string;
  syllabus_data?: ISyllabusData[];
  important_links?: {
    $oid?: string;
  };
}

export interface IPostDetail {
  _id?: string;
  contributors?: string[];
  post_code?: string;
  name_of_the_post?: string;
  last_updated?: string;
  syllabus_data?: ISyllabusTopic[] | any;
  important_links?: IImportantLinks;
  how_to_download_result?: string[];
  result_data?: Cutoff[];
  post_common?: IPostCommon;
  how_to_do_registration?: string[];
  how_to_apply?: string[];
  syllabus?: ISyllabus;
  application_fee?: IApplicationFee;
  important_dates?: IImportantDates;
  how_to_download_admit_card?: string[];
  how_to_fill_the_form?: string[];
}
