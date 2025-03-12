import { Model, Schema } from "mongoose";
import commonDataSchema, {
  ICommonDetailData,
} from "./post-model-section-utils";
import { POST_LIMITS_DB } from "@models/posts/db";
import { model } from "mongoose";

const { long_char_limit, short_char_limit } = POST_LIMITS_DB;

const syllabusDataSchema = new Schema<ISyllabusData>(
  {
    section: {
      type: String,
      minlength: short_char_limit.min,
      maxlength: short_char_limit.max,
      required: true,
    },
    topics: {
      type: String,
      minlength: long_char_limit.min,
      maxlength: long_char_limit.max,
      required: true,
    },
  },
  { _id: false }
);

const syllabusSchema = new Schema<ISyllabus>({
  sources_and_its_step_to_download_syllabus: {
    type: String,
    minlength: long_char_limit.min,
    maxlength: long_char_limit.max,
    required: true,
  },
  syllabus: { type: [syllabusDataSchema], required: true },
});

syllabusSchema.add(commonDataSchema);
export { syllabusSchema };

const SyllabusModel: Model<ISyllabus> = model<ISyllabus>(
  "Syllabus",
  syllabusSchema
);
export default SyllabusModel;

// ---------------------------------------------

interface ISyllabusData {
  section: string;
  topics: string;
}

export interface ISyllabus extends ICommonDetailData {
  sources_and_its_step_to_download_syllabus: string;
  syllabus: ISyllabusData[];
}
