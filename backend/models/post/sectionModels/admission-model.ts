import mongoose, { Types } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./section-common-data";
import { Schema } from "mongoose";
import { ObjectId } from "mongoose";

const admissionSchema = new Schema<IAdmissionDetail>({
  common: { type: Types.ObjectId, ref: "Common" },
  important_dates: { type: Types.ObjectId, ref: "Date" },
  important_links: { type: Types.ObjectId, ref: "Link" },
});

admissionSchema.add(commonDataSchema);

export { admissionSchema };

const AdmissionModel = mongoose.model("Admission", admissionSchema);

export default AdmissionModel;

export interface IAdmissionDetail extends ICommonDetailData {
  common?: ObjectId;
  important_dates?: ObjectId;
  important_links?: ObjectId;
}
