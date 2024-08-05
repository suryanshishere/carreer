import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export interface IPostListDocument extends Document {
  approved: boolean;
  name_of_the_post: string;
  category: string;
  detail: mongoose.Types.ObjectId;
}

const postListSchema = new Schema<IPostListDocument>({
  approved: { type: Boolean, default: false, required: true },
  name_of_the_post: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  detail: { type: ObjectId, ref: "ExamDetail" },
});

const PostList = mongoose.model<IPostListDocument>("PostList", postListSchema);

export default PostList;
