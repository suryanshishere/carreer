interface AgeCriteria {
  minimum_age?: number;
  maximum_age?: number;
  age_relaxation?: string;
}

interface ICategory {
  general?: AgeCriteria;
  obc?: AgeCriteria;
  ews?: AgeCriteria;
  sc?: AgeCriteria;
  st?: AgeCriteria;
  "ph_dviyang"?: AgeCriteria;
}

interface ICategoryVacany {
  general?: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  "ph_dviyang"?: number;
}

interface CategoryAgeCriteria {
  male?: ICategory;
  female?: ICategory;
  other?: ICategory;
  additional_resources?: string;
}

interface VacancyDetail {
  post_name: string;
  total_post: number;
  post_eligibility: string;
}

export interface ICommonCategoryWise {
  male?: ICategoryVacany;
  female?: ICategoryVacany;
  other?: ICategoryVacany;
  additional_resources?: string;
}

export interface ICommon {
  createdAt: string;
  updatedAt: string;
  created_by: string;
  contributors?: string[];
  short_information?: string;
  highlighted_information?: string;
  department?: string;
  stage_level?: string;
  applicants?: {
    number_of_applicants_each_year?: number;
    number_of_applicants_selected?: number;
  };
  post_importance?: string;
  post_exam_toughness_ranking?: number;
  job_type?: string;
  post_exam_duration?: number;
  age_criteria?: CategoryAgeCriteria;
  vacancy?: {
    detail?: VacancyDetail[];
    category_wise?: ICommonCategoryWise;
  };
  eligibility?: {
    minimum_qualification?: string;
    other_qualification?: string;
  };
  post_exam_mode?: "online" | "offline_paper_based" | "offline_computer_based";
  applicants_gender?: "male" | "female" | "both";
}
