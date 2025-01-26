import { POST_LIMITS_ENV_DB } from "@models/post/post-env-db";
import { Schema, Types, Document } from "mongoose";
import { ILinks } from "../componentModels/link-model";
import { IDates } from "../componentModels/date-model";
import { IFee } from "../componentModels/fee-model";
import { ICommon } from "../componentModels/common-model";

const { medium_char_limit } = POST_LIMITS_ENV_DB;

const applyDefaultId = function (this: Document) {
  return this._id;
};

const commonDataSchema = new Schema<ICommonDetailData>(
  {
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contributors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    approved: {
      type: Boolean,
      default: false,
      required: true,
    },
    name_of_the_post: {
      type: String,
      unique: true,
      required: true,
      minlength: medium_char_limit.min,
      maxlength: medium_char_limit.max,
    },
    important_links: {
      type: Schema.Types.ObjectId,
      ref: "Link",
      default: applyDefaultId,
      required: true,
    },
    important_dates: {
      type: Schema.Types.ObjectId,
      ref: "Date",
      default: applyDefaultId,
      required: true,
    },
    common: {
      type: Schema.Types.ObjectId,
      ref: "Common",
      default: applyDefaultId,
      required: true,
    },
    application_fee: {
      type: Schema.Types.ObjectId,
      ref: "Fee",
      default: applyDefaultId,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      default: applyDefaultId,
    },
  },
  { timestamps: true }
);

export default commonDataSchema;

// ---------------------------

export interface ICommonDetailData extends Document {
  createdAt: Date;
  updatedAt: Date;
  created_by: Schema.Types.ObjectId;
  contributors?: (Schema.Types.ObjectId | string)[];
  approved: boolean;
  name_of_the_post: string;
  important_links: Types.ObjectId | ILinks;
  important_dates: Types.ObjectId | IDates;
  application_fee: Types.ObjectId | IFee;
  common: Types.ObjectId | ICommon;
  post: Types.ObjectId; //TODO: additional / optional type check for the post
}
