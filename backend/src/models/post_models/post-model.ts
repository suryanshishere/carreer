import mongoose, { Schema, Document } from "mongoose";
import POST_DB, { POST_LIMITS_DB } from "./post_db";
import _ from "lodash";

const { short_char_limit, lowercase_alpha_num_underscrore } = POST_LIMITS_DB;

interface IPost extends Document {
  post_code: string;
  [key: string]: any;
}

// Create the dynamic section fields using reduce.
const overallPostFields = POST_DB.overall.reduce((fields, section) => {
  fields[`${section}_approved`] = {
    type: Boolean,
    default: false,
    required: true,
  };
  fields[`${section}_created_by`] = {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  };
  fields[`${section}_ref`] = {
    type: Schema.Types.ObjectId,
    ref: _.upperFirst(_.camelCase(section)),
    required: true,
  };
  return fields;
}, {} as Record<string, any>);


const postSchema = new Schema<IPost>({
  post_code: {
    type: String,
    unique: true,
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
  ...overallPostFields,
});

const PostModel = mongoose.model<IPost>("Post", postSchema);
export default PostModel;

// what if through here, i populate the other related modal all the _id created automatically while add the reference id here.
// also, every created at first be not approved so approved will be also here if not shown per section.
// also, add the typecheck here as well.
