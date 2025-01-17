import mongoose, { Types, Schema, Document } from "mongoose";

interface DateRange {
  current_year?: Date;
  previous_year: Date;
}

export interface IDates extends Document {
  createdAt: Date;
  updatedAt: Date;
  created_by: Types.ObjectId;
  contributors?: Types.ObjectId[];
  approved: boolean;
  application_start_date?: DateRange;
  application_end_date?: DateRange;
  exam_fee_payment_end_date?: DateRange;
  form_correction_start_date?: DateRange;
  form_correction_end_date?: DateRange;
  exam_date?: DateRange;
  admit_card_release_date?: DateRange;
  exam_city_details_release_date?: DateRange;
  answer_key_release_date?: DateRange;
  result_announcement_date?: DateRange;
  counseling_start_date?: DateRange;
  counseling_end_date?: DateRange;
  counseling_result_announcement_date?: DateRange;
  additional_resources?: string;
}

const DateRangeSchema = new mongoose.Schema({
  current_year: { type: Date },
  previous_year: { type: Date, required: true },
});

export const dateSchema = new Schema<IDates>(
  {
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contributors: [{ type: Schema.Types.ObjectId, ref: "User" }],
    approved: { type: Boolean, default: false, required: true },
    application_start_date: { type: DateRangeSchema },
    application_end_date: { type: DateRangeSchema },
    exam_fee_payment_end_date: { type: DateRangeSchema },
    form_correction_start_date: { type: DateRangeSchema },
    form_correction_end_date: { type: DateRangeSchema },
    exam_date: { type: DateRangeSchema },
    admit_card_release_date: { type: DateRangeSchema },
    exam_city_details_release_date: { type: DateRangeSchema },
    answer_key_release_date: { type: DateRangeSchema },
    result_announcement_date: { type: DateRangeSchema },
    counseling_start_date: { type: DateRangeSchema },
    counseling_end_date: { type: DateRangeSchema },
    counseling_result_announcement_date: { type: DateRangeSchema },
    additional_resources: { type: String },
  },
  { timestamps: true }
);

const DateModel = mongoose.model("Date", dateSchema);

export default DateModel;
