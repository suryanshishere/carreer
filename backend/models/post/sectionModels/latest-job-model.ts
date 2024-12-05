import mongoose, { Document, ObjectId } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./section-common-data";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

interface HowToFillForm extends Document {
  registration: string;
  apply: string;
  video_link: string | null;
}

export interface ILatestJobDetail extends ICommonDetailData {
  how_to_fill_the_form?: HowToFillForm;
  common?: ObjectId;
  syllabus?: ObjectId;
  application_fee?: ObjectId;
  important_dates?: ObjectId;
  important_links?: ObjectId;
  result_data?: ObjectId;
}

const HowToFillFormSchema = new Schema<HowToFillForm>({
  registration: { type: String, required: true },
  apply: { type: String, required: true },
  video_link: { type: String, required: false },
});

const latestJobSchema = new Schema<ILatestJobDetail>({
  how_to_fill_the_form: HowToFillFormSchema,
  common: { type: ObjectId, ref: "Common" },
  important_dates: { type: ObjectId, ref: "Date" },
  application_fee: { type: ObjectId, ref: "Fee" },
  important_links: { type: ObjectId, ref: "Link" },
});

latestJobSchema.add(commonDataSchema);

export { latestJobSchema };

const LatestJobModel = mongoose.model("LatestJob", latestJobSchema);

export default LatestJobModel;
