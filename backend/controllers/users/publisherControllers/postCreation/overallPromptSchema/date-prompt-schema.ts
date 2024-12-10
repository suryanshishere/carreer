import { SchemaType } from "@google/generative-ai";

const datePromptSchema = {
  description:
    "Important dates related to the post, formatted as MongoDB ISO 8601 date strings.",
  type: SchemaType.OBJECT,
  properties: {
    application_start_date: {
      description: "MongoDB ISO 8601 date strings",
      type: SchemaType.OBJECT,
      properties: {
        current_year: { type: SchemaType.STRING },
        previous_year: { type: SchemaType.STRING },
      },
      required: ["previous_year"],
    },
    application_end_date: {
      description: "MongoDB ISO 8601 date strings",
      type: SchemaType.OBJECT,
      properties: {
        current_year: { type: SchemaType.STRING },
        previous_year: { type: SchemaType.STRING },
      },
      required: ["previous_year"],
    },
    exam_fee_payment_end_date: {
      description: "MongoDB ISO 8601 date strings",
      type: SchemaType.OBJECT,
      properties: {
        current_year: { type: SchemaType.STRING },
        previous_year: { type: SchemaType.STRING },
      },
      required: ["previous_year"],
    },
    form_correction_start_date: {
      description: "MongoDB ISO 8601 date strings",
      type: SchemaType.OBJECT,
      properties: {
        current_year: { type: SchemaType.STRING },
        previous_year: { type: SchemaType.STRING },
      },
      required: ["previous_year"],
    },
    form_correction_end_date: {
      description: "MongoDB ISO 8601 date strings",
      type: SchemaType.OBJECT,
      properties: {
        current_year: { type: SchemaType.STRING },
        previous_year: { type: SchemaType.STRING },
      },
      required: ["previous_year"],
    },
    exam_date: {
      description: "MongoDB ISO 8601 date strings",
      type: SchemaType.OBJECT,
      properties: {
        current_year: { type: SchemaType.STRING },
        previous_year: { type: SchemaType.STRING },
      },
      required: ["previous_year"],
    },
    admit_card_release_date: {
      description: "MongoDB ISO 8601 date strings",
      type: SchemaType.OBJECT,
      properties: {
        current_year: { type: SchemaType.STRING },
        previous_year: { type: SchemaType.STRING },
      },
      required: ["previous_year"],
    },
    exam_city_details_release_date: {
      description: "MongoDB ISO 8601 date strings",
      type: SchemaType.OBJECT,
      properties: {
        current_year: { type: SchemaType.STRING },
        previous_year: { type: SchemaType.STRING },
      },
      required: ["previous_year"],
    },
    answer_key_release_date: {
      description: "MongoDB ISO 8601 date strings",
      type: SchemaType.OBJECT,
      properties: {
        current_year: { type: SchemaType.STRING },
        previous_year: { type: SchemaType.STRING },
      },
      required: ["previous_year"],
    },
    result_announcement_date: {
      description: "MongoDB ISO 8601 date strings",
      type: SchemaType.OBJECT,
      properties: {
        current_year: { type: SchemaType.STRING },
        previous_year: { type: SchemaType.STRING },
      },
      required: ["previous_year"],
    },
    counseling_start_date: {
      description: "MongoDB ISO 8601 date strings",
      type: SchemaType.OBJECT,
      properties: {
        current_year: { type: SchemaType.STRING },
        previous_year: { type: SchemaType.STRING },
      },
      required: ["previous_year"],
    },
    counseling_end_date: {
      description: "MongoDB ISO 8601 date strings",
      type: SchemaType.OBJECT,
      properties: {
        current_year: { type: SchemaType.STRING },
        previous_year: { type: SchemaType.STRING },
      },
      required: ["previous_year"],
    },
    counseling_result_announcement_date: {
      description: "MongoDB ISO 8601 date strings",
      type: SchemaType.OBJECT,
      properties: {
        current_year: { type: SchemaType.STRING },
        previous_year: { type: SchemaType.STRING },
      },
      required: ["previous_year"],
    },
    additional_resources: {
      description: "Additional information related to the dates (not links)",
      type: SchemaType.STRING,
    },
  },
  required: [
    "application_start_date",
    "application_end_date",
    "exam_fee_payment_end_date",
    "form_correction_start_date",
    "form_correction_end_date",
    "exam_date",
    "admit_card_release_date",
    "exam_city_details_release_date",
    "answer_key_release_date",
    "result_announcement_date",
    "counseling_start_date",
    "counseling_end_date",
    "counseling_result_announcement_date",
    "additional_resources",
  ],
};

export default datePromptSchema;
