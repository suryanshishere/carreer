import { POST_LIMITS_DB } from "@models/post-model/post-db";
import { Schema, Document } from "mongoose";

const { medium_char_limit } = POST_LIMITS_DB;

const commonDataSchema = new Schema<ICommonDetailData>(
  {
    name_of_the_post: {
      type: String,
      unique: true,
      required: true,
      minlength: medium_char_limit.min,
      maxlength: medium_char_limit.max,
    },
  },
  { timestamps: true }
);

export default commonDataSchema;

// ---------------------------

export interface ICommonDetailData extends Document {
  name_of_the_post: string;
}
