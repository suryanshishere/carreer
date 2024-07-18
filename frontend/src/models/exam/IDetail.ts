export type ValueItem = string | number | Date;

export interface Eligibility {
  minimum_qualification: ValueItem[];
  other_qualification: ValueItem[];
}

export interface ImportantDates {
  application_begin: {
    current_year: string;
    previous_year: string;
  };
  application_end: {
    current_year: string;
    previous_year: string;
  };
  form_fee_last_submission_date: {
    current_year: string;
    previous_year: string;
  };
  exam_date: {
    current_year: string;
    previous_year: string;
  };
  admit_card_availability: {
    current_year: string;
    previous_year: string;
  };
}

export interface ApplicationFee {
  male: {
    current_year: number;
    previous_year: number;
  };
  female: {
    current_year: number;
    previous_year: number;
  };
  other: {
    current_year: number;
    previous_year: number;
  };
}

export interface AgeCriteria {
  minimum_age: number;
  maximum_age: number;
  age_relaxation: ValueItem[];
  other_age_limits: ValueItem[];
}

export interface ImportantLinks {
  apply_online: ValueItem[];
  download_notification: ValueItem[];
  official_website: ValueItem[];
}

export interface VacancyItem {
  post_name: string;
  total_post: number;
  post_eligibility: ValueItem[];
}

export interface RelatedDetailPage {
  short_information: ValueItem[];
  job_type: ValueItem[];
  state_and_union_territory: ValueItem[];
  department: ValueItem[];
  eligibility: (ValueItem | Eligibility)[];
  syllabus: ValueItem[];
  exam_duration: ValueItem[];
  important_dates: (ValueItem | ImportantDates)[];
  application_fee: (ValueItem | ApplicationFee)[];
  age_criteria: (ValueItem | AgeCriteria)[];
  important_links: (ValueItem | ImportantLinks)[];
  vacancy: (ValueItem | VacancyItem[])[];
}

export interface DetailPage {
  _id: string;
  created_by: string;
  created_at: string;
  last_updated: string;
  related_detail_page: RelatedDetailPage;
}
