import mongoose from "mongoose";
import {
  eligibilitySchema,
  valueItemSchema,
  importantDatesSchema,
  importantLinksSchema,
  ageCriteriaSchema,
  applicationFeeSchema,
  vacancyItemSchema,
  examImportanceSchema,
  applicantsSchema
} from "./subDetail";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const relatedDetailPageSchema = new Schema(
  {
    name_of_the_post: [{ type: Schema.Types.Mixed }],
    last_updated: [{ type: Schema.Types.Mixed }],
    short_information: [{ type: Schema.Types.Mixed }],
    job_type: [{ type: Schema.Types.Mixed }],
    state_and_union_territory: [{ type: Schema.Types.Mixed }],
    department: [{ type: Schema.Types.Mixed }],
    eligibility: [
      { type: Schema.Types.Mixed },
      {
        type: valueItemSchema,
        eligibilitySchema,
      },
    ],
    syllabus: [{ type: Schema.Types.Mixed }],
    exam_duration: [{ type: Schema.Types.Mixed }],
    important_dates: [
      { type: Schema.Types.Mixed },
      {
        type: valueItemSchema,
        importantDatesSchema,
      },
    ],
    application_fee: [
      { type: Schema.Types.Mixed },
      {
        type: valueItemSchema,
        applicationFeeSchema,
      },
    ],
    age_criteria: [
      { type: Schema.Types.Mixed },
      {
        type: valueItemSchema,
        ageCriteriaSchema,
      },
    ],
    important_links: [
      { type: Schema.Types.Mixed },
      {
        type: valueItemSchema,
        importantLinksSchema,
      },
    ],
    vacancy: [
      { type: Schema.Types.Mixed },
      {
        type: valueItemSchema,
        vacancyItemSchema,
      },
    ],
    applicants: [
      { type: Schema.Types.Mixed },
      {
        type: valueItemSchema,
        applicantsSchema,
      },
    ],
    exam_importance: [
      { type: Schema.Types.Mixed },
      {
        type: valueItemSchema,
        examImportanceSchema,
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
