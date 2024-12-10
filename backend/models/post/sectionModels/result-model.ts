import mongoose, { Schema, Types } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./common-section-data";
import {
  ICommonCategoryWise,
  CategoryWiseVacancySchema,
} from "../componentModels/common-model";

const resultSchema = new Schema<IResultDetail>({
  how_to_download_result: { type: String },
  result: CategoryWiseVacancySchema
});

resultSchema.add(commonDataSchema);

export { resultSchema };
const ResultModel = mongoose.model("Result", resultSchema);
export default ResultModel;

export interface IResultDetail extends ICommonDetailData {
  how_to_download_result?: string;
  result?: ICommonCategoryWise;
  common?: Types.ObjectId;
  important_links?: Types.ObjectId;
  important_dates?: Types.ObjectId;
}
