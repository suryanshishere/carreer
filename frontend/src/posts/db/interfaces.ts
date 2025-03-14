export interface ICommonListData {
  result_ref: { name_of_the_post: string };
  admission_ref: { name_of_the_post: string };
  answer_key_ref: { name_of_the_post: string };
  certificate_verification_ref: { name_of_the_post: string };
  syllabus_ref: { name_of_the_post: string };
  admit_card_ref: { name_of_the_post: string };
  important_ref: { name_of_the_post: string };
  latest_job_ref: { name_of_the_post: string };
  
  result_approved: boolean;
  admission_approved: boolean;
  answer_key_approved: boolean;
  certificate_verification_approved: boolean;
  syllabus_approved: boolean;
  admit_card_approved: boolean;
  important_approved: boolean;
  latest_job_approved: boolean;
  updatedAt: string;
  _id: string;
  is_saved: boolean;
  post_code: string;
  version: string;
  link_ref?: ILinks;
  date_ref: IDates;
}

interface AdditionalResources {
  faq: string;
  contact_us: string;
  important_dates: string;
}

export interface ILinks {
  createdAt: string;
  updatedAt: string;
  created_by: string;
  contributors?: string[];
  approved: boolean;
  official_website?: string;
  apply_online?: string;
  register_now?: string;
  download_sample_papers?: string;
  get_admit_card?: string;
  view_results?: string;
  check_answer_key?: string;
  counseling_portal?: string;
  verify_certificates?: string;
  additional_resources?: AdditionalResources;
}

export interface IDateRange {
  current_year?: string;
  previous_year: string;
}

export type IDatesOnly = Record<string, IDateRange>;

export interface IDates {
  createdAt: string;
  updatedAt: string;
  created_by: string;
  contributors?: string[];
  application_start_date?: IDateRange;
  application_end_date?: IDateRange;
  exam_fee_payment_end_date?: IDateRange;
  form_correction_start_date?: IDateRange;
  form_correction_end_date?: IDateRange;
  exam_date?: IDateRange;
  admit_card_release_date?: IDateRange;
  exam_city_details_release_date?: IDateRange;
  answer_key_release_date?: IDateRange;
  result_announcement_date?: IDateRange;
  counseling_start_date?: IDateRange;
  counseling_end_date?: IDateRange;
  counseling_result_announcement_date?: IDateRange;
  certificate_verification_date?: IDateRange;
  important_date?: IDateRange;
  additional_resources?: string;
}

export interface IContribute {
  keyProp: string;
  valueProp: string | number;
}
