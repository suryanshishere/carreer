import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema({
  post_code: { type: String, unique: true, require: true },
});

const PostModal = mongoose.model("Post", postSchema);

export default PostModal;
