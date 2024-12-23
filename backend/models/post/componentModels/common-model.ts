import { COMMON_COMPONENT_POST_CHAR_LIMITS } from "@shared/env-data";
import mongoose, { Schema, Types } from "mongoose";

const ageCriteriaSchema: Schema = new Schema({
  minimum_age: { type: Number },
  maximum_age: { type: Number },
  age_relaxation: { type: String },
});

const categoryVacancySchema: Schema = new Schema({
  general: { type: Number },
  obc: { type: Number },
  ews: { type: Number },
  sc: { type: Number },
  st: { type: Number },
  ph_dviyang: { type: Number },
});

const VacancyDetailSchema: Schema = new Schema({
  post_name: { type: String, required: true },
  total_post: { type: Number, required: true },
  post_eligibility: { type: String, required: true },
});

const ApplicantsSchema: Schema = new Schema({
  number_of_applicants_each_year: { type: Number },
  number_of_applicants_selected: { type: Number },
});

const { short_information, highlighted_information, department, stage_level } =
  COMMON_COMPONENT_POST_CHAR_LIMITS;

export const commonSchema: Schema = new Schema<ICommon>(
  {
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contributors: [{ type: Schema.Types.ObjectId, ref: "User" }],
    approved: { type: Boolean, default: false, required: true },
    short_information: {
      type: String,
      minlength: short_information.min,
      maxlength: short_information.max,
    },
    highlighted_information: {
      type: String,
      minlength: highlighted_information.min,
      maxlength: highlighted_information.max,
    },
    department: {
      type: String,
      minlength: department.min,
      maxlength: department.max,
    },
    stage_level: {
      type: String,
      minlength: stage_level.min,
      maxlength: stage_level.max,
    },
    applicants: ApplicantsSchema,
    post_importance: { type: String },
    post_exam_toughness_ranking: { type: Number },
    job_type: { type: String },
    post_exam_duration: { type: Number },
    age_criteria: ageCriteriaSchema,
    vacancy: {
      detail: [VacancyDetailSchema],
      category_wise: categoryVacancySchema,
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

interface IAgeCriteria {
  minimum_age?: number;
  maximum_age?: number;
  age_relaxation?: string;
}

// interface ICategory {
//   general?: AgeCriteria;
//   obc?: AgeCriteria;
//   ews?: AgeCriteria;
//   sc?: AgeCriteria;
//   st?: AgeCriteria;
//   ph_dviyang?: AgeCriteria;
// }

interface ICategoryVacancy {
  general?: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  ph_dviyang?: number;
}

// interface CategoryAgeCriteria {
//   male?: ICategory;
//   female?: ICategory;
//   other?: ICategory;
//   additional_resources?: string;
// }

interface VacancyDetail {
  post_name: string;
  total_post: number;
  post_eligibility: string;
}

// export interface ICommonCategoryWise {
//   male?: ICategoryVacancy;
//   female?: ICategoryVacancy;
//   other?: ICategoryVacancy;
//   additional_resources?: string;
// }

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
  age_criteria?: IAgeCriteria;
  vacancy?: {
    detail?: VacancyDetail[];
    category_wise?: ICategoryVacancy;
    additional_resources?: string;
  };
  eligibility?: {
    minimum_qualification?: string;
    other_qualification?: string;
  };
  post_exam_mode?: "online" | "offline_paper_based" | "offline_computer_based";
  applicants_gender_that_can_apply?: "male" | "female" | "other" | "all";
}
