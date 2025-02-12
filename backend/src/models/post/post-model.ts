import mongoose, { Schema, SchemaTypeOptions } from "mongoose";
import POST_DB, { POST_LIMITS_DB } from "./post-env-db";

const postSectionsArray = POST_DB.sections;
const { short_char_limit, lowercase_alpha_num_underscrore } = POST_LIMITS_DB;

const sectionFields = postSectionsArray.reduce((fields, section) => {
  fields[section] = {
    exist: { type: Boolean, default: false },
    approved: {
      type: Boolean,
      default: false,
      validate: {
        validator: function (
          this: { exist: boolean; approved: boolean },
          value: boolean
        ) {
          return !value || this.exist;
        },
        message: () => `'approved' can only be true if 'exist' is true.`,
      },
    } as SchemaTypeOptions<boolean>,
  };
  return fields;
}, {} as Record<string, { exist: { type: BooleanConstructor; default: boolean }; approved: SchemaTypeOptions<boolean> }>);

const createdByFields = postSectionsArray.reduce((fields, section) => {
  fields[section] = {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  };
  return fields;
}, {} as Record<string, { type: typeof Schema.Types.ObjectId; ref: string; required: boolean }>);

const postSchema = new Schema({
  post_code: {
    type: String,
    unique: true,
    required: true,
    minlength: short_char_limit.min,
    maxlength: short_char_limit.max,
    validate: {
      validator: function (value: string) {
        return lowercase_alpha_num_underscrore.test(value);
      },
      message:
        "Post code can only contain letters, numbers, and underscores, with no spaces.",
    },
  },
  sections: {
    type: new Schema(sectionFields, { _id: false }),
  },
  created_by: {
    type: new Schema(createdByFields, { _id: false }),
  },
});

const PostModel = mongoose.model("Post", postSchema);

export default PostModel;
