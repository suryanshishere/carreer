import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const detailPageSchema = new Schema({
  post_code: { type: String, unique: true, require: true },
  short_information: [{ type: String}],
  last_updated: { type: Date },
  post_common:{type:ObjectId, ref:"PostCommon"},
  result: { type: ObjectId, ref: "Result" },
  admit_card: { type: ObjectId, ref: "AdmitCard" },
  latest_job: { type: ObjectId, ref: "LatestJob" },
  syllabus: { type: ObjectId, ref: "Syllabus" },
  answer_key: { type: ObjectId, ref: "AnswerKey" },
  admission: { type: ObjectId, ref: "Syllabus" },
  certificate_verification: { type: ObjectId, ref: "CertificateVerification" },
  important: { type: ObjectId, ref: "PostImportant" },
});

const postDetailSchema = new Schema({
  author: { type: ObjectId, ref: "User" },
  detailPage: detailPageSchema,
});

const PostModal = mongoose.model("Post", postDetailSchema);

export default PostModal;
