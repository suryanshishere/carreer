import mongoose, { Types, Schema } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./common-section-data";

const syllabusDataSchema = new Schema<ISyllabusData>({
  section: { type: String, default: "Not Available", required: true },
  topics: { type: String, default: "Not Available", required: true },
});

const syllabusSchema = new Schema<ISyllabusDetail>({
  syllabus: { type: [syllabusDataSchema] },

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

}
