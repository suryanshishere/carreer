import mongoose from "mongoose";
import { IAnswerKey } from "../post-section-interface";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const answerKeySchema = new Schema<IAnswerKey>({
  createdAt: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  contributors: [{ type: ObjectId, ref: "User" }],
  post_code: { type: String, unique: true, required: true },
  name_of_the_post: { type: String, unique: true },
  answer_key_link: { type: String },
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
  syllabus: { type: ObjectId, ref: "Syllabus" },
});

const AnswerKey = mongoose.model("AnswerKey", answerKeySchema);

export default AnswerKey;
