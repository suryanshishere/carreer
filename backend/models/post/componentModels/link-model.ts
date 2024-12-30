import { Schema, model, Document, Types } from "mongoose";

interface AdditionalResources extends Document {
  faq?: string;
  contact_us?: string;
  // important_dates?: string;
}

export interface ILinks extends Document {
  createdAt: Date;
  updatedAt: Date;
  created_by: Types.ObjectId;
  contributors?: Types.ObjectId[];
  approved: boolean;
  official_website?: string;
  apply_online?: string;
  register_now?: string;
  download_sample_papers?: string;
  get_admit_card?: string;
  view_results?: string;
  check_answer_key?: string;
  counseling_portal?: string;
  verify_certificates?: string;
  additional_resources?: AdditionalResources;
}

const AdditionalResourcesSchema = new Schema<AdditionalResources>({
  faq: { type: String },
  contact_us: { type: String },
  // important_dates: { type: String },
});

export const LinksSchema = new Schema<ILinks>(
  {
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contributors: [{ type: Schema.Types.ObjectId, ref: "User" }],
    approved: { type: Boolean, default: false, required: true },
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
  },
  { timestamps: true }
);

const LinkModel = model<ILinks>("Link", LinksSchema);

export default LinkModel;
