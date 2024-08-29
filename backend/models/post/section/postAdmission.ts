import mongoose from "mongoose";
import { IAdmission } from "../post-section-interface";

const { Schema,model } = mongoose;
const { ObjectId } = Schema.Types;

export const admissionSchema = new Schema<IAdmission>({
  createdAt: { type: Date },
  contributors: [{ type: ObjectId, ref: "User" }],
  name_of_the_post: { type: String, require: true },
  last_updated: { type: Date },
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
});

const Admission = model("Admission", admissionSchema);

export default Admission;
