import { SchemaType } from "@google/generative-ai";

const datePromptSchema = {
  description:
    "Schema representing important dates related to an exam for both current and previous years.",
  type: SchemaType.OBJECT,
  properties: {
    application_start_date: {
      type: SchemaType.OBJECT,
      description: "Application start date for current and previous years.",
      properties: {
        current_year: {
          type: SchemaType.STRING,
          description: "Application start date for the current year.",
        },
        previous_year: {
          type: SchemaType.STRING,
          description: "Application start date for the previous year.",
        },
      },
      required: ["current_year", "previous_year"],
    },
    application_end_date: {
      type: SchemaType.OBJECT,
      description: "Application end date for current and previous years.",
      properties: {
        current_year: {
          type: SchemaType.STRING,
          description: "Application end date for the current year.",
        },
        previous_year: {
          type: SchemaType.STRING,
          description: "Application end date for the previous year.",
        },
      },
      required: ["current_year", "previous_year"],
    },
    exam_fee_payment_end_date: {
      type: SchemaType.OBJECT,
      description: "Exam fee payment end date for current and previous years.",
      properties: {
        current_year: {
          type: SchemaType.STRING,
          description: "Exam fee payment end date for the current year.",
        },
        previous_year: {
          type: SchemaType.STRING,
          description: "Exam fee payment end date for the previous year.",
        },
      },
      required: ["current_year", "previous_year"],
    },
    form_correction_start_date: {
      type: SchemaType.OBJECT,
      description: "Form correction start date for current and previous years.",
      properties: {
        current_year: {
          type: SchemaType.STRING,
          description: "Form correction start date for the current year.",
        },
        previous_year: {
          type: SchemaType.STRING,
          description: "Form correction start date for the previous year.",
        },
      },
      required: ["current_year", "previous_year"],
    },
    form_correction_end_date: {
      type: SchemaType.OBJECT,
      description: "Form correction end date for current and previous years.",
      properties: {
        current_year: {
          type: SchemaType.STRING,
          description: "Form correction end date for the current year.",
        },
        previous_year: {
          type: SchemaType.STRING,
          description: "Form correction end date for the previous year.",
        },
      },
      required: ["current_year", "previous_year"],
    },
    exam_date: {
      type: SchemaType.OBJECT,
      description: "Exam date for current and previous years.",
      properties: {
        current_year: {
          type: SchemaType.STRING,
          description: "Exam date for the current year.",
        },
        previous_year: {
          type: SchemaType.STRING,
          description: "Exam date for the previous year.",
        },
      },
      required: ["current_year", "previous_year"],
    },
    admit_card_release_date: {
      type: SchemaType.OBJECT,
      description: "Admit card release date for current and previous years.",
      properties: {
        current_year: {
          type: SchemaType.STRING,
          description: "Admit card release date for the current year.",
        },
        previous_year: {
          type: SchemaType.STRING,
          description: "Admit card release date for the previous year.",
        },
      },
      required: ["current_year", "previous_year"],
    },
    exam_city_details_release_date: {
      type: SchemaType.OBJECT,
      description: "Exam city details release date for current and previous years.",
      properties: {
        current_year: {
          type: SchemaType.STRING,
          description: "Exam city details release date for the current year.",
        },
        previous_year: {
          type: SchemaType.STRING,
          description: "Exam city details release date for the previous year.",
        },
      },
      required: ["current_year", "previous_year"],
    },
    answer_key_release_date: {
      type: SchemaType.OBJECT,
      description: "Answer key release date for current and previous years.",
      properties: {
        current_year: {
          type: SchemaType.STRING,
          description: "Answer key release date for the current year.",
        },
        previous_year: {
          type: SchemaType.STRING,
          description: "Answer key release date for the previous year.",
        },
      },
      required: ["current_year", "previous_year"],
    },
    result_announcement_date: {
      type: SchemaType.OBJECT,
      description: "Result announcement date for current and previous years.",
      properties: {
        current_year: {
          type: SchemaType.STRING,
          description: "Result announcement date for the current year.",
        },
        previous_year: {
          type: SchemaType.STRING,
          description: "Result announcement date for the previous year.",
        },
      },
      required: ["current_year", "previous_year"],
    },
    counseling_start_date: {
      type: SchemaType.OBJECT,
      description: "Counseling start date for current and previous years.",
      properties: {
        current_year: {
          type: SchemaType.STRING,
          description: "Counseling start date for the current year.",
        },
        previous_year: {
          type: SchemaType.STRING,
          description: "Counseling start date for the previous year.",
        },
      },
      required: ["current_year", "previous_year"],
    },
    counseling_end_date: {
      type: SchemaType.OBJECT,
      description: "Counseling end date for current and previous years.",
      properties: {
        current_year: {
          type: SchemaType.STRING,
          description: "Counseling end date for the current year.",
        },
        previous_year: {
          type: SchemaType.STRING,
          description: "Counseling end date for the previous year.",
        },
      },
      required: ["current_year", "previous_year"],
    },
    counseling_result_announcement_date: {
      type: SchemaType.OBJECT,
      description: "Counseling result announcement date for current and previous years.",
      properties: {
        current_year: {
          type: SchemaType.STRING,
          description: "Counseling result announcement date for the current year.",
        },
        previous_year: {
          type: SchemaType.STRING,
          description: "Counseling result announcement date for the previous year.",
        },
      },
      required: ["current_year", "previous_year"],
    },
    additional_resources: {
      type: SchemaType.STRING,
      description: "Additional resources related to the exam.",
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
