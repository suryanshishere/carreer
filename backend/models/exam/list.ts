import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export interface IExamListDocument extends Document {
  approved: boolean;
  exam_code: string;
  title: string;
  title_detail: string;
  category: string;
  created_by: mongoose.Types.ObjectId;
  created_at: Date;
  last_updated: Date;
  detail: mongoose.Types.ObjectId;
  saved_users: mongoose.Types.ObjectId[];
}

const examListSchema = new Schema<IExamListDocument>({
  approved: { type: Boolean, default: false, required: true },
  exam_code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  title_detail:{type:String},
  category: { type: String, required: true },
  created_by: { type: ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  detail: { type: ObjectId, ref: "ExamDetail" },
  saved_users: [{ type: ObjectId, ref: "User" }],
});

const ExamList = mongoose.model<IExamListDocument>("ExamList", examListSchema);

export default ExamList;
