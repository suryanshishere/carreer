import mongoose, { Types, Schema } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./section-common-data";

const syllabusDataSchema = new Schema<ISyllabusData>({
  section: { type: String, default: "Not Available", required: true },
  topics: { type: String, default: "Not Available", required: true },
});

const syllabusSchema = new Schema<ISyllabusDetail>({
  syllabus: { type: [syllabusDataSchema] },
  important_links: { type: Schema.Types.ObjectId, ref: "Link"},
  important_dates: { type: Schema.Types.ObjectId, ref: "Date" },
  common: { type: Schema.Types.ObjectId, ref: "Common"},
});

syllabusSchema.add(commonDataSchema);

export { syllabusSchema };

const SyllabusModel = mongoose.model("Syllabus", syllabusSchema);
export default SyllabusModel;

interface ISyllabusData {
  section: string;
  topics: string;
}

export interface ISyllabusDetail extends ICommonDetailData {
  syllabus?: ISyllabusData[];
  important_links?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  common?: Types.ObjectId;
}
