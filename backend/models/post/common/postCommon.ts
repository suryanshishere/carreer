import mongoose, { Schema, Types } from "mongoose";
import { IPostCommon } from "../post-section-interface";
import commonDataSchema from "./post-common";

const { ObjectId } = Schema.Types;

const postCommonSchema = new Schema<IPostCommon>({
  short_information: { type: String },
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
  post_exam_mode: {
    type: String,
    enum: ["online", "offline_paper_based", "offline_computer_based"],
  },
  applicants_gender: {
    type: String,
    enum: ["male", "female", "both"],
  },
});

// Add the common data schema
postCommonSchema.add(commonDataSchema);
export { postCommonSchema };

// Export the model
const PostCommon = mongoose.model("PostCommon", postCommonSchema);
export default PostCommon;
