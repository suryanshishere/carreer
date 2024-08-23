import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const answerKeySchema = new Schema({  createdAt: { type: Date },
  creadedBy: { type: ObjectId, ref: "User" },
  name_of_the_post: { type: String, require: true },
  answer_key_link: { type: String },
  last_updated: { type: Date , require: true },
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
  syllabus: { type: ObjectId, ref: "Syllabus" },
});

const AnswerKey = mongoose.model("AnswerKey", answerKeySchema);

export default AnswerKey;
