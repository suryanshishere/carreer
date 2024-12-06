import mongoose, { Types, Schema } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./common-section-data";

const answerKeySchema = new Schema<IAnswerKeyDetail>({
  how_to_download_answer_key:{type:String},
  syllabus: { type: Schema.Types.ObjectId, ref: "Syllabus" },
});

answerKeySchema.add(commonDataSchema);

export { answerKeySchema };

const AnswerKeyModel = mongoose.model("AnswerKey", answerKeySchema);

export default AnswerKeyModel;

export interface IAnswerKeyDetail extends ICommonDetailData {
  how_to_download_answer_key ?: string;
  syllabus?: Types.ObjectId;
}
