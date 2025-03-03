import { SchemaType } from "@google/generative-ai";
import { POST_LIMITS_DB } from "@models/post_models/posts_db";

const dateRangePromptSchema = {
  description: "MongoDB ISO 8601 date strings",
  type: SchemaType.OBJECT,
  properties: {
    current_year: { type: SchemaType.STRING },
    previous_year: { type: SchemaType.STRING },
  },
  required: ["previous_year"],
};

const datePromptSchema = {
  description:
    "Important dates related to the post, formatted as MongoDB ISO 8601 date strings.",
  type: SchemaType.OBJECT,
  properties: {
    application_start_date: dateRangePromptSchema,
    application_end_date: dateRangePromptSchema,
    exam_fee_payment_end_date: dateRangePromptSchema,
    form_correction_start_date: dateRangePromptSchema,
    form_correction_end_date: dateRangePromptSchema,
    exam_date: dateRangePromptSchema,
    admit_card_release_date: dateRangePromptSchema,
    exam_city_details_release_date: dateRangePromptSchema,
    answer_key_release_date: dateRangePromptSchema,
    result_announcement_date: dateRangePromptSchema,
    counseling_start_date: dateRangePromptSchema,
    counseling_end_date: dateRangePromptSchema,
    certificate_verification_date: dateRangePromptSchema,
    important_date: dateRangePromptSchema,
    counseling_result_announcement_date: dateRangePromptSchema,
    additional_resources: {
      description: `Additional information related to the dates (not links). Must be between ${POST_LIMITS_DB.short_char_limit.min} and ${POST_LIMITS_DB.short_char_limit.max} characters.`,
      type: SchemaType.STRING,
    },
  },
  required: ["additional_resources"],
};

export default datePromptSchema;
