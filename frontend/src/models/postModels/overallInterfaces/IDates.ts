export interface IDateRange {
  current_year?: Date;
  previous_year: Date;
}

export interface IDates {
  createdAt: string;
  updatedAt: string;
  created_by: string;
  contributors?: string[];
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
  counseling_end_date?: IDateRange;
  counseling_result_announcement_date?: IDateRange;
  additional_resources?: string;
}
