import { Types, Schema, model, Model } from "mongoose";
import commonDataSchema, {
  ICommonDetailData,
} from "./post-model-section-utils";
import { ISyllabus } from "./Syllabus";
import { POST_LIMITS_DB } from "@models/post-model/db";

const answerKeySchema = new Schema<IAnswerKey>({
  how_to_download_answer_key: {
    type: String,
    minlength: POST_LIMITS_DB.long_char_limit.min,
    maxlength: POST_LIMITS_DB.long_char_limit.max,
    required: true,
  },
  syllabus: { type: Schema.Types.ObjectId, ref: "Syllabus" },
});

answerKeySchema.add(commonDataSchema);
export { answerKeySchema };
const AnswerKeyModel: Model<IAnswerKey> = model<IAnswerKey>(
  "AnswerKey",
  answerKeySchema
);
export default AnswerKeyModel;

// ------------------------

export interface IAnswerKey extends ICommonDetailData {
  how_to_download_answer_key: string;
  syllabus?: ISyllabus | Types.ObjectId;
}
