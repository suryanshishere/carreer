import { SchemaType } from "@google/generative-ai";

const ageCriteria = {
  minimum_age: { type: SchemaType.NUMBER },
  maximum_age: { type: SchemaType.NUMBER },
  age_relaxation: { type: SchemaType.STRING },
};

const commonPromptSchema = {
  description:
    "Various common information field (may look up the schema keys for context)",
  type: SchemaType.OBJECT,
  properties: {
    short_information: { type: SchemaType.STRING },
    highlighted_information: { type: SchemaType.STRING },
    department: { type: SchemaType.STRING },
    stage_level: { type: SchemaType.STRING },
    applicants: {
      description: "Number of applicants applied and got selected",
      type: SchemaType.OBJECT,
      properties: {
        number_of_applicants_each_year: { type: SchemaType.NUMBER },
        number_of_applicants_selected: { type: SchemaType.NUMBER },
      },
    },
    post_importance: {
      description: "Importance of the given post",
      type: SchemaType.STRING,
    },
    job_type: { type: SchemaType.STRING },
    post_exam_duration: {
      description: "Post (if exam duration) in minutes",
      type: SchemaType.NUMBER,
    },
    age_criteria: {
      description: "Age criteria for different category",
      type: SchemaType.OBJECT,
      properties: ageCriteria,
    },
    vacancy: {
      description: "Vacancies information of the post",
      type: SchemaType.OBJECT,
      properties: {
        detail: {
          description: "Overall post name, total vacancy, and eligibility",
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              post_name: { type: SchemaType.STRING },
              total_post: { type: SchemaType.NUMBER },
              post_eligibility: { type: SchemaType.STRING },
            },
            required: ["post_name", "total_post", "post_eligibility"],
          },
        },
        category_wise: {
          description: "Category wise distribution of the vacancies",
          type: SchemaType.OBJECT,
          properties: {
            general: { type: SchemaType.NUMBER },
            obc: { type: SchemaType.NUMBER },
            ews: { type: SchemaType.NUMBER },
            sc: { type: SchemaType.NUMBER },
            st: { type: SchemaType.NUMBER },
            ph_dviyang: { type: SchemaType.NUMBER },
          },
        },
      },
    },
    eligibility: {
      type: SchemaType.OBJECT,
      properties: {
        minimum_qualification: { type: SchemaType.STRING },
        additional_qualification: { type: SchemaType.STRING },
      },
    },
    post_exam_mode: {
      type: SchemaType.STRING,
      enum: ["online", "offline_paper_based", "offline_computer_based"],
    },
    applicants_gender_that_can_apply: {
      type: SchemaType.STRING,
      enum: ["male", "female", "other", "all"],
    },
  },
  required: [
    "short_information",
    "highlighted_information",
    "department",
    "job_type",
    "age_criteria",
    "vacancy",
    "eligibility",
    "post_exam_mode",
    "applicants_gender_that_can_apply",
  ],
};

export default commonPromptSchema;
