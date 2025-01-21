import mongoose, { Types, Schema } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./common-section-data";
import { POST_LIMITS } from "@shared/env-data";

const importantSchema = new Schema<IImportant>({
  how_to_fill_the_form: {
    type: String,
    minlength: POST_LIMITS.long_char_limit.min,
    maxlength: POST_LIMITS.long_char_limit.max,
    required: true,
  },
});

importantSchema.add(commonDataSchema);
export { importantSchema };

const ImportantModel = mongoose.model("Important", importantSchema);
export default ImportantModel;

// -------------------------------

export interface IImportant extends ICommonDetailData {
  how_to_fill_the_form: string;
}

