import mongoose, { Types, Schema } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./common-section-data";
import { POST_LIMITS_DB } from "@models/post_models/posts_db";

const { long_char_limit, short_char_limit } = POST_LIMITS_DB;

const latestJobSchema = new Schema<ILatestJob>(
  {
    how_to_fill_the_form: {
      type: new Schema(
        {
          registration: {
            type: String,
            minlength: long_char_limit.min,
            maxlength: long_char_limit.max,
            required: true,
          },
          apply: {
            type: String,
            minlength: long_char_limit.min,
            maxlength: long_char_limit.max,
            required: true,
          },
          video_link: {
            type: String,
            minlength: short_char_limit.min,
            maxlength: short_char_limit.max,
            required: false,
          },
        },
        { _id: false }
      ),
      required: true,
    },
  }
);

latestJobSchema.add(commonDataSchema);
export { latestJobSchema };

const LatestJobModel = mongoose.model("LatestJob", latestJobSchema);
export default LatestJobModel;

// -------------------------------

export interface ILatestJob extends ICommonDetailData {
  how_to_fill_the_form: {
    registration: string;
    apply: string;
    video_link?: string;
  };
  syllabus?: Types.ObjectId;
}

