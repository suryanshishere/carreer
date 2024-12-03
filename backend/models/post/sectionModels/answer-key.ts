import mongoose from "mongoose";
import { IAnswerKey } from "../post-section-interface";
import commonDataSchema from "./section-common-data";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const answerKeySchema = new Schema<IAnswerKey>({
  answer_key_link: { type: String },
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
  syllabus: { type: ObjectId, ref: "Syllabus" },
});

answerKeySchema.add(commonDataSchema);

export { answerKeySchema };

const AnswerKeyModel = mongoose.model("AnswerKey", answerKeySchema);

export default AnswerKeyModel;
