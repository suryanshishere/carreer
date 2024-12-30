import mongoose, { Document, Types, Schema } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./common-section-data";

interface HowToFillForm extends Document {
  registration: string;
  apply: string;
  video_link: string | null;
}

export interface ILatestJob extends ICommonDetailData {
  how_to_fill_the_form?: HowToFillForm;
  syllabus?: Types.ObjectId;
  // result_data?: Types.ObjectId;
}

const HowToFillFormSchema = new Schema<HowToFillForm>({
  registration: { type: String, required: true },
  apply: { type: String, required: true },
  video_link: { type: String, required: false },
});

const latestJobSchema = new Schema<ILatestJob>({
  how_to_fill_the_form: HowToFillFormSchema,
});

latestJobSchema.add(commonDataSchema);

export { latestJobSchema };

const LatestJobModel = mongoose.model("LatestJob", latestJobSchema);

export default LatestJobModel;
