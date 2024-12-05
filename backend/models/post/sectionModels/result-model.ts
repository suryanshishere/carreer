import mongoose, { ObjectId, Schema, Types } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./section-common-data";
import {
  ICommonCategoryWise,
  CategoryWiseVacancySchema,
} from "../overallModels/common-model";

const resultSchema = new Schema<IResultDetail>({
  how_to_download_result: { type: String },
  result: CategoryWiseVacancySchema,
  common: { type: Types.ObjectId, ref: "Common" },
  important_links: { type: Types.ObjectId, ref: "Link" },
});

resultSchema.add(commonDataSchema);

export { resultSchema };
const ResultModel = mongoose.model("Result", resultSchema);
export default ResultModel;


export interface IResultDetail extends ICommonDetailData {
  how_to_download_result?: string;
  result?: ICommonCategoryWise;
  common?: ObjectId;
  important_links?: Types.ObjectId;
}
