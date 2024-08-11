import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const postSchema = new Schema({
  post_code: { type: String, unique: true, require: true },
  post_common: { type: ObjectId, ref: "PostCommon" },
  result: { type: ObjectId, ref: "Result" },
  admit_card: { type: ObjectId, ref: "AdmitCard" },
  latest_job: { type: ObjectId, ref: "LatestJob" },
  syllabus: { type: ObjectId, ref: "Syllabus" },
  answer_key: { type: ObjectId, ref: "AnswerKey" },
  admission: { type: ObjectId, ref: "Syllabus" },
  certificate_verification: { type: ObjectId, ref: "CertificateVerification" },
  important: { type: ObjectId, ref: "PostImportant" },
});

const PostModal = mongoose.model("Post", postSchema);

export default PostModal;
