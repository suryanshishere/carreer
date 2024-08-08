import mongoose from "mongoose";

const { Schema } = mongoose;
const { Mixed } = Schema.Types;

export const postLinkSchema = new Schema({
  post_code: { type: String, unique: true, require: true },
  official_website: { type: String },
  registration_link: { type: String },
  application_link: { type: String },
  sample_paper_download_link: { type: String },
  admit_card_download_link: { type: String },
  result_download_link: { type: String },
  answer_key_download_link: { type: String },
  counseling_application_link: { type: String },
  certificate_verification_link: { type: Mixed },
  custom_links: { type: Mixed }
});

const PostLink = mongoose.model("PostLink", postLinkSchema);

export default PostLink;
