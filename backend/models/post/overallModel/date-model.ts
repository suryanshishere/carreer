import mongoose from "mongoose";

interface DateRange {
  current_year?: Date;
  previous_year?: Date;
}

interface IDates extends Document{
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

const { Schema } = mongoose;

const DateRangeSchema = new mongoose.Schema({
  current_year: { type: Date },
  previous_year: { type: Date },
});

export const dateSchema = new Schema<IDates>({
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
});

const DateModel = mongoose.model("Date", dateSchema);

export default DateModel;
