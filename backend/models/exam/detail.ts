import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export type ValueItem = (string | number | { table: TableItem })[];

export interface TableItem {
  column?: (string | number)[]; 
  row: ({ key: string; value: ValueItem } | (string | number)[])[]
}

export interface ObjectItem{
  key: string;
  value: ValueItem;
}

const relatedDetailPage = new Schema({
  key: { type: String, required: true },
  value: [{ type: Schema.Types.Mixed }],
});

const examDetailSchema = new Schema({
  author: { type: ObjectId, ref: "User" },
  related_detail_page: [relatedDetailPage],
});

const ExamDetail = mongoose.model("ExamDetail", examDetailSchema);

export default ExamDetail;
