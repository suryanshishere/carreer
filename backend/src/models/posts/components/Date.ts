import { Document, Schema, model, Model } from "mongoose";
import { POST_LIMITS_DB, TAG_DATE_MAP } from "../db";

const uniqueFields = new Set(Object.values(TAG_DATE_MAP).flat());

const DateRangeSchema = new Schema<IDateRange>(
  {
    current_year: { type: Date },
    previous_year: { type: Date, required: true },
    current_mmdd: { type: String },
    current_year_val: { type: Number },
    previous_mmdd: { type: String },
    previous_year_val: { type: Number },
  },
  { _id: false }
);

const dateObject = { type: DateRangeSchema, required: false };

export const dateSchema = new Schema<IDates>(
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

// Pre-save hook to compute month-day and year values for only the fields in TAG_DATE_MAP
dateSchema.pre("save", function (next) {
  const doc = this as any;

  const computeFields = (dateRange: any) => {
    if (!dateRange) return;
    if (dateRange.current_year) {
      const d = new Date(dateRange.current_year);
      dateRange.current_mmdd =
        ("0" + (d.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + d.getDate()).slice(-2);
      dateRange.current_year_val = d.getFullYear();
    }
    if (dateRange.previous_year) {
      const d = new Date(dateRange.previous_year);
      dateRange.previous_mmdd =
        ("0" + (d.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + d.getDate()).slice(-2);
      dateRange.previous_year_val = d.getFullYear();
    }
  };

  // this solve a problem to uphold to store the computed values for tags only (not all fields)
  uniqueFields.forEach((field) => {
    if (doc[field]) {
      computeFields(doc[field]);
    }
  });

  next();
});

// Loop through the unique fields to add indexes for computed fields
uniqueFields.forEach((field) => {
  // Index for the primary field (computed current_year values)
  dateSchema.index(
    { [`${field}.current_mmdd`]: 1, [`${field}.current_year_val`]: 1 },
    { name: `idx_${field}_current` }
  );
  // Index for the fallback field (computed previous_year values)
  dateSchema.index(
    { [`${field}.previous_mmdd`]: 1, [`${field}.previous_year_val`]: 1 },
    { name: `idx_${field}_previous` }
  );
});

const DateModel: Model<IDates> = model<IDates>("Date", dateSchema);
export default DateModel;

// ------------------------

export interface IDateRange {
  current_year?: Date;
  previous_year: Date;
  // computed fields
  current_mmdd?: string;
  current_year_val?: number;
  previous_mmdd?: string;
  previous_year_val?: number;
}

export interface IDates extends Document {
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
