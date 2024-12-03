import mongoose from "mongoose";
import { IResult } from "../post-section-interface";
// import createCommonDataModel from "../post-common";
import commonDataSchema from "../overallModel/section-common";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const resultSchema = new Schema<IResult>({
  how_to_download_result: { type: String },
  result_data: [{ type: Schema.Types.Mixed }],
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_links: { type: ObjectId, ref: "PostLink" },
});

resultSchema.add(commonDataSchema);

export { resultSchema };

const ResultModel = mongoose.model("Result", resultSchema);

export default ResultModel;
