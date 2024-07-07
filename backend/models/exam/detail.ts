import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

// Define a validator function for valueItemSchema
function validateValueType(value:any) {
  return typeof value === 'string' || typeof value === 'number' || value instanceof Date;
}

// Schema definition for valueItemSchema
const valueItemSchema = new Schema({
  type: { type: Schema.Types.Mixed, validate: validateValueType }
}, { _id: false });


const eligibilitySchema = new Schema(
  {
    minimum_qualification: [valueItemSchema],
    other_qualification: [valueItemSchema],
  },
  { _id: false }
);

const importantDatesSchema = new Schema(
  {
    application_begin: {
      current_year: String,
      previous_year: String,
    },
    application_end: {
      current_year: String,
      previous_year: String,
    },
    form_fee_last_submission_date: {
      current_year: String,
      previous_year: String,
    },
    exam_date: {
      current_year: String,
      previous_year: String,
    },
    admit_card_availability: {
      current_year: String,
      previous_year: String,
    },
  },
  { _id: false }
);

const applicationFeeSchema = new Schema(
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

const ageCriteriaSchema = new Schema(
  {
    minimum_age: Number,
    maximum_age: Number,
    age_relaxation: [valueItemSchema],
    other_age_limits: [valueItemSchema],
  },
  { _id: false }
);

const importantLinksSchema = new Schema(
  {
    apply_online: [valueItemSchema],
    download_notification: [valueItemSchema],
    official_website: [valueItemSchema],
  },
  { _id: false }
);

const vacancyItemSchema = new Schema(
  {
    post_name: String,
    total_post: Number,
    post_eligibility: [valueItemSchema],
  },
  { _id: false }
);

const relatedDetailPageSchema = new Schema(
  {
    name_of_the_post: [{type: Schema.Types.Mixed}],
    last_updated: [{type: Schema.Types.Mixed}],
    short_information: [{type: Schema.Types.Mixed}],
    job_type: [{type: Schema.Types.Mixed}],
    state_and_union_territory: [{type: Schema.Types.Mixed}],
    department: [{type: Schema.Types.Mixed}],
    eligibility: [{type: Schema.Types.Mixed},
      {
        type: valueItemSchema,
        eligibilitySchema,
      },
    ],
    syllabus: [{type: Schema.Types.Mixed}],
    exam_duration: [{type: Schema.Types.Mixed},],
    important_dates: [{type: Schema.Types.Mixed},
      {
        type: valueItemSchema,
        importantDatesSchema,
      },
    ],
    application_fee: [{type: Schema.Types.Mixed},
      {
        type: valueItemSchema,
        applicationFeeSchema,
      },
    ],
    age_criteria: [{type: Schema.Types.Mixed},
      {
        type: valueItemSchema,
        ageCriteriaSchema,
      },
    ],
    important_links: [{type: Schema.Types.Mixed},
      {
        type: valueItemSchema,
        importantLinksSchema,
      },
    ],
    vacancy: [{type: Schema.Types.Mixed},
      {
        type: valueItemSchema,
        vacancyItemSchema,
      },
    ],
  },
  { _id: false }
);

const examDetailSchema = new Schema({
  author: { type: ObjectId, ref: "User" },
  related_detail_page: relatedDetailPageSchema,
});

const ExamDetail = mongoose.model("ExamDetail", examDetailSchema);

export default ExamDetail;