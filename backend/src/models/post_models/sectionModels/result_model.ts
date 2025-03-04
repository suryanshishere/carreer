import { Model, Schema, model } from "mongoose";
import commonDataSchema, {
  ICommonDetailData,
} from "./common_section_data_model";
import { POST_LIMITS_DB } from "@models/post_models/post_db";

const { non_negative_num, short_char_limit, long_char_limit } = POST_LIMITS_DB;

// Current year
const resultCategorySchema = new Schema<IResultCategory>(
  {
    general: {
      type: Number,
      min: non_negative_num.min,
      max: non_negative_num.max,
      required: true,
    },
    obc: {
      type: Number,
      min: non_negative_num.min,
      max: non_negative_num.max,
      required: false,
    },
    ews: {
      type: Number,
      min: non_negative_num.min,
      max: non_negative_num.max,
      required: false,
    },
    sc: {
      type: Number,
      min: non_negative_num.min,
      max: non_negative_num.max,
      required: false,
    },
    st: {
      type: Number,
      min: non_negative_num.min,
      max: non_negative_num.max,
      required: false,
    },
    ph_dviyang: {
      type: Number,
      min: non_negative_num.min,
      max: non_negative_num.max,
      required: false,
    },
    //contains total marks, normalization
    additional_resources: {
      type: String,
      minlength: short_char_limit.min,
      maxlength: short_char_limit.max,
      required: true,
    },
  },
  { _id: false }
);

const resultSchema = new Schema<IResult>({
  how_to_download_result: {
    type: String,
    minlength: long_char_limit.min,
    maxlength: long_char_limit.max,
    required: true,
  },
  result: {
    type: new Schema(
      {
        current_year: { type: resultCategorySchema, required: false },
        previous_year: { type: resultCategorySchema, required: true },
      },
      { _id: false }
    ),
    required: true,
  },
});

resultSchema.add(commonDataSchema);
export { resultSchema };

const ResultModel: Model<IResult> = model<IResult>("Result", resultSchema);
export default ResultModel;

// -------------------------------

export interface IResult extends ICommonDetailData {
  how_to_download_result: string;
  result: {
    current_year?: IResultCategory;
    previous_year: IResultCategory;
  };
}

interface IResultCategory {
  general: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  ph_dviyang?: number;
  additional_resources: string;
}
