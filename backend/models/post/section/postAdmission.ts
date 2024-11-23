import mongoose from "mongoose";
import { IAdmission } from "../post-section-interface";
import commonDataSchema from "../common/post-common";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const admissionSchema = new Schema<IAdmission>({
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
});

admissionSchema.add(commonDataSchema);

export { admissionSchema };

const Admission = mongoose.model("Admission", admissionSchema);

export default Admission;
