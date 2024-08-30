import mongoose from "mongoose";
import { ISyllabus } from "../post-section-interface";

const { Schema } = mongoose;
const { ObjectId, Mixed } = Schema.Types;

export const syllabusSchema = new Schema<ISyllabus>({
  createdAt: { type: Date },
  contributors: [{ type: ObjectId, ref: "User" }],
  post_code: { type: String, unique: true, required: true },
  name_of_the_post: { type: String, unique: true },
  last_updated: { type: Date },
  syllabus_data: [{ type: Mixed }],
  important_links: { type: ObjectId, ref: "PostLink" },
});

const Syllabus = mongoose.model("Syllabus", syllabusSchema);

export default Syllabus;
