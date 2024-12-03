interface DateRange {
  current_year?: Date;
  previous_year?: Date;
}

export interface IDates {
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
