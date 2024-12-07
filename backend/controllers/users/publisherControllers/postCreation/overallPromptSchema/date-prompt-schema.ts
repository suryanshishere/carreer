import { SchemaType } from "@google/generative-ai";

const getCurrentYearDate = () =>
  new Date(new Date().getFullYear(), 0, 1).toISOString(); // First day of the current year
const getPreviousYearDate = () =>
  new Date(new Date().getFullYear() - 1, 0, 1).toISOString(); // First day of the previous year

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
          format: "date-time",
          description: "Application start date for the current year.",
          default: getCurrentYearDate(), // Automatically set to current year's start date
        },
        previous_year: {
          type: SchemaType.STRING,
          format: "date-time",
          description: "Application start date for the previous year.",
          default: getPreviousYearDate(), // Automatically set to previous year's start date
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
          format: "date-time",
          description: "Application end date for the current year.",
          default: getCurrentYearDate(), // Set default for current year
        },
        previous_year: {
          type: SchemaType.STRING,
          format: "date-time",
          description: "Application end date for the previous year.",
          default: getPreviousYearDate(), // Set default for previous year
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
          format: "date-time",
          description: "Exam fee payment end date for the current year.",
          default: getCurrentYearDate(), // Set default for current year
        },
        previous_year: {
          type: SchemaType.STRING,
          format: "date-time",
          description: "Exam fee payment end date for the previous year.",
          default: getPreviousYearDate(), // Set default for previous year
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
          format: "date-time",
          description: "Form correction start date for the current year.",
          default: getCurrentYearDate(), // Set default for current year
        },
        previous_year: {
          type: SchemaType.STRING,
          format: "date-time",
          description: "Form correction start date for the previous year.",
          default: getPreviousYearDate(), // Set default for previous year
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
          format: "date-time",
          description: "Form correction end date for the current year.",
          default: getCurrentYearDate(), // Set default for current year
        },
        previous_year: {
          type: SchemaType.STRING,
          format: "date-time",
          description: "Form correction end date for the previous year.",
          default: getPreviousYearDate(), // Set default for previous year
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
          format: "date-time",
          description: "Exam date for the current year.",
          default: getCurrentYearDate(), // Set default for current year
        },
        previous_year: {
          type: SchemaType.STRING,
          format: "date-time",
          description: "Exam date for the previous year.",
          default: getPreviousYearDate(), // Set default for previous year
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
          format: "date-time",
          description: "Admit card release date for the current year.",
          default: getCurrentYearDate(), // Set default for current year
        },
        previous_year: {
          type: SchemaType.STRING,
          format: "date-time",
          description: "Admit card release date for the previous year.",
          default: getPreviousYearDate(), // Set default for previous year
        },
      },
      required: ["current_year", "previous_year"],
    },
    exam_city_details_release_date: {
      type: SchemaType.OBJECT,
      description:
        "Exam city details release date for current and previous years.",
      properties: {
        current_year: {
          type: SchemaType.STRING,
          format: "date-time",
          description: "Exam city details release date for the current year.",
          default: getCurrentYearDate(), // Set default for current year
        },
        previous_year: {
          type: SchemaType.STRING,
          format: "date-time",
          description: "Exam city details release date for the previous year.",
          default: getPreviousYearDate(), // Set default for previous year
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
          format: "date-time",
          description: "Answer key release date for the current year.",
          default: getCurrentYearDate(), // Set default for current year
        },
        previous_year: {
          type: SchemaType.STRING,
          format: "date-time",
          description: "Answer key release date for the previous year.",
          default: getPreviousYearDate(), // Set default for previous year
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
          format: "date-time",
          description: "Result announcement date for the current year.",
          default: getCurrentYearDate(), // Set default for current year
        },
        previous_year: {
          type: SchemaType.STRING,
          format: "date-time",
          description: "Result announcement date for the previous year.",
          default: getPreviousYearDate(), // Set default for previous year
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
          format: "date-time",
          description: "Counseling start date for the current year.",
          default: getCurrentYearDate(), // Set default for current year
        },
        previous_year: {
          type: SchemaType.STRING,
          format: "date-time",
          description: "Counseling start date for the previous year.",
          default: getPreviousYearDate(), // Set default for previous year
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
          format: "date-time",
          description: "Counseling end date for the current year.",
          default: getCurrentYearDate(), // Set default for current year
        },
        previous_year: {
          type: SchemaType.STRING,
          format: "date-time",
          description: "Counseling end date for the previous year.",
          default: getPreviousYearDate(), // Set default for previous year
        },
      },
      required: ["current_year", "previous_year"],
    },
    counseling_result_announcement_date: {
      type: SchemaType.OBJECT,
      description:
        "Counseling result announcement date for current and previous years.",
      properties: {
        current_year: {
          type: SchemaType.STRING,
          format: "date-time",
          description:
            "Counseling result announcement date for the current year.",
          default: getCurrentYearDate(), // Set default for current year
        },
        previous_year: {
          type: SchemaType.STRING,
          format: "date-time",
          description:
            "Counseling result announcement date for the previous year.",
          default: getPreviousYearDate(), // Set default for previous year
        },
      },
      required: ["current_year", "previous_year"],
    },
  },
};

export default datePromptSchema;
