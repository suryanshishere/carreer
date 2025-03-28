import mongoose, { Schema, Document } from "mongoose";
import POST_DB, { POST_LIMITS_DB } from "./db";
import _ from "lodash";

const { short_char_limit, lowercase_alpha_num_underscrore } = POST_LIMITS_DB;

export interface IPost extends Document {
  post_code: string;
  version: string;
  dynamic_field?: Map<string, string>;
  [key: string]: any;
}

// Dynamically build overall post fields from POST_DB.overall
const overallPostFields: Record<string, any> = POST_DB.overall.reduce(
  (fields, item) => {
    fields[`${item}_approved`] = {
      type: Boolean,
      required: true,
      default: false,
    };
    fields[`${item}_created_by`] = {
      type: Schema.Types.ObjectId,
      ref: "User",
    };
    fields[`${item}_ref`] = {
      type: Schema.Types.ObjectId,
      ref: _.upperFirst(_.camelCase(item)),
    };
    fields[`${item}_contributors`] = [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: undefined,
      },
    ];
    return fields;
  },
  {} as Record<string, any>
);

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
      default: "main",
      required: true,
      minlength: short_char_limit.min,
      maxlength: short_char_limit.max,
      validate: {
        validator: function (value: string): boolean {
          return lowercase_alpha_num_underscrore.test(value);
        },
        message:
          "Version can only contain letters, numbers, and underscores, with no spaces.",
      },
    },
    dynamic_field: {
      type: Map,
      of: String,
    },
    ...overallPostFields,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create compound unique index for post_code and version
postSchema.index({ post_code: 1, version: 1 }, { unique: true });

//indexed this as well coz used commonly for searching
POST_DB.sections.forEach((item) => {
  postSchema.index({ [`${item}_approved`]: 1 });
  postSchema.index({ [`${item}_ref`]: 1 }, { sparse: true });
});

//for efficient storage
POST_DB.overall.forEach((item) => {
  postSchema.index({ [`${item}_contributors`]: 1 }, { sparse: true });
});

const PostModel = mongoose.model<IPost>("Post", postSchema);
export default PostModel;
