import mongoose, { Document } from "mongoose";
import { ILatestJob } from "../post-section-interface";
import commonDataSchema from "../overallModel/section-common";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

interface HowToFillForm extends Document {
  registration: string;
  apply: string;
  video_link: string | null;
}

const HowToFillFormSchema = new Schema<HowToFillForm>({
  registration: { type: String, required: true },
  apply: { type: String, required: true },
  video_link: { type: String, required: false },
});

const latestJobSchema = new Schema<ILatestJob>({
  how_to_fill_the_form: HowToFillFormSchema,
  post_common: { type: ObjectId, ref: "Common" },
  important_dates: { type: ObjectId, ref: "Date" },
  application_fee: { type: ObjectId, ref: "Fee" },
  important_links: { type: ObjectId, ref: "Link" },
});

latestJobSchema.add(commonDataSchema);

export { latestJobSchema };

const LatestJobModel = mongoose.model("LatestJob", latestJobSchema);

export default LatestJobModel;
