import mongoose,{Types, ObjectId} from "mongoose";
import commonDataSchema, { ICommonData } from "./section-common-data";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const postImportantSchema = new Schema<IImportant>({
  how_to_fill_the_form: { type: String },
  important_links: { type: Types.ObjectId, ref: "Link" },
  common: { type: Types.ObjectId, ref: "Common" },
  important_dates: { type: Types.ObjectId, ref: "Date" },
});

postImportantSchema.add(commonDataSchema);

export {postImportantSchema}

const ImportantModel = mongoose.model("Important", postImportantSchema);

export default ImportantModel;


export interface IImportant extends ICommonData {
  how_to_fill_the_form?: string;
  important_links?: ObjectId;
  common?: ObjectId;
  important_dates?: ObjectId;
}
