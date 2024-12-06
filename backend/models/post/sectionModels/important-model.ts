import mongoose, { Types, Schema } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./section-common-data";

const importantSchema = new Schema<IImportantDetail>({
  how_to_fill_the_form: { type: String },
  important_links: { type: Schema.Types.ObjectId, ref: "Link"},
  common: { type: Schema.Types.ObjectId, ref: "Common"},
  important_dates: { type: Schema.Types.ObjectId, ref: "Date" },
});

importantSchema.add(commonDataSchema);

export { importantSchema };

const ImportantModel = mongoose.model("Important", importantSchema);

export default ImportantModel;

export interface IImportantDetail extends ICommonDetailData {
  how_to_fill_the_form?: string;
  important_links?: Types.ObjectId;
  common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
}
