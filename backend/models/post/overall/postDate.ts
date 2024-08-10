import mongoose from "mongoose";

const { Schema } = mongoose;
const { Mixed } = Schema.Types;

export const postDateSchema = new Schema({
  post_code: { type: String, unique: true, require: true },
  application_start_date: {
    current_year: { type: Date },
    previous_year: { type: Date },
  },
  application_deadline: {
    current_year: { type: Date },
    previous_year: { type: Date },
  },
  exam_fee_payment_deadline: {
    current_year: { type: Date },
    previous_year: { type: Date },
  },
  form_correction_start_date: {
    current_year: { type: Date },
    previous_year: { type: Date },
  },
  form_correction_end_date: {
    current_year: { type: Date },
    previous_year: { type: Date },
  },
  exam_date: {
    current_year: { type: Date },
    previous_year: { type: Date },
  },
  admit_card_release_date: {
    current_year: { type: Date },
    previous_year: { type: Date },
  },
  exam_city_details_release_date: {
    current_year: { type: Date },
    previous_year: { type: Date },
  },
  answer_key_release_date: {
    current_year: { type: Date },
    previous_year: { type: Date },
  },
  result_release_date: {
    current_year: { type: Date },
    previous_year: { type: Date },
  },
  counseling_start_date: {
    current_year: { type: Date },
    previous_year: { type: Date },
  },
  counseling_deadline: {
    current_year: { type: Date },
    previous_year: { type: Date },
  },
  counseling_result_release_date: {
    current_year: { type: Date },
    previous_year: { type: Date },
  },
  custom_dates: { type: Mixed },
});

const PostDate = mongoose.model("PostDate", postDateSchema);

export default PostDate;
