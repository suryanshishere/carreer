import mongoose, { Schema } from "mongoose";

export const postRefs = [
  "Admission",
  "AdmitCard",
  "AnswerKey",
  "CertificateVerification",
  "PostImportant",
  "LatestJob",
  "Result",
  "Syllabus"
] as const;

const postSchema = new Schema({
  post_code: { type: String, unique: true, require: true },
});

const PostModal = mongoose.model("Post", postSchema);

export default PostModal;
