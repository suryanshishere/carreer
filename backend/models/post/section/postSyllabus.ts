import mongoose from "mongoose";
import { ISyllabus } from "../post-section-interface";
import createCommonDataModel from "../post-common";

const { Schema } = mongoose;
const { ObjectId, Mixed } = Schema.Types;

export const syllabusSchema = new Schema<ISyllabus>({
  syllabus_data: [{ type: Mixed }],
  important_links: { type: ObjectId, ref: "PostLink" },
});

const Syllabus = createCommonDataModel("Syllabus", syllabusSchema);

export default Syllabus;
