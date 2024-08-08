import mongoose from "mongoose";

const { Schema } = mongoose;
const { Mixed } = Schema.Types;

export const postFeeSchema = new Schema({
  post_code: { type: String, unique: true, require: true },
  custom_fees: {
    type: Mixed,
  },
});

const PostFee = mongoose.model("PostFee", postFeeSchema);

export default PostFee;
