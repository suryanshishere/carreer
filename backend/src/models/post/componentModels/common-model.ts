import mongoose, { Document, Schema, Types } from "mongoose";
import { POST_LIMITS_DB } from "../post-env-db";

const {
  short_char_limit,
  rank_minute_num,
  age_num,
  non_negative_num,
  long_char_limit,
} = POST_LIMITS_DB;

const {
  job_type,
  stage_level,
  post_exam_mode,
  applicants_gender_that_can_apply,
} = POST_LIMITS_DB.dropdown_data;

const ApplicantsSchema: Schema = new Schema<IApplicants>(
  {
    number_of_applicants_each_year: {
      type: Number,
      required: true,
      min: non_negative_num.min,
      max: non_negative_num.max,
    },
    number_of_applicants_selected: {
      type: Number,
      required: true,
      min: non_negative_num.min,
      max: non_negative_num.max,
    },
  },
  { _id: false }
);

const ageCriteriaSchema: Schema = new Schema<IAgeCriteria>(
  {
    minimum_age: {
      type: Number,
      require: true,
      min: age_num.min,
      max: age_num.max,
    },
    maximum_age: {
      type: Number,
      require: true,
      min: age_num.min,
      max: age_num.max,
    },
    age_relaxation: {
      type: String,
      require: true,
      minlength: short_char_limit.min,
      maxlength: short_char_limit.max,
    },
  },
  { _id: false }
);

const vacancySchema: Schema = new Schema<IVacancy>(
  {
    detail: [
      {
        post_name: {
          type: String,
          required: true,
          minlength: short_char_limit.min,
          maxlength: short_char_limit.max,
        },
        total_post: {
          type: Number,
          required: true,
          min: non_negative_num.min,
          max: non_negative_num.max,
        },
        post_eligibility: {
          type: String,
          required: true,
          minlength: short_char_limit.min,
          maxlength: short_char_limit.max,
        },
      },
    ],
    category_wise: {
      general: {
        type: Number,
        min: non_negative_num.min,
        max: non_negative_num.max,
      },
      obc: {
        type: Number,
        min: non_negative_num.min,
        max: non_negative_num.max,
      },
      ews: {
        type: Number,
        min: non_negative_num.min,
        max: non_negative_num.max,
      },
      sc: {
        type: Number,
        min: non_negative_num.min,
        max: non_negative_num.max,
      },
      st: {
        type: Number,
        min: non_negative_num.min,
        max: non_negative_num.max,
      },
      ph_dviyang: {
        type: Number,
        min: non_negative_num.min,
        max: non_negative_num.max,
      },
    },
    additional_resources: {
      type: String,
      required: true,
      minlength: short_char_limit.min,
      maxlength: short_char_limit.max,
    },
  },
  { _id: false }
);

export const commonSchema: Schema = new Schema<ICommon>(
  {
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contributors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    approved: {
      type: Boolean,
      default: false,
      required: true,
    },
    short_information: {
      type: String,
      minlength: long_char_limit.min,
      maxlength: long_char_limit.max,
      required: true,
    },
    highlighted_information: {
      type: String,
      minlength: long_char_limit.min,
      maxlength: long_char_limit.max,
      required: true,
    },
    department: {
      type: String,
      minlength: short_char_limit.min,
      maxlength: short_char_limit.max,
      required: true,
    },
    stage_level: {
      type: String,
      enum: stage_level,
      required: true,
      default: "national",
    },
    applicants: {
      type: ApplicantsSchema,
      required: true,
    },
    post_importance: {
      type: String,
      minlength: long_char_limit.min,
      maxlength: long_char_limit.max,
      required: true,
    },
    post_exam_toughness_ranking: {
      type: Number,
      required: true,
      min: rank_minute_num.min,
      max: rank_minute_num.max,
    },
    job_type: {
      type: String,
      enum: job_type,
      required: true,
      default: "permanent",
    },
    post_exam_duration: {
      type: Number,
      required: false,
      min: rank_minute_num.min,
      max: rank_minute_num.max,
    },
    age_criteria: {
      type: ageCriteriaSchema,
      required: true,
    },
    vacancy: {
      type: vacancySchema,
      required: true,
    },
    eligibility: {
      type: new Schema(
        {
          minimum_qualification: {
            type: String,
            minlength: short_char_limit.min,
            maxlength: short_char_limit.max,
            required: true,
          },
          other_qualification: {
            type: String,
            minlength: short_char_limit.min,
            maxlength: short_char_limit.max,
          },
        },
        { _id: false }
      ),
      required: true,
    },
    post_exam_mode: {
      type: String,
      enum: post_exam_mode,
      required: true,
      default: "offline_computer_based",
    },
    applicants_gender_that_can_apply: {
      type: String,
      enum: applicants_gender_that_can_apply,
      required: true,
      default: "all",
    },
  },
  { timestamps: true }
);

const CommonModel = mongoose.model("Common", commonSchema);
export default CommonModel;

// -------------------------------------------

interface IApplicants {
  number_of_applicants_each_year: number;
  number_of_applicants_selected: number;
}

interface IAgeCriteria {
  minimum_age: number;
  maximum_age: number;
  age_relaxation: string;
}

interface IVacancyDetail {
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

export interface ICommon extends Document {
  created_by: Types.ObjectId;
  contributors?: Types.ObjectId[];
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
