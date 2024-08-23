import { admissionSchema } from "@models/post/section/postAdmission";
import { admitCardSchema } from "@models/post/section/postAdmitCard";
import { answerKeySchema } from "@models/post/section/postAnswerKey";
import { certificateVerificationSchema } from "@models/post/section/postCertificateVerification";
import { postCommonSchema } from "@models/post/section/postCommon";
import { postImportantSchema } from "@models/post/section/postImportant";
import { latestJobSchema } from "@models/post/section/postLatestJob";
import { resultSchema } from "@models/post/section/postResult";
import { syllabusSchema } from "@models/post/section/postSyllabus";
import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

//TODO: management of dates, link and other with dynamics.

const postAdminSchema = new Schema({
  post_code: { type: String, required: true, unique: true },
  title: { type: String, required: true }, //Just tell about the context of the post
  result: { type: resultSchema, default: {} },
  admit_card: { type: admitCardSchema, default: {} },
  latest_job: { type: latestJobSchema, default: {} },
  syllabus: { type: syllabusSchema, default: {} },
  answer_key: { type: answerKeySchema, default: {} },
  admission: { type: admissionSchema, default: {} },
  certificate_verification: {
    type: certificateVerificationSchema,
    default: {},
  },
  important: { type: postImportantSchema, default: {} },
  post_common: { type: postCommonSchema, default: {} },
});

const PostAdmin = mongoose.model("PostAdmin", postAdminSchema);

export default PostAdmin;
