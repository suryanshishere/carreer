import mongoose, { Schema, SchemaTypeOptions } from "mongoose";
<<<<<<< HEAD
<<<<<<< HEAD:backend/models/post/post-model.ts
import { postSectionsArray } from "@shared/post-array";
import { POST_ENV_DATA } from "@shared/env-data";

=======
import { POST_ENV_DATA } from "@shared/env-data";
=======
import { POST_DATA, POST_LIMITS } from "@shared/env-data";
>>>>>>> user

const postSectionsArray = POST_DATA.SECTIONS;
const { short_char_limit, lowercase_alpha_num_underscrore } = POST_LIMITS;

>>>>>>> user:backend/src/models/post/post-model.ts
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

<<<<<<< HEAD
<<<<<<< HEAD:backend/models/post/post-model.ts
const { MIN_POST_CODE, MAX_POST_CODE, ALPHA_NUM_UNDERSCRORE } = POST_ENV_DATA;
=======
const { MIN_POST_CODE, MAX_POST_CODE, LOWERCASE_ALPHA_NUM_UNDERSCORE } = POST_ENV_DATA;
>>>>>>> user:backend/src/models/post/post-model.ts

=======
>>>>>>> user
const postSchema = new Schema({
  post_code: {
    type: String,
    unique: true,
    required: true,
    minlength: short_char_limit.min,
    maxlength: short_char_limit.max,
    validate: {
      validator: function (value: string) {
<<<<<<< HEAD
<<<<<<< HEAD:backend/models/post/post-model.ts
        return ALPHA_NUM_UNDERSCRORE.test(value);
=======
        return LOWERCASE_ALPHA_NUM_UNDERSCORE.test(value);
>>>>>>> user:backend/src/models/post/post-model.ts
=======
        return lowercase_alpha_num_underscrore.test(value);
>>>>>>> user
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
