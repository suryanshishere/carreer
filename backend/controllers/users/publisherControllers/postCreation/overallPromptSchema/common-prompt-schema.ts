import { SchemaType } from "@google/generative-ai";

const genderWiseVacancyCriteria = {
  type: SchemaType.OBJECT,
  properties: {
    general: { type: SchemaType.NUMBER },
    obc: { type: SchemaType.NUMBER },
    ews: { type: SchemaType.NUMBER },
    sc: { type: SchemaType.NUMBER },
    st: { type: SchemaType.NUMBER },
    ph_dviyang: { type: SchemaType.NUMBER },
  },
};

const ageCriteriaProperties = {
  minimum_age: { type: SchemaType.NUMBER },
  maximum_age: { type: SchemaType.NUMBER },
  age_relaxation: { type: SchemaType.STRING },
};

const genderWiseAgeCriteria = {
  type: SchemaType.OBJECT,
  properties: {
    general: { type: SchemaType.OBJECT, properties: ageCriteriaProperties },
    obc: { type: SchemaType.OBJECT, properties: ageCriteriaProperties },
    ews: { type: SchemaType.OBJECT, properties: ageCriteriaProperties },
    sc: { type: SchemaType.OBJECT, properties: ageCriteriaProperties },
    st: { type: SchemaType.OBJECT, properties: ageCriteriaProperties },
    ph_dviyang: { type: SchemaType.OBJECT, properties: ageCriteriaProperties },
  },
};

const commonPromptSchema = {
  description: "Schema for exam details including eligibility and vacancies.",
  type: SchemaType.OBJECT,
  properties: {
    short_information: { type: SchemaType.STRING },
    highlighted_information: { type: SchemaType.STRING },
    department: { type: SchemaType.STRING },
    stage_level: { type: SchemaType.STRING },
    applicants: {
      type: SchemaType.OBJECT,
      properties: {
        number_of_applicants_each_year: { type: SchemaType.NUMBER },
        number_of_applicants_selected: { type: SchemaType.NUMBER },
      },
    },
    post_importance: { type: SchemaType.STRING },
    post_exam_toughness_ranking: { type: SchemaType.NUMBER },
    job_type: { type: SchemaType.STRING },
    post_exam_duration: { type: SchemaType.NUMBER },
    age_criteria: {
      type: SchemaType.OBJECT,
      properties: {
        male: genderWiseAgeCriteria,
        female: genderWiseAgeCriteria,
        other: genderWiseAgeCriteria,
      },
    },
    vacancy: {
      type: SchemaType.OBJECT,
      properties: {
        detail: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              post_name: { type: SchemaType.STRING },
              total_post: { type: SchemaType.NUMBER },
              post_eligibility: { type: SchemaType.STRING },
            },
          },
        },
        category_wise: {
          type: SchemaType.OBJECT,
          properties: {
            male: genderWiseVacancyCriteria,
            female: genderWiseVacancyCriteria,
            other: genderWiseVacancyCriteria,
          },
        },
      },
    },
    eligibility: {
      type: SchemaType.OBJECT,
      properties: {
        minimum_qualification: { type: SchemaType.STRING },
        other_qualification: { type: SchemaType.STRING },
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
};

export default commonPromptSchema;
