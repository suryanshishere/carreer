import mongoose, { Types, Schema } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./section-common-data";

const answerKeySchema = new Schema<IAnswerKeyDetail>({
  how_to_download_answer_key:{type:String},
  common: { type: Schema.Types.ObjectId, ref: "Common"},
  important_dates: { type: Schema.Types.ObjectId, ref: "Date" },
  important_links: { type: Schema.Types.ObjectId, ref: "Link"},
  syllabus: { type: Schema.Types.ObjectId, ref: "Syllabus" },
});

answerKeySchema.add(commonDataSchema);

export { answerKeySchema };

const AnswerKeyModel = mongoose.model("AnswerKey", answerKeySchema);

export default AnswerKeyModel;

export interface IAnswerKeyDetail extends ICommonDetailData {
  how_to_download_answer_key ?: string;
  common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
  syllabus?: Types.ObjectId;
}
