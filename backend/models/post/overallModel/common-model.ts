import mongoose, { Schema } from "mongoose";
import commonDataSchema, { ICommonData } from "./section-common";

// AgeCriteria Schema
const AgeCriteriaSchema: Schema = new Schema({
  minimum_age: { type: Number, required: false },
  maximum_age: { type: Number, required: false },
  age_relaxation: { type: String, required: false },
});

// ICategory Schema
const ICategorySchema: Schema = new Schema({
  general: { type: AgeCriteriaSchema, required: false },
  obc: { type: AgeCriteriaSchema, required: false },
  ews: { type: AgeCriteriaSchema, required: false },
  sc: { type: AgeCriteriaSchema, required: false },
  st: { type: AgeCriteriaSchema, required: false },
  "ph_(dviyang)": { type: AgeCriteriaSchema, required: false },
});

// ICategoryVacancy Schema
const ICategoryVacancySchema: Schema = new Schema({
  general: { type: Number, required: false },
  obc: { type: Number, required: false },
  ews: { type: Number, required: false },
  sc: { type: Number, required: false },
  st: { type: Number, required: false },
  "ph_(dviyang)": { type: Number, required: false },
});

// CategoryAgeCriteria Schema
const CategoryAgeCriteriaSchema: Schema = new Schema({
  male: { type: ICategorySchema, required: false },
  female: { type: ICategorySchema, required: false },
  other: { type: ICategorySchema, required: false },
  additional_resources: { type: String, required: false },
});

// VacancyDetail Schema
const VacancyDetailSchema: Schema = new Schema({
  post_name: { type: String, required: true },
  total_post: { type: Number, required: true },
  post_eligibility: { type: String, required: true },
});

// CategoryWiseVacancy Schema
const CategoryWiseVacancySchema: Schema = new Schema({
  male: { type: ICategoryVacancySchema, required: false },
  female: { type: ICategoryVacancySchema, required: false },
  other: { type: ICategoryVacancySchema, required: false },
  additional_resources: { type: String, required: false },
});

// Applicants Schema
const ApplicantsSchema: Schema = new Schema({
  number_of_applicants_each_year: { type: Number, required: false },
  number_of_applicants_selected: { type: Number, required: false },
});

// ICommon Schema
const commonSchema: Schema = new Schema<ICommon>({
  short_information: { type: String, required: false },
  highlighted_information: { type: String, required: false },
  department: { type: String, required: false },
  stage_level: { type: String, required: false },
  applicants: { type: ApplicantsSchema, required: false },
  post_importance: { type: String, required: false },
  post_exam_toughness_ranking: { type: Number, required: false },
  job_type: { type: String, required: false },
  post_exam_duration: { type: Number, required: false },
  age_criteria: { type: CategoryAgeCriteriaSchema, required: false },
  vacancy: {
    detail: { type: [VacancyDetailSchema], required: false },
    category_wise: { type: CategoryWiseVacancySchema, required: false },
  },
  eligibility: {
    minimum_qualification: { type: String, required: false },
    other_qualification: { type: String, required: false },
  },
  post_exam_mode: {
    type: String,
    enum: ["online", "offline_paper_based", "offline_computer_based"],
    required: false,
  },
  applicants_gender: {
    type: String,
    enum: ["male", "female", "both"],
    required: false,
  },
});

// Add the common data schema
commonSchema.add(commonDataSchema);
export { commonSchema };

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
  "ph_(dviyang)"?: AgeCriteria;
}

interface ICategoryVacany {
  general?: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  "ph_(dviyang)"?: number;
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

interface CategoryWiseVacancy {
  male?: ICategoryVacany;
  female?: ICategoryVacany;
  other?: ICategoryVacany;
  additional_resources?: string;
}

interface ICommon extends ICommonData {
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
    category_wise?: CategoryWiseVacancy;
  };
  eligibility?: {
    minimum_qualification?: string;
    other_qualification?: string;
  };
  post_exam_mode?: "online" | "offline_paper_based" | "offline_computer_based";
  applicants_gender?: "male" | "female" | "both";
}
