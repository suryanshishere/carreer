import mongoose, { Schema, Document } from "mongoose";
import POST_DB, { POST_LIMITS_DB } from "./post_db";
import _ from "lodash";

const { short_char_limit, lowercase_alpha_num_underscrore } = POST_LIMITS_DB;

export interface IPost extends Document {
  post_code: string;
  version: string;
  // Allow additional dynamic keys (e.g. for each section)
  [key: string]: any;
}

// Dynamically build overall post fields from POST_DB.overall
const overallPostFields = POST_DB.overall.reduce((fields, section) => {
  fields[`${section}_approved`] = {
    type: Boolean,
    default: false,
  };
  fields[`${section}_created_by`] = {
    type: Schema.Types.ObjectId,
    ref: "User",
  };
  fields[`${section}_ref`] = {
    type: Schema.Types.ObjectId,
    ref: _.upperFirst(_.camelCase(section)),
  };
  fields[`${section}_contributors`] = [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ];
  return fields;
}, {} as Record<string, any>);

const postSchema = new Schema<IPost>(
  {
    post_code: {
      type: String,
      required: true,
      minlength: short_char_limit.min,
      maxlength: short_char_limit.max,
      validate: {
        validator: function (value: string): boolean {
          return lowercase_alpha_num_underscrore.test(value);
        },
        message:
          "Post code can only contain letters, numbers, and underscores, with no spaces.",
      },
    },
    version: {
      type: String,
      default: "main", // Default version so that every document gets a version value
    },
    ...overallPostFields,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create compound unique index for post_code and version
postSchema.index({ post_code: 1, version: 1 }, { unique: true });

const PostModel = mongoose.model<IPost>("Post", postSchema);
export default PostModel;

// what if through here, i populate the other related modal all the _id created automatically while add the reference id here.
// also, every created at first be not approved so approved will be also here if not shown per section.
// also, add the typecheck here as well.
