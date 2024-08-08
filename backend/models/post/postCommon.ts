import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const postCommonSchema = new Schema({
  post_code: { type: String, unique: true, require: true },
  department: { type: String },
  stage_level: { type: String },
  applicants: {
    number_of_applicants_each_year: { type: Number },
    number_of_applicants_selected: { type: Number },
  },
  post_importance: { type: String },
  post_exam_toughness_ranking: { type: Number },
  job_type: { type: String },
  post_exam_duration: { type: Number },
  age_criteria: {
    minimum_age: { type: Number },
    maximum_age: { type: Number },
    age_relaxation: { type: String },
    other_age_limits: { type: String },
  },
  vacancy: [
    {
      post_name: { type: String },
      total_post: { type: Number },
      post_eligibility: { type: String },
    },
  ],
  eligibility: {
    minimum_qualification: { type: String },
    other_qualification: { type: String },
  },
});

const PostCommon = mongoose.model("PostCommon", postCommonSchema);

export default PostCommon;
