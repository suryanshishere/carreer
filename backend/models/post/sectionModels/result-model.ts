import mongoose, { ObjectId, Schema, Types } from "mongoose";
import commonDataSchema, { ICommonData } from "./section-common-data";
import {
  ICategoryWiseVacancy,
  CategoryWiseVacancySchema,
} from "../overallModels/common-model";

const resultSchema = new Schema<IResult>({
  how_to_download_result: { type: String },
  result: CategoryWiseVacancySchema,
  common: { type: Types.ObjectId, ref: "Common" },
  important_links: { type: Types.ObjectId, ref: "Link" },
});

resultSchema.add(commonDataSchema);

export { resultSchema };
const ResultModel = mongoose.model("Result", resultSchema);
export default ResultModel;


export interface IResult extends ICommonData {
  how_to_download_result?: string;
  result?: ICategoryWiseVacancy;
  common?: ObjectId;
  important_links?: Types.ObjectId;
}
