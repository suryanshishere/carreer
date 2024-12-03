import { Schema, model, Document } from "mongoose";

interface AdditionalResources {
  faq: string;
  contact_us: string;
  important_dates: string;
}

interface ILinks extends Document {
  official_website: string;
  apply_online: string;
  register_now: string;
  download_sample_papers: string;
  get_admit_card: string;
  view_results: string;
  check_answer_key: string;
  counseling_portal: string;
  verify_certificates: string;
  additional_resources: AdditionalResources;
}

const AdditionalResourcesSchema = new Schema<AdditionalResources>({
  faq: { type: String },
  contact_us: { type: String },
  important_dates: { type: String },
});

export const LinksSchema = new Schema<ILinks>({
  official_website: { type: String },
  apply_online: { type: String },
  register_now: { type: String },
  download_sample_papers: { type: String },
  get_admit_card: { type: String },
  view_results: { type: String },
  check_answer_key: { type: String },
  counseling_portal: { type: String },
  verify_certificates: { type: String },
  additional_resources: { type: AdditionalResourcesSchema },
});

const PostLinkModel = model<ILinks>("Link", LinksSchema);

export default PostLinkModel;
