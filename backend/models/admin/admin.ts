import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

interface ICodeItem {
  code: string;
  count?: boolean | number;
}

export interface ICode extends Document {
  exam_conducting_body: ICodeItem[];
  exam_code: ICodeItem[];
  state_and_union: ICodeItem[];
  job_type: ICodeItem[];
  syllabus: ICodeItem[];
  category: ICodeItem[];
  exam_mode: ICodeItem[];
  exam_level: ICodeItem[];
  eligibility__minimun_qualification: ICodeItem[];
  vacancy__gender_applicant: ICodeItem[];
}

const adminSchema = new Schema<ICode>({
  exam_conducting_body: [
    {
      code: { type: String, required: true, unique: true },
      count: { type: Boolean, default: false },
    },
  ],
  exam_code: [
    {
      code: { type: String, required: true, unique: true },
      count: { type: Boolean, default: false },
    },
  ],
  state_and_union: [
    {
      code: { type: String, required: true, unique: true },
      count: { type: Number, default: 0 },
    },
  ],
  job_type: [
    {
      code: { type: String, required: true, unique: true },
      count: { type: Number, default: 0 },
    },
  ],
  syllabus: [
    {
      code: { type: String, required: true, unique: true },
      count: { type: Number, default: 0 },
    },
  ],
  category: [
    {
      code: { type: String, required: true, unique: true },
      count: { type: Number, default: 0 },
    },
  ],
  exam_mode: [
    {
      code: { type: String, required: true, unique: true },
      count: { type: Number, default: 0 },
    },
  ],
  exam_level: [
    {
      code: { type: String, required: true, unique: true },
      count: { type: Number, default: 0 },
    },
  ],
  eligibility__minimun_qualification: [
    {
      code: { type: String, required: true, unique: true },
      count: { type: Number, default: 0 },
    },
  ],
  vacancy__gender_applicant: [
    {
      code: { type: String, required: true, unique: true },
      count: { type: Number, default: 0 },
    },
  ],
});

const Admin = mongoose.model<ICode>("Admin", adminSchema);

export default Admin;
