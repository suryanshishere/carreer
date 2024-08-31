import mongoose from "mongoose";
import { IAdmission } from "../post-section-interface";
import { string } from "joi";

const { Schema,model } = mongoose;
const { ObjectId } = Schema.Types;

export const admissionSchema = new Schema<IAdmission>({
  createdAt: { type: Date, default: Date.now }, 
  last_updated: { type: Date, default: Date.now },
  contributors: [{ type: ObjectId, ref: "User" }],
  post_code: {type:String, unique: true, required: true},
  name_of_the_post: { type: String , unique: true},
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
});

const Admission = model("Admission", admissionSchema);

export default Admission;
