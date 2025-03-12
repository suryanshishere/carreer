import { Schema, model, Document, Model } from "mongoose";
import { POST_LIMITS_DB } from "../db";

const { short_char_limit } = POST_LIMITS_DB;

const linkObject = {
  type: String,
  required: false,
  minlength: short_char_limit.min,
  maxlength: short_char_limit.max,
};

const AdditionalResourcesSchema = new Schema<IAdditionalResources>(
  {
    faq: { ...linkObject, required: true },
    contact_us: linkObject,
  },
  { _id: false }
);

export const LinksSchema = new Schema<ILink>(
  {
    official_website: { ...linkObject, required: true },
    apply_online: linkObject,
    register_now: linkObject,
    download_sample_papers: linkObject,
    get_admit_card: linkObject,
    view_results: linkObject,
    check_answer_key: linkObject,
    counseling_portal: linkObject,
    verify_certificates: linkObject,
    additional_resources: { type: AdditionalResourcesSchema, required: true },
  },
  { timestamps: true }
);

const LinkModel: Model<ILink> = model<ILink>("Link", LinksSchema);
export default LinkModel;

// ------------------------------

interface IAdditionalResources {
  faq: string;
  contact_us?: string;
}

export interface ILink extends Document {
  official_website: string;
  additional_resources: IAdditionalResources;
  apply_online?: string;
  register_now?: string;
  download_sample_papers?: string;
  get_admit_card?: string;
  view_results?: string;
  check_answer_key?: string;
  counseling_portal?: string;
  verify_certificates?: string;
}
