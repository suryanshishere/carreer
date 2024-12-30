import mongoose, { Types, Schema } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./common-section-data";

const importantSchema = new Schema<IImportant>({
  how_to_fill_the_form: { type: String },
});

importantSchema.add(commonDataSchema);

export { importantSchema };

const ImportantModel = mongoose.model("Important", importantSchema);

export default ImportantModel;

export interface IImportant extends ICommonDetailData {
  how_to_fill_the_form?: string;
}
