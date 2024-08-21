import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const admissionSchema = new Schema({  createdAt: { type: Date },
  creadedBy: { type: ObjectId, ref: "User" },
  post_code: { type: String, unique: true, require: true },
  name_of_the_post: { type: String, require: true },
  last_updated: { type: Date, require: true  },
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
});

const Admission = mongoose.model("Admission", admissionSchema);

export default Admission;
