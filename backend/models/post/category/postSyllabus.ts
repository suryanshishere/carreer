import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId,Mixed } = Schema.Types;

export const syllabusSchema = new Schema({
  post_code: { type: String, unique: true, require: true },
  name_of_the_post: { type: String, require: true },
  last_updated: { type: Date, require: true  },
  syllabus_data: [{ type: Mixed }],
  important_links: { type: ObjectId, ref: "PostLink" },
});

const Syllabus = mongoose.model("Syllabus", syllabusSchema);

export default Syllabus;
