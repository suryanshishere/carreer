import { Types, Schema, Model } from "mongoose";
import commonDataSchema, {
  ICommonDetailData,
} from "./common-section-data";
import { POST_LIMITS_DB } from "@models/posts/db";
import { ISyllabus } from "./Syllabus";
import { model } from "mongoose";

const admitCardSchema = new Schema<IAdmitCard>({
  how_to_download_admit_card: {
    type: String,
    minlength: POST_LIMITS_DB.long_char_limit.min,
    maxlength: POST_LIMITS_DB.long_char_limit.max,
    required: true,
  },
  syllabus: { type: Schema.Types.ObjectId, ref: "Syllabus" },
});

admitCardSchema.add(commonDataSchema);
export { admitCardSchema };
const AdmitCardModel: Model<IAdmitCard> = model<IAdmitCard>(
  "AdmitCard",
  admitCardSchema
);
export default AdmitCardModel;

// ------------------------

export interface IAdmitCard extends ICommonDetailData {
  how_to_download_admit_card: string;
  syllabus?: ISyllabus | Types.ObjectId;
}
