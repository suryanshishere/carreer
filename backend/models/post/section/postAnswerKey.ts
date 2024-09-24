import mongoose from "mongoose";
import { IAnswerKey } from "../post-section-interface";
import createCommonDataModel from "../post-common";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const answerKeySchema = new Schema<IAnswerKey>({
  answer_key_link: { type: String },
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
  syllabus: { type: ObjectId, ref: "Syllabus" },
});

const AnswerKey = createCommonDataModel("AnswerKey", answerKeySchema);

export default AnswerKey;
