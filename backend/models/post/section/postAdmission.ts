import mongoose from "mongoose";
import { IAdmission } from "../post-section-interface";
import createCommonDataModel from "../post-common";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const admissionSchema = new Schema<IAdmission>({
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
});

const Admission = createCommonDataModel("Admission", admissionSchema);

export default Admission;
