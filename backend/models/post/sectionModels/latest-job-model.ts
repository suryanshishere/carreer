import mongoose, { Document, Types, Schema } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./section-common-data";

interface HowToFillForm extends Document {
  registration: string;
  apply: string;
  video_link: string | null;
}

export interface ILatestJobDetail extends ICommonDetailData {
  how_to_fill_the_form?: HowToFillForm;
  common?: Types.ObjectId;
  syllabus?: Types.ObjectId;
  application_fee?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
  result_data?: Types.ObjectId;
}

const HowToFillFormSchema = new Schema<HowToFillForm>({
  registration: { type: String, required: true },
  apply: { type: String, required: true },
  video_link: { type: String, required: false },
});

const latestJobSchema = new Schema<ILatestJobDetail>({
  how_to_fill_the_form: HowToFillFormSchema,
  common: { type: Schema.Types.ObjectId, ref: "Common"},
  important_dates: { type: Schema.Types.ObjectId, ref: "Date" },
  application_fee: { type: Schema.Types.ObjectId, ref: "Fee" },
  important_links: { type: Schema.Types.ObjectId, ref: "Link"},
});

latestJobSchema.add(commonDataSchema);

export { latestJobSchema };

const LatestJobModel = mongoose.model("LatestJob", latestJobSchema);

export default LatestJobModel;
