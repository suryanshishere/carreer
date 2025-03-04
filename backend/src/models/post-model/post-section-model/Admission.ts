import { Model, model, Schema } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./post-model-section-utils";

const admissionSchema = new Schema<IAdmission>({});

admissionSchema.add(commonDataSchema);
export { admissionSchema };

const AdmissionModel: Model<IAdmission> = model<IAdmission>(
  "Admission",
  admissionSchema
);
export default AdmissionModel;

export interface IAdmission extends ICommonDetailData {}
