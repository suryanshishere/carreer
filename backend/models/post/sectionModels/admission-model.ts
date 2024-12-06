import mongoose, { Types } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./common-section-data";
import { Schema } from "mongoose";

const admissionSchema = new Schema<IAdmissionDetail>({});

admissionSchema.add(commonDataSchema);

export { admissionSchema };

const AdmissionModel = mongoose.model("Admission", admissionSchema);

export default AdmissionModel;

export interface IAdmissionDetail extends ICommonDetailData {}
