import mongoose from "mongoose";
import { ISyllabus } from "../post-section-interface";
import commonDataSchema from "./section-common-data";

const { Schema } = mongoose;
const { ObjectId, Mixed } = Schema.Types;

const syllabusSchema = new Schema<ISyllabus>({
  syllabus_data: [{ type: Mixed }],
  important_links: { type: ObjectId, ref: "PostLink" },
});

syllabusSchema.add(commonDataSchema);

export { syllabusSchema };

const SyllabusModel = mongoose.model("Syllabus", syllabusSchema);

export default SyllabusModel;
