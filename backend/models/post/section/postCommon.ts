import mongoose from "mongoose";
import { IPostCommon } from "../post-section-interface";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const postCommonSchema = new Schema<IPostCommon>({
  createdAt: { type: Date, default: Date.now },
  contributors: [{ type: ObjectId, ref: "User" }],
  post_code: { type: String, unique: true, required: true },
  name_of_the_post: { type: String, unique: true },
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
    default: "both",
  },
});

const PostCommon = mongoose.model("PostCommon", postCommonSchema);

export default PostCommon;
