interface IApplicants {
  number_of_applicants_each_year: number;
  number_of_applicants_selected: number;
}

interface IAgeCriteria {
  minimum_age: number;
  maximum_age: number;
  age_relaxation: string;
}

export interface IVacancyDetail {
  post_name: string;
  total_post: number;
  post_eligibility: string;
}

interface IVacancyCategoryWise {
  general?: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  ph_dviyang?: number;
}

interface IVacancy {
  detail: IVacancyDetail[];
  category_wise: IVacancyCategoryWise;
  additional_resources: string;
}

interface IEligibility {
  minimum_qualification?: string;
  other_qualification?: string;
}

export interface ICommon {
  created_by: string;
  contributors?: string[];
  approved: boolean;
  short_information: string;
  highlighted_information: string;
  department: string;
  stage_level: string;
  applicants: IApplicants;
  post_importance: string;
  post_exam_toughness_ranking: number;
  job_type: string;
  post_exam_duration?: number;
  age_criteria: IAgeCriteria;
  vacancy: IVacancy;
  eligibility: IEligibility;
  post_exam_mode: string;
  applicants_gender_that_can_apply: string;
  createdAt?: Date;
  updatedAt?: Date;
}
