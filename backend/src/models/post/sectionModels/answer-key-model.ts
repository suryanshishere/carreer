import mongoose, { Types, Schema } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./common-section-data";
import { ISyllabus } from "./syllabus-model";
import { POST_LIMITS_ENV_DB } from "@models/post/post-env-db";

const answerKeySchema = new Schema<IAnswerKey>({
  how_to_download_answer_key: {
    type: String,
    minlength: POST_LIMITS_ENV_DB.long_char_limit.min,
    maxlength: POST_LIMITS_ENV_DB.long_char_limit.max,
    required: true,
  },
  syllabus: { type: Schema.Types.ObjectId, ref: "Syllabus" },
});

answerKeySchema.add(commonDataSchema);
export { answerKeySchema };
const AnswerKeyModel = mongoose.model("AnswerKey", answerKeySchema);
export default AnswerKeyModel;

// ------------------------

export interface IAnswerKey extends ICommonDetailData {
  how_to_download_answer_key: string;
  syllabus?: ISyllabus | Types.ObjectId;
}
