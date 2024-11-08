import mongoose from "mongoose";
import { IPostImportant } from "../post-section-interface";
import commonDataSchema from "../post-common";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const postImportantSchema = new Schema<IPostImportant>({
  how_to_fill_the_form: { type: String },
  important_links: { type: ObjectId, ref: "PostLink" },
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
});

postImportantSchema.add(commonDataSchema);

export {postImportantSchema}

const PostImportant = mongoose.model("PostImportant", postImportantSchema);

export default PostImportant;
