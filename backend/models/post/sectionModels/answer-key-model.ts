import mongoose, { ObjectId, Schema } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./section-common-data";
import { Types } from "mongoose";

const answerKeySchema = new Schema<IAnswerKeyDetail>({
  how_to_download_answer_key:{type:String},
  common: { type: Types.ObjectId, ref: "Common" },
  important_dates: { type: Types.ObjectId, ref: "Date" },
  important_links: { type: Types.ObjectId, ref: "Link" },
  syllabus: { type: Types.ObjectId, ref: "Syllabus" },
});

answerKeySchema.add(commonDataSchema);

export { answerKeySchema };

const AnswerKeyModel = mongoose.model("AnswerKey", answerKeySchema);

export default AnswerKeyModel;

export interface IAnswerKeyDetail extends ICommonDetailData {
  how_to_download_answer_key ?: string;
  common?: ObjectId;
  important_dates?: ObjectId;
  important_links?: ObjectId;
  syllabus?: ObjectId;
}
