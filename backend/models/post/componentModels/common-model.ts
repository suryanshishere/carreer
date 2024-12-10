import mongoose, { Schema, Types } from "mongoose";

// AgeCriteria Schema
const AgeCriteriaSchema: Schema = new Schema({
  minimum_age: { type: Number },
  maximum_age: { type: Number },
  age_relaxation: { type: String },
});

// ICategory Schema
const CategorySchema: Schema = new Schema({
  general: { type: AgeCriteriaSchema },
  obc: { type: AgeCriteriaSchema },
  ews: { type: AgeCriteriaSchema },
  sc: { type: AgeCriteriaSchema },
  st: { type: AgeCriteriaSchema },
  ph_dviyang: { type: AgeCriteriaSchema },
});

// ICategoryVacancy Schema
const CategoryVacancySchema: Schema = new Schema({
  general: { type: Number },
  obc: { type: Number },
  ews: { type: Number },
  sc: { type: Number },
  st: { type: Number },
  ph_dviyang: { type: Number },
});


// VacancyDetail Schema
const VacancyDetailSchema: Schema = new Schema({
  post_name: { type: String, required: true },
  total_post: { type: Number, required: true },
  post_eligibility: { type: String, required: true },
});

// CategoryWiseVacancy Schema
export const CategoryWiseVacancySchema: Schema = new Schema({
  male: { type: CategoryVacancySchema },
  female: { type: CategoryVacancySchema },
  other: { type: CategoryVacancySchema },
  additional_resources: { type: String },
});

// Applicants Schema
const ApplicantsSchema: Schema = new Schema({
  number_of_applicants_each_year: { type: Number },
  number_of_applicants_selected: { type: Number },
});

// ICommon Schema
export const commonSchema: Schema = new Schema<ICommon>(
  {
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contributors: [{ type: Schema.Types.ObjectId, ref: "User" }],
    approved: { type: Boolean, default: false, required: true },
    short_information: { type: String },
    highlighted_information: { type: String },
    department: { type: String },
    stage_level: { type: String },
    applicants: { type: ApplicantsSchema },
    post_importance: { type: String },
    post_exam_toughness_ranking: { type: Number },
    job_type: { type: String },
    post_exam_duration: { type: Number },
    age_criteria: { type: AgeCriteriaSchema },
    vacancy: {
      detail: { type: [VacancyDetailSchema] },
      category_wise: { type: CategoryVacancySchema },
      additional_resources: { type: String },
    },
    eligibility: {
      minimum_qualification: { type: String },
      other_qualification: { type: String },
    },
    post_exam_mode: {
      type: String,
      enum: ["online", "offline_paper_based", "offline_computer_based"],
    },
    applicants_gender_that_can_apply: {
      type: String,
      enum: ["male", "female", "other", "all"],
    },
  },
  { timestamps: true }
);

// Export the model
const CommonModel = mongoose.model("Common", commonSchema);
export default CommonModel;

// interface for the common model --------------------------------

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
  ph_dviyang?: AgeCriteria;
}

interface ICategoryVacancy {
  general?: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  ph_dviyang?: number;
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
  male?: ICategoryVacancy;
  female?: ICategoryVacancy;
  other?: ICategoryVacancy;
  additional_resources?: string;
}

interface ICommon {
  createdAt: Date;
  updatedAt: Date;
  created_by: Types.ObjectId;
  contributors?: Types.ObjectId[];
  approved: boolean;
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
    additional_resources?: string;
  };
  eligibility?: {
    minimum_qualification?: string;
    other_qualification?: string;
  };
  post_exam_mode?: "online" | "offline_paper_based" | "offline_computer_based";
  applicants_gender_that_can_apply?: "male" | "female" | "other" | "all";
}
