import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const admitCardSchema = new Schema({
  post_code: { type: String, unique: true, require: true },
  name_of_the_post: { type: String, require: true },
  last_updated: { type: Date, require: true  },
  how_to_download_admit_card: [{ type: String }],
  syllabus: { type: ObjectId, ref: "Syllabus" },
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
  result_data: { type: ObjectId, ref: "Result" },
});

const AdmitCard = mongoose.model("AdmitCard", admitCardSchema);

export default AdmitCard;
