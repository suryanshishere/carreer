import mongoose, { Types } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./section-common-data";
import { Schema } from "mongoose";

const admissionSchema = new Schema<IAdmissionDetail>({
  common: { type: Schema.Types.ObjectId, ref: "Common"},
  important_dates: { type: Schema.Types.ObjectId, ref: "Date" },
  important_links: { type: Schema.Types.ObjectId, ref: "Link"},
});

admissionSchema.add(commonDataSchema);

export { admissionSchema };

const AdmissionModel = mongoose.model("Admission", admissionSchema);

export default AdmissionModel;

export interface IAdmissionDetail extends ICommonDetailData {
  common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
}
