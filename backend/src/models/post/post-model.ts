import mongoose, { Schema, SchemaTypeOptions } from "mongoose";
import { POST_ENV_DATA } from "@shared/env-data";

const postSectionsArray = POST_ENV_DATA.SECTIONS;

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
        message: (props) => `'approved' can only be true if 'exist' is true.`,
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

const { MIN_POST_CODE, MAX_POST_CODE, LOWERCASE_ALPHA_NUM_UNDERSCORE } = POST_ENV_DATA;

const postSchema = new Schema({
  post_code: {
    type: String,
    unique: true,
    required: true,
    minlength: [
      MIN_POST_CODE,
      `Post code must be at least ${MIN_POST_CODE} characters long.`,
    ],
    maxlength: [
      MAX_POST_CODE,
      `Post code must be at max ${MAX_POST_CODE} characters long.`,
    ],
    validate: {
      validator: function (value: string) {
        return LOWERCASE_ALPHA_NUM_UNDERSCORE.test(value);
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
