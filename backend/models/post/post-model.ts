import mongoose, { Schema, SchemaTypeOptions } from "mongoose";

export const sections = [
  "admission",
  "admit_card",
  "answer_key",
  "certificate_verification",
  "important",
  "latest_job",
  "result",
  "syllabus",
] as const;

const POST_CODE_MIN = Number(process.env.POST_CODE_MIN) || 6;

const sectionFields = sections.reduce((fields, section) => {
  fields[section] = {
    exist: { type: Boolean, default: false },
    approved: {
      type: Boolean,
      default: false,
      //added validation that approved can be set true only when exist is true.
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

const createdByFields = sections.reduce((fields, section) => {
  fields[section] = {
    type: Schema.Types.ObjectId,
    ref: "User", // Replace "User" with the name of your user model if different.
    required: false,
  };
  return fields;
}, {} as Record<string, { type: typeof Schema.Types.ObjectId; ref: string; required: boolean }>);

const postSchema = new Schema({
  post_code: {
    type: String,
    unique: true,
    required: true,
    minlength: [POST_CODE_MIN, "Post code must be at least 6 characters long."],
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
