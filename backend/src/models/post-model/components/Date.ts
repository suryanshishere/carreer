import { Document, Schema, model, Model } from "mongoose";
import { POST_LIMITS_DB } from "../db";

const DateRangeSchema = new Schema<IDateRange>(
  {
    current_year: { type: Date },
    previous_year: { type: Date, required: true },
  },
  { _id: false }
);

const dateObject = { type: DateRangeSchema, required: false };

export const dateSchema = new Schema<IDate>(
  {
    application_start_date: dateObject,
    application_end_date: dateObject,
    exam_fee_payment_end_date: dateObject,
    form_correction_start_date: dateObject,
    form_correction_end_date: dateObject,
    exam_date: dateObject,
    admit_card_release_date: dateObject,
    exam_city_details_release_date: dateObject,
    answer_key_release_date: dateObject,
    result_announcement_date: dateObject,
    counseling_start_date: dateObject,
    counseling_end_date: dateObject,
    important_date: dateObject,
    counseling_result_announcement_date: dateObject,
    certificate_verification_date: dateObject,
    additional_resources: {
      type: String,
      required: true,
      minlength: POST_LIMITS_DB.short_char_limit.min,
      maxlength: POST_LIMITS_DB.short_char_limit.max,
    },
  },
  { timestamps: true }
);

const DateModel: Model<IDate> = model<IDate>("Date", dateSchema);
export default DateModel;

// ------------------------

interface IDateRange {
  current_year?: Date;
  previous_year: Date;
}

export interface IDate extends Document {
  application_start_date?: IDateRange;
  application_end_date?: IDateRange;
  exam_fee_payment_end_date?: IDateRange;
  form_correction_start_date?: IDateRange;
  form_correction_end_date?: IDateRange;
  exam_date?: IDateRange;
  admit_card_release_date?: IDateRange;
  exam_city_details_release_date?: IDateRange;
  answer_key_release_date?: IDateRange;
  result_announcement_date?: IDateRange;
  counseling_start_date?: IDateRange;
  important_date?: IDateRange;
  certificate_verification_date?: IDateRange;
  counseling_end_date?: IDateRange;
  counseling_result_announcement_date?: IDateRange;
  additional_resources?: string;
}
