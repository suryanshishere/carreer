import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export interface IExamListDocument extends Document {
  approved: boolean;
  name_of_the_post: string;
  category: string;
  detail: mongoose.Types.ObjectId;
}

const examListSchema = new Schema<IExamListDocument>({
  approved: { type: Boolean, default: false, required: true },
  name_of_the_post: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  detail: { type: ObjectId, ref: "ExamDetail" },
});

const ExamList = mongoose.model<IExamListDocument>("ExamList", examListSchema);

export default ExamList;
