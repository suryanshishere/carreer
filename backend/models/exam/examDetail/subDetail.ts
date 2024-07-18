import mongoose from "mongoose";
import dateHandler from "../../helper/date-handler";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

// Define a validator function for valueItemSchema
function validateValueType(value: any) {
  return typeof value === "string" || typeof value === "number";
}

// Schema definition for valueItemSchema
export const valueItemSchema = new Schema(
  {
    type: { type: Schema.Types.Mixed, validate: validateValueType },
  },
  { _id: false }
);


export const eligibilitySchema = new Schema(
  {
    minimum_qualification: [valueItemSchema],
    other_qualification: [valueItemSchema],
  },
  { _id: false }
);

export const importantDatesSchema = new Schema(
  {
    application_begin: {
      current_year: {
        type: Date,
        set: dateHandler,
      },
      previous_year: {
        type: Date,
        set: dateHandler,
      },
    },
    application_end: {
      current_year: {
        type: Date,
        set: dateHandler,
      },
      previous_year: {
        type: Date,
        set: dateHandler,
      },
    },
    form_fee_last_submission_date: {
      current_year: {
        type: Date,
        set: dateHandler,
      },
      previous_year: {
        type: Date,
        set: dateHandler,
      },
    },
    exam_date: {
      current_year: {
        type: Date,
        set: dateHandler,
      },
      previous_year: {
        type: Date,
        set: dateHandler,
      },
    },
    admit_card_availability: {
      current_year: {
        type: Date,
        set: dateHandler,
      },
      previous_year: {
        type: Date,
        set: dateHandler,
      },
    },
  },
  { _id: false }
);

export const applicationFeeSchema = new Schema(
  {
    male: {
      current_year: Number,
      previous_year: Number,
    },
    female: {
      current_year: Number,
      previous_year: Number,
    },
    other: {
      current_year: Number,
      previous_year: Number,
    },
  },
  { _id: false }
);

export const ageCriteriaSchema = new Schema(
  {
    minimum_age: Number,
    maximum_age: Number,
    age_relaxation: [valueItemSchema],
    other_age_limits: [valueItemSchema],
  },
  { _id: false }
);

export const importantLinksSchema = new Schema(
  {
    apply_online: [valueItemSchema],
    download_notification: [valueItemSchema],
    official_website: [valueItemSchema],
  },
  { _id: false }
);

export const vacancyItemSchema = new Schema(
  {
    post_name: String,
    total_post: Number,
    post_eligibility: [valueItemSchema],
  },
  { _id: false }
);

export const applicantsSchema = new Schema(
    {
        number_of_applicant_each_year: Number,
        number_of_applicant_selected: Number
    },
    { _id: false }
  );

export const examImportanceSchema = new Schema(
    {
        toughness_ranking: Number,
    },
    { _id: false }
  );