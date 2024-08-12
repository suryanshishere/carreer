import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

//TODO: management of dates, link and other with dynamics.

const postAdminSchema = new Schema({
  post_code: { type: String, required: true, unique: true },
  result: { type: Boolean, default: false },
  admit_card: { type: Boolean, default: false },
  latest_job: { type: Boolean, default: false },
  syllabus: { type: Boolean, default: false },
  answer_key: { type: Boolean, default: false },
  admission: { type: Boolean, default: false },
  certificate_verification: { type: Boolean, default: false },
  important: { type: Boolean, default: false },
  post_common: { type: Boolean, default: false },
});

const PostAdmin = mongoose.model("PostAdmin", postAdminSchema);

export default PostAdmin;
