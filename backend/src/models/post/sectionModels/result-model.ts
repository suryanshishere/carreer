import mongoose, { Schema, Types } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./common-section-data";

//current year
const resultDataSchema = new Schema({
  general: { type: Number },
  obc: { type: Number },
  ews: { type: Number },
  sc: { type: Number },
  st: { type: Number },
  ph_dviyang: { type: Number },
});

const resultSchema = new Schema<IResult>({
  how_to_download_result: { type: String },
  result: resultDataSchema,
});

resultSchema.add(commonDataSchema);

export { resultSchema };
const ResultModel = mongoose.model("Result", resultSchema);
export default ResultModel;

export interface IResult extends ICommonDetailData {
  how_to_download_result?: string;
  result?: IResultCategory;
}

interface IResultCategory {
  general?: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  ph_dviyang?: number;
}