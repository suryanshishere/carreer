import mongoose from "mongoose";

const { Schema } = mongoose;
const { Mixed } = Schema.Types;

export const postFeeSchema = new Schema({
  custom_fees: {
    type: Mixed,
  },
});

const PostFee = mongoose.model("PostFee", postFeeSchema);

export default PostFee;
